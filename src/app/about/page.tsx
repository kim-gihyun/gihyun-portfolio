import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Gihyun Kim grew up across Seoul, London, and Istanbul, and now studies at HKU — working at the intersection of applied mathematics and advanced material engineering.",
};

export default function AboutPage() {
  return (
    <div className="page about">
      <PageHeader
        index="03"
        kicker="General notes"
        title="About"
        lede="A short version of how a kid who moved every few years ended up generating gyroids in MATLAB and machining robot parts at midnight."
      />

      <section className="shell about-lead">
        <div className="about-lead-text">
          <TextReveal
            as="h2"
            className="about-statement"
            text="I like the exact moment a part finally fits."
          />
          <Reveal className="about-lead-cols" stagger={0.12}>
            <p>
              I&rsquo;m an engineering student at the <strong>University of Hong Kong</strong>, majoring in
              Mechanical Engineering and reading toward the BEng X + MScEng in AI Engineering on a full
              scholarship. I grew up in South Korea, spent five and a half years between London and Istanbul,
              and now live between Hong Kong and Seoul.
            </p>
            <p>
              The work I like best sits where mechanical design, electronics, and software meet: an idea
              becomes a CAD model, the model becomes a printed or machined part, and the part becomes something
              that actually moves. As a <strong>Laidlaw Scholar</strong> I study urban atmospheric turbulence;
              in the <strong>Shin Group</strong> I build 3D-printed triboelectric sensors; with{" "}
              <strong>HKU Robocon</strong> and <strong>HKU Racing</strong> I make parts that have to survive
              competition.
            </p>
          </Reveal>
        </div>
        <figure className="about-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/profile.jpg" alt="Gihyun Kim at Victoria Harbour, Hong Kong" loading="lazy" />
          <figcaption className="readout">Fig. 1 — Victoria Harbour, HK · 2026</figcaption>
        </figure>
      </section>

      {/* pull quote */}
      <section className="shell about-quote">
        <Reveal>
          <blockquote>
            <span className="about-quote-mark" aria-hidden>
              &ldquo;
            </span>
            An idea becomes a CAD model, the model becomes a part, and the part becomes something that moves.
            That last step is still the one I chase.
          </blockquote>
        </Reveal>
      </section>

      {/* math <-> matter */}
      <section className="shell about-duo">
        <Reveal className="about-duo-head">
          <h2>Two languages, one bench</h2>
          <p className="measure">
            I keep one foot in the rigorous logic of applied mathematics and the other in the stubborn physics
            of real materials. The interesting problems live where the two argue.
          </p>
        </Reveal>
        <div className="about-duo-grid">
          <Reveal className="about-duo-card about-duo-card--math">
            <span className="readout">A — the clean side</span>
            <h3>Applied mathematics</h3>
            <p>
              Linear algebra, complex analysis, the implicit surface of a gyroid written as one tidy equation.
              Where things are provable, elegant, and exactly as you specify them.
            </p>
            <code className="about-eq">sin x cos y + sin y cos z + sin z cos x = 0</code>
          </Reveal>
          <Reveal className="about-duo-card about-duo-card--matter" delay={0.1}>
            <span className="readout">B — the stubborn side</span>
            <h3>Material engineering</h3>
            <p>
              TPU that warps mid-print, C-TPU whose resistance drifts for 250 cycles before it settles, a
              tolerance that only matters once the part is in your hand. Where the equation meets friction.
            </p>
            <code className="about-eq">Δ = nominal − as-built ≠ 0</code>
          </Reveal>
        </div>
      </section>

      {/* now */}
      <section className="shell about-now">
        <Reveal className="about-facts" stagger={0.08}>
          <div className="about-fact">
            <span className="readout">Based in</span>
            <b>Hong Kong / Seoul</b>
          </div>
          <div className="about-fact">
            <span className="readout">Majoring</span>
            <b>Mechanical Engineering</b>
          </div>
          <div className="about-fact">
            <span className="readout">Focus</span>
            <b>Triboelectric materials · robotics · applied AI</b>
          </div>
          <div className="about-fact">
            <span className="readout">Also</span>
            <b>Founds study clubs · TAs physics &amp; math</b>
          </div>
        </Reveal>
        <Reveal className="about-cta">
          <p>This site is a specimen catalogue — every page is a sheet.</p>
          <div className="about-cta-links">
            <Link href="/portfolio" className="btn" data-cursor="link">
              See the work →
            </Link>
            <Link href="/cv" className="btn btn--ghost" data-cursor="link">
              Read the CV
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
