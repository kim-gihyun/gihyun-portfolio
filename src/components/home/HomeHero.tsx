"use client";

import Link from "next/link";
import { GyroidHero } from "@/components/three/GyroidHero";
import { TextReveal } from "@/components/ui/TextReveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { profile } from "@/lib/data/profile";

export function HomeHero() {
  return (
    <section className="hero">
      <GyroidHero className="hero-canvas" />

      <div className="hero-grid shell">
        <div className="hero-top">
          <span className="readout">Specimen catalogue — GK-26</span>
          <span className="readout hero-coord tnum">22.28°N · 114.17°E</span>
        </div>

        <div className="hero-head">
          <h1 className="hero-title">
            <TextReveal as="span" text="Gihyun" className="hero-line" trigger={false} delay={0.2} />
            <TextReveal as="span" text="Kim" className="hero-line hero-line--accent" trigger={false} delay={0.32} />
          </h1>
          <p className="hero-sub">
            <span className="hero-role">{profile.role}</span>
            <span className="hero-tag">{profile.tagline}</span>
          </p>
        </div>

        <div className="hero-foot">
          <p className="hero-blurb measure">
            Engineering student at the University of Hong Kong, working where mechanical design,
            materials, and code meet — from MATLAB-generated gyroids to machined robot parts that
            actually move.
          </p>
          <div className="hero-cta">
            <Magnetic strength={0.4}>
              <Link href="/portfolio" className="btn" data-cursor="link">
                Open the work <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.4}>
              <a href={profile.cvPdf} target="_blank" rel="noopener" className="btn btn--ghost" data-cursor="link">
                CV / PDF
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="hero-scroll readout" aria-hidden>
        <span>scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}
