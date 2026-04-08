/**
 * GardenCanvas.tsx
 *
 * Isometric 3D garden renderer. Consumes GardenState from useGardenState.
 */

import React, { useRef, useEffect } from "react";
import type { PlantState, GardenState } from "../hooks/useGardenState";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GardenCanvasProps {
  gardenState: GardenState;
}

// ─── Constants & Iso Math ─────────────────────────────────────────────────────

const ISO_TILE_W = 44;
const ISO_TILE_H = 22;
const ISO_GRID_SIZE = 5;

// The top point of the 5x5 diamond
const ISO_CX = 360;
const ISO_CY = 110;

function toIso(col: number, row: number) {
  return {
    x: ISO_CX + (col - row) * ISO_TILE_W,
    y: ISO_CY + (col + row) * ISO_TILE_H,
  };
}

function toCellCenter(col: number, row: number) {
  return toIso(col + 0.5, row + 0.5);
}

// ─── Colour palette ───────────────────────────────────────────────────────────

const EMOTION_SKY: Record<string, [string, string]> = {
  happy: ["#FFF9C4", "#FFF3E0"],
  calm: ["#E0F7FA", "#E8F5E9"],
  stressed: ["#FBE9E7", "#FFF8E1"],
  anxious: ["#F3E5F5", "#EDE7F6"],
  lonely: ["#ECEFF1", "#E8EAF6"],
  overwhelmed: ["#F3E5F5", "#FCE4EC"],
  neutral: ["#E8F5E9", "#E0F2F1"],
};

// ─── Utility Components ───────────────────────────────────────────────────────

interface IsoCubeProps {
  yOff: number;
  w: number;
  h: number; // usually w / 2 for isometric
  d: number; // depth (height)
  colorTop: string;
  colorLeft: string;
  colorRight: string;
}

const IsoCube: React.FC<IsoCubeProps> = ({ yOff, w, h, d, colorTop, colorLeft, colorRight }) => (
  <g transform={`translate(0, ${-yOff})`}>
    <polygon points={`0,-${d} -${w},-${h + d} 0,-${2 * h + d} ${w},-${h + d}`} fill={colorTop} />
    <polygon points={`0,0 -${w},-${h} -${w},-${h + d} 0,-${d}`} fill={colorLeft} />
    <polygon points={`0,0 ${w},-${h} ${w},-${h + d} 0,-${d}`} fill={colorRight} />
  </g>
);

// ─── Individual Isometric Plant Components ────────────────────────────────────

interface PlantProps {
  plant: PlantState;
  t: number;
}

function sway(plant: PlantState, t: number, amplitude = 0.04): number {
  return Math.sin(t * 0.9 + plant.swayOffset) * amplitude;
}

// ── Flower (Fruit/Happy Tree) ─────────────────────────────────────────────────
const Flower: React.FC<PlantProps> = ({ plant, t }) => {
  const swayDeg = (sway(plant, t, 0.03) * 180) / Math.PI;
  return (
    <g transform={`rotate(${swayDeg})`} style={{ transformOrigin: "0 0" }}>
      <polygon points="-3,0 3,0 2,-40 -2,-40" fill="#8B5A2B" /> {/* Trunk */}
      <polygon points="0,-85 -25,-45 0,-35 25,-45" fill="#A1DE93" /> {/* Canopy L */}
      <polygon points="0,-85 0,-35 25,-45" fill="#7CC693" opacity="0.8" /> {/* Canopy R */}
      {/* Apples / Flowers */}
      <circle cx="-12" cy="-55" r="3.5" fill="#FFB3BA" />
      <circle cx="10" cy="-65" r="3.5" fill="#FFB3BA" />
      <circle cx="5" cy="-45" r="3.5" fill="#FF6B6B" />
      <circle cx="-5" cy="-70" r="3.5" fill="#FF6B6B" />
    </g>
  );
};

