import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { JourneyGlobe } from "@/components/personal/JourneyGlobe";
import { Keyboards } from "@/components/personal/Keyboards";
import { Gallery } from "@/components/ui/Gallery";
import { songs, photos } from "@/lib/data/offduty";

export const metadata: Metadata = {
  title: "Off-Duty",
  description:
    "Off the clock — an interactive globe of where Gihyun Kim has lived and travelled, a shrine to mechanical keyboards, songs on repeat, and life in photographs.",
};

export default function PersonalPage() {
  return (
    <div className="page personal">
      <PageHeader
        index="04"
        kicker="As built"
        title="Off-duty"
        lede="The as-built drawing: where I&rsquo;ve lived, the boards I obsess over, what&rsquo;s on repeat, and a few photos with the dates that matter."
      />

      {/* globe */}
      <section className="section shell">
        <div className="section-head">
          <h2 className="section-title">Spin the route</h2>
          <span className="section-note readout">drag to rotate · hover a pin</span>
        </div>
        <JourneyGlobe />
      </section>

      {/* keyboards */}
      <section className="section shell" id="keebs">
        <div className="section-head">
          <h2 className="section-title">A shrine to small clicky things</h2>
        </div>
        <p className="section-note measure">
          I have opinions about keyboards that exceed any reasonable need. Here&rsquo;s the short version:
          ergonomics first, sound second, and yes I will re-lube your stabilisers if you ask nicely.
        </p>
        <Reveal>
          <Keyboards />
        </Reveal>
      </section>

      {/* songs */}
      <section className="section shell">
        <div className="section-head">
          <h2 className="section-title">On repeat</h2>
          <span className="section-note readout">the build playlist · {songs.length} tracks</span>
        </div>
        <Reveal className="song-list" stagger={0.06}>
          {songs.map((s) => (
            <a key={s.title} className="song" href={s.href} target="_blank" rel="noopener" data-cursor="link">
              <span className="song-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.cover} alt={`${s.title} cover`} loading="lazy" />
              </span>
              <span className="song-text">
                <b>{s.title}</b>
                <span className="song-artist">{s.artist}</span>
              </span>
              <span className="song-play" aria-hidden>
                ▶
              </span>
            </a>
          ))}
        </Reveal>
      </section>

      {/* photos */}
      <section className="section shell">
        <div className="section-head">
          <h2 className="section-title">Daily life, dated</h2>
          <span className="section-note readout">10 plates · 2019—2026</span>
        </div>
        <Reveal>
          <Gallery
            images={photos.map((p) => ({ src: p.src, alt: `${p.caption} · ${p.year}` }))}
            className="photo-gallery"
          />
        </Reveal>
      </section>
    </div>
  );
}
