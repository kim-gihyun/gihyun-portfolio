"use client";

import { ModelViewer } from "@/components/three/ModelViewer";
import { GyroidHero } from "@/components/three/GyroidHero";
import type { Project } from "@/lib/data/projects";

export function ActiveViewer({ project }: { project: Project }) {
  if (project.model === "__gyroid__") {
    return (
      <div className="pf-canvas pf-canvas--gyroid" data-cursor="drag" data-cursor-label="live surface">
        <GyroidHero className="pf-gyroid" />
        <span className="model-hint readout" aria-hidden>
          live · ray-marched gyroid
        </span>
      </div>
    );
  }
  return (
    <ModelViewer
      key={project.id}
      src={project.model}
      orient={project.orient}
      className="pf-canvas"
      label={project.title}
    />
  );
}