// ── Fern (Pine/Calm Tree) ─────────────────────────────────────────────────────
const Fern: React.FC<PlantProps> = ({ plant, t }) => {
  const swayDeg = (sway(plant, t, 0.02) * 180) / Math.PI;
  return (
    <g transform={`rotate(${swayDeg})`} style={{ transformOrigin: "0 0" }}>
      <polygon points="-2,0 2,0 1,-30 -1,-30" fill="#5C3A21" /> {/* Trunk */}
      
      {/* Bottom tier */}
      <polygon points="0,-45 -22,-15 0,-10 22,-15" fill="#52B788" />
      <polygon points="0,-45 0,-10 22,-15" fill="#40916C" opacity="0.6" />
      
      {/* Mid tier */}
      <polygon points="0,-60 -18,-25 0,-20 18,-25" fill="#74C69D" />
      <polygon points="0,-60 0,-20 18,-25" fill="#52B788" opacity="0.6" />
      
      {/* Top tier */}
      <polygon points="0,-75 -15,-40 0,-35 15,-40" fill="#95D5B2" />
      <polygon points="0,-75 0,-35 15,-40" fill="#74C69D" opacity="0.6" />
    </g>
  );
};

// ── Succulent (Neutral blocky bush) ───────────────────────────────────────────
const Succulent: React.FC<PlantProps> = () => {
  return (
    <g>
      <IsoCube yOff={0} w={14} h={7} d={12} colorTop="#D8F3DC" colorLeft="#B7E4C7" colorRight="#95D5B2" />
    </g>
  );
};

// ── Rose (Red flower bush) ────────────────────────────────────────────────────
const Rose: React.FC<PlantProps> = () => {
  return (
    <g>
      <IsoCube yOff={0} w={18} h={9} d={16} colorTop="#74C69D" colorLeft="#52B788" colorRight="#40916C" />
      {/* Rose buds */}
      <circle cx="-6" cy="-22" r="3" fill="#E63946" />
      <circle cx="8" cy="-18" r="3" fill="#E63946" />
      <circle cx="0" cy="-12" r="3" fill="#FFB3BA" />
    </g>
  );
};

// ── Willow (Anxious weeping tree) ─────────────────────────────────────────────
const Willow: React.FC<PlantProps> = ({ plant, t }) => {
  const swayDeg = (sway(plant, t, 0.05) * 180) / Math.PI;
  return (
    <g transform={`rotate(${swayDeg})`} style={{ transformOrigin: "0 0" }}>
      <polygon points="-4,0 4,0 2,-45 -2,-45" fill="#724A22" />
      {/* Droopy canopy using geometric rounded shapes */}
      <path d="M-25,-35 Q0,-80 25,-35 Q28,-15 15,-15 Q0,-35 -15,-15 Q-28,-15 -25,-35 Z" fill="#B7E4C7" />
      <path d="M0,-80 Q25,-35 28,-15 Q15,-15 0,-35 Z" fill="#95D5B2" opacity="0.8" />
    </g>
  );
};

// ── Cactus (Stressed blocky column) ───────────────────────────────────────────
const Cactus: React.FC<PlantProps> = () => {
  return (
    <g>
      <IsoCube yOff={0} w={6} h={3} d={40} colorTop="#95D5B2" colorLeft="#74C69D" colorRight="#52B788" />
      <IsoCube yOff={15} w={10} h={5} d={6} colorTop="#95D5B2" colorLeft="#74C69D" colorRight="#52B788" />
      <g transform="translate(-10, -15)">
        <IsoCube yOff={0} w={4} h={2} d={15} colorTop="#95D5B2" colorLeft="#74C69D" colorRight="#52B788" />
      </g>
      <g transform="translate(6, -25)">
        <IsoCube yOff={0} w={8} h={4} d={5} colorTop="#95D5B2" colorLeft="#74C69D" colorRight="#52B788" />
        <g transform="translate(4, 0)">
          <IsoCube yOff={0} w={4} h={2} d={12} colorTop="#95D5B2" colorLeft="#74C69D" colorRight="#52B788" />
        </g>
      </g>
    </g>
  );
};

// ── Moss (Lonely flat patches) ────────────────────────────────────────────────
const Moss: React.FC<PlantProps> = () => {
  return (
    <g>
      <polygon points="-18,0 0,-9 18,0 0,9" fill="#7CC693" opacity="0.9" />
      <polygon points="-8,4 6,-3 14,3 0,10" fill="#52B788" opacity="0.7" />
      <polygon points="-22,-5 -4,-14 10,-5 -8,4" fill="#A1DE93" opacity="0.8" />
    </g>
  );
};

const PLANT_COMPONENTS: Record<PlantState["type"], React.FC<PlantProps>> = {
  flower: Flower,
  fern: Fern,
  succulent: Succulent,
  rose: Rose,
  willow: Willow,
  cactus: Cactus,
  moss: Moss,
};

// ─── Single placed plant ──────────────────────────────────────────────────────

