"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "@/components/three/Globe";
import { useTheme } from "@/lib/theme";
import { places, travelStats, type Place } from "@/lib/data/travel";

const kindLabel: Record<Place["kind"], string> = {
  now: "Now",
  lived: "Lived",
  visited: "Visited",
};

export function JourneyGlobe() {
  const { theme } = useTheme();
  const [active, setActive] = useState<Place | null>(null);
  const shown = active ?? places.find((p) => p.kind === "now")!;

  return (
    <div className="journey">
      <div className="journey-globe">
        <Globe places={places} dark={theme === "dark"} onActive={setActive} />
        <div className="journey-legend readout">
          <span><i className="lg-dot lg-now" /> now</span>
          <span><i className="lg-dot lg-lived" /> lived</span>
          <span><i className="lg-dot lg-visited" /> visited</span>
        </div>
      </div>

      <div className="journey-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={shown.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="journey-card"
          >
            <span className="readout">{kindLabel[shown.kind]} · {shown.stat}</span>
            <h3>{shown.name}</h3>
            {shown.years && <p className="journey-years readout">{shown.years}</p>}
            <p className="journey-quip">{shown.quip}</p>
          </motion.div>
        </AnimatePresence>

        <ul className="journey-list">
          {places.map((p) => (
            <li key={p.name}>
              <button
                type="button"
                className={`journey-place ${shown.name === p.name ? "is-active" : ""}`}
                onMouseEnter={() => setActive(p)}
                onFocus={() => setActive(p)}
                onClick={() => setActive(p)}
                data-cursor="link"
              >
                <i className={`lg-dot lg-${p.kind}`} />
                <span>{p.name}</span>
                <span className="readout journey-place-stat">{p.stat}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="journey-stats">
          {travelStats.map((s) => (
            <div key={s.k}>
              <span className="readout">{s.k}</span>
              <b>{s.v}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
