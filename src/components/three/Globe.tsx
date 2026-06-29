"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Place } from "@/lib/data/travel";
import { prefersReducedMotion } from "@/lib/theme";

const R = 1.4;

function latLonToVec3(lat: number, lon: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function Graticule({ color }: { color: string }) {
  const geo = useMemo(() => {
    const pts: number[] = [];
    // latitudes
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 6) {
        const a = latLonToVec3(lat, lon);
        const b = latLonToVec3(lat, lon + 6);
        pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    // longitudes
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -84; lat < 84; lat += 6) {
        const a = latLonToVec3(lat, lon);
        const b = latLonToVec3(lat + 6, lon);
        pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={0.22} />
    </lineSegments>
  );
}

function Dots({ color }: { color: string }) {
  const geo = useMemo(() => {
    const N = 900;
    const pts: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push(Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial color={color} size={0.014} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function Arc({ from, to, accent, reduced }: { from: Place; to: Place; accent: string; reduced: boolean }) {
  const curve = useMemo(() => {
    const a = latLonToVec3(from.lat, from.lon);
    const b = latLonToVec3(to.lat, to.lon);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const lift = 1 + a.distanceTo(b) * 0.35;
    mid.normalize().multiplyScalar(R * lift);
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to]);

  const geo = useMemo(() => new THREE.TubeGeometry(curve, 60, 0.006, 6, false), [curve]);
  const dot = useRef<THREE.Mesh>(null);
  const off = useMemo(() => (from.lat + to.lon) / 360 - Math.floor((from.lat + to.lon) / 360), [from, to]);
  useFrame((s) => {
    if (!dot.current) return;
    const t = reduced ? 0.5 : (s.clock.elapsedTime * 0.18 + off) % 1;
    dot.current.position.copy(curve.getPoint(t));
  });
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function Marker({
  place,
  accent,
  ink,
  active,
  reduced,
  onHover,
}: {
  place: Place;
  accent: string;
  ink: string;
  active: boolean;
  reduced: boolean;
  onHover: (p: Place | null) => void;
}) {
  const pos = useMemo(() => latLonToVec3(place.lat, place.lon, R + 0.01), [place]);
  const ring = useRef<THREE.Mesh>(null);
  const isHome = place.kind !== "visited";
  const col = isHome ? accent : ink;
  useFrame((s) => {
    if (ring.current && place.kind === "now" && !reduced) {
      const k = 1 + Math.sin(s.clock.elapsedTime * 2.4) * 0.18;
      ring.current.scale.setScalar(k);
    }
  });
  return (
    <group
      position={pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(place);
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh>
        <sphereGeometry args={[active ? 0.04 : 0.028, 16, 16]} />
        <meshBasicMaterial color={col} />
      </mesh>
      {place.kind === "now" && (
        <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.062, 32]} />
          <meshBasicMaterial color={accent} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function Scene({
  places,
  accent,
  ink,
  active,
  reduced,
  setActive,
}: {
  places: Place[];
  accent: string;
  ink: string;
  active: Place | null;
  reduced: boolean;
  setActive: (p: Place | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const lived = useMemo(() => {
    const byName = (n: string) => places.find((p) => p.name === n)!;
    return [byName("Seoul"), byName("London"), byName("Istanbul"), byName("Seoul"), byName("Hong Kong")].filter(Boolean);
  }, [places]);

  useFrame((_, d) => {
    if (group.current && !active && !reduced) group.current.rotation.y += d * 0.06;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color={ink} transparent opacity={0.04} />
      </mesh>
      <Graticule color={ink} />
      <Dots color={ink} />
      {lived.slice(0, -1).map((from, i) =>
        from.name === lived[i + 1].name ? null : (
          <Arc key={i} from={from} to={lived[i + 1]} accent={accent} reduced={reduced} />
        ),
      )}
      {places.map((p) => (
        <Marker
          key={p.name}
          place={p}
          accent={accent}
          ink={ink}
          active={active?.name === p.name}
          reduced={reduced}
          onHover={setActive}
        />
      ))}
    </group>
  );
}

export function Globe({
  places,
  dark,
  onActive,
}: {
  places: Place[];
  dark: boolean;
  onActive?: (p: Place | null) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState<Place | null>(null);
  useEffect(() => {
    setMounted(true);
    setReduced(prefersReducedMotion());
  }, []);
  useEffect(() => onActive?.(active), [active, onActive]);

  const ink = dark ? "#c2cad6" : "#2a3340";
  const accent = dark ? "#ff7a45" : "#e0521d";

  if (!mounted) return <div className="globe-canvas" aria-hidden />;

  return (
    <div className="globe-canvas" data-cursor="drag" data-cursor-label="drag to spin">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.5, 4.1], fov: 42 }} gl={{ alpha: true, antialias: true }}>
        <Scene places={places} accent={accent} ink={ink} active={active} reduced={reduced} setActive={setActive} />
        <OrbitControls enablePan={false} enableZoom={false} enableDamping dampingFactor={0.08} rotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