const PlantNode: React.FC<{ plant: PlantState; t: number }> = ({ plant, t }) => {
  const Component = PLANT_COMPONENTS[plant.type];
  if (!Component) return null;

  const { x, y } = toCellCenter(plant.gridX, plant.gridY);

  return (
    <g
      key={plant.id}
      transform={`translate(${x}, ${y}) scale(${plant.scale})`}
      opacity={plant.opacity}
      style={{ transition: "opacity 0.4s ease" }}
    >
      <Component plant={plant} t={t} />
    </g>
  );
};

// ─── Ground / sky helpers ─────────────────────────────────────────────────────

const GardenBackground: React.FC<{ width: number; height: number; emotion: string }> = ({ width, height, emotion }) => {
  const [skyTop, skyBottom] = EMOTION_SKY[emotion] ?? EMOTION_SKY.neutral;

  const ptTop = toIso(0, 0);
  const ptRight = toIso(ISO_GRID_SIZE, 0);
  const ptBottom = toIso(ISO_GRID_SIZE, ISO_GRID_SIZE);
  const ptLeft = toIso(0, ISO_GRID_SIZE);

  const blockDepth = 30;

  return (
    <>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.07)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width={width} height={height} fill="url(#skyGrad)" />

      {/* Isometric Block Base */}
      <g>
        {/* Left Dirt Face */}
        <polygon
           points={`${ptLeft.x},${ptLeft.y} ${ptBottom.x},${ptBottom.y} ${ptBottom.x},${ptBottom.y + blockDepth} ${ptLeft.x},${ptLeft.y + blockDepth}`}
           fill="#8B5A2B"
        />
        {/* Right Dirt Face */}
        <polygon
           points={`${ptBottom.x},${ptBottom.y} ${ptRight.x},${ptRight.y} ${ptRight.x},${ptRight.y + blockDepth} ${ptBottom.x},${ptBottom.y + blockDepth}`}
           fill="#724A22"
        />
        {/* Top Grass Face */}
        <polygon
           points={`${ptTop.x},${ptTop.y} ${ptRight.x},${ptRight.y} ${ptBottom.x},${ptBottom.y} ${ptLeft.x},${ptLeft.y}`}
           fill="#88D49E"
        />

        {/* Grid Lines */}
        {Array.from({ length: ISO_GRID_SIZE + 1 }).map((_, i) => {
          const p1 = toIso(i, 0);
          const p2 = toIso(i, ISO_GRID_SIZE);
          return <line key={`gx_${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#7CC693" strokeWidth="1" strokeDasharray="4 2"/>;
        })}
        {Array.from({ length: ISO_GRID_SIZE + 1 }).map((_, i) => {
          const p1 = toIso(0, i);
          const p2 = toIso(ISO_GRID_SIZE, i);
          return <line key={`gy_${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#7CC693" strokeWidth="1" strokeDasharray="4 2"/>;
        })}
      </g>

      <rect x="0" y="0" width={width} height={height} fill="url(#vignette)" style={{ pointerEvents: 'none' }} />
    </>
  );
};

// ─── Main GardenCanvas component ──────────────────────────────────────────────

const GardenCanvas: React.FC<GardenCanvasProps> = ({ gardenState }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const tRef = useRef(0);
  const [tick, setTick] = React.useState(0);

  useEffect(() => {
    let raf: number;
    let lastTime = performance.now();
    const loop = (now: number) => {
      tRef.current += (now - lastTime) / 1000;
      lastTime = now;
      setTick(t => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sort plants by depth (painter's algorithm for isometric projection)
  const sortedPlants = [...gardenState.plants].sort((a, b) => (a.gridX + a.gridY) - (b.gridX + b.gridY));

  // The 3D internal coordinates are firmly locked 720 x 380 ensuring zero layout drift
  const svgWidth = 720;
  const svgHeight = 380;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      preserveAspectRatio="xMidYMid slice"
      style={{
        width: "100%",
        height: "clamp(260px, 40vw, 420px)",
        display: "block",
        borderRadius: "12px",
      }}
      aria-label="Isometric Emotional garden visualization"
    >
      <GardenBackground width={svgWidth} height={svgHeight} emotion={gardenState.emotion} />

      {sortedPlants.map(plant => (
        <PlantNode key={plant.id} plant={plant} t={tRef.current} />
      ))}
    </svg>
  );
};

export default GardenCanvas;