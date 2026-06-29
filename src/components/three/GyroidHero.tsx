"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";
import { useTheme, prefersReducedMotion } from "@/lib/theme";

/* The gyroid: sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x) = 0,
   ray-marched as a thick shell and lit per-pixel. */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uRes;
  uniform vec3  uInk;
  uniform vec3  uAccent;

  mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
  mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,-s, 0.,s,c); }

  float gyroid(vec3 p){
    return sin(p.x)*cos(p.y) + sin(p.y)*cos(p.z) + sin(p.z)*cos(p.x);
  }
  vec3 gyroidNormal(vec3 p){
    float e = 0.012;
    vec2 h = vec2(e, 0.0);
    return normalize(vec3(
      gyroid(p+h.xyy) - gyroid(p-h.xyy),
      gyroid(p+h.yxy) - gyroid(p-h.yxy),
      gyroid(p+h.yyx) - gyroid(p-h.yyx)
    ));
  }

  void main(){
    vec2 p = (vUv * 2.0 - 1.0);
    p.x *= uRes.x / uRes.y;

    vec3 ro = vec3(0.0, 0.0, 4.2);
    vec3 rd = normalize(vec3(p * 0.62, -1.0));

    float ax = 0.30 + uMouse.y * 0.45 + sin(uTime*0.12)*0.12;
    float ay = uTime * 0.10 + uMouse.x * 0.7;
    mat3 rot = rotY(ay) * rotX(ax);

    float scale = 1.7;
    float thick = 0.32;

    float t = 1.6;
    float hit = -1.0;
    vec3 hp = vec3(0.0);
    float prev = 0.0;
    for(int i=0;i<96;i++){
      vec3 pos = ro + rd * t;
      vec3 q = rot * pos;
      float g = abs(gyroid(q * scale)) - thick;
      if(g < 0.0){ hit = t; hp = q; break; }
      t += 0.055 + t*0.012;
      if(t > 7.5) break;
      prev = g;
    }

    vec3 col = uInk;
    float alpha = 0.0;
    if(hit > 0.0){
      vec3 n = gyroidNormal(hp * scale);
      vec3 ld = normalize(vec3(0.5, 0.8, 0.6));
      float diff = clamp(dot(n, ld) * 0.5 + 0.5, 0.0, 1.0);
      float rim = pow(1.0 - clamp(dot(n, normalize(-(rot*rd))), 0.0, 1.0), 2.4);
      // depth fade so the lattice dissolves toward the back
      float depth = smoothstep(7.4, 2.2, hit);

      vec3 base = mix(uInk, uAccent, smoothstep(0.35, 1.0, diff));
      base = mix(base, uAccent, rim * 0.9);
      col = base;
      alpha = depth * (0.30 + diff * 0.7);
      alpha = clamp(alpha, 0.0, 0.96);
    }
    gl_FragColor = vec4(col, alpha);
  }
`;

function hexToRGB(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function GyroidQuad({ dark, reduced }: { dark: boolean; reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uInk: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() },
    }),
    [],
  );

  useEffect(() => {
    const ink = dark ? hexToRGB("#aab3c2") : hexToRGB("#222932");
    const acc = dark ? hexToRGB("#ff7a45") : hexToRGB("#e0521d");
    uniforms.uInk.value.setRGB(ink[0], ink[1], ink[2]);
    uniforms.uAccent.value.setRGB(acc[0], acc[1], acc[2]);
  }, [dark, uniforms]);

  // Track the cursor at the window level — the canvas sits behind hero content,
  // so it would never receive its own pointer events.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!reduced) uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
    mouse.current.lerp(target.current, 0.05);
    uniforms.uMouse.value.copy(mouse.current);
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export function GyroidHero({ className }: { className?: string }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setMounted(true);
    setReduced(prefersReducedMotion());
  }, []);

  if (!mounted) return <div className={`gyroid-hero ${className ?? ""}`} aria-hidden />;

  return (
    <div className={`gyroid-hero ${className ?? ""}`} aria-hidden>
      <Canvas dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 1] }}>
        <GyroidQuad dark={theme === "dark"} reduced={reduced} />
      </Canvas>
    </div>
  );
}
