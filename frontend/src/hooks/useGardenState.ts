import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ─────────────────────────────────────────

export type Emotion =
  | "happy" | "calm" | "stressed" | "anxious"
  | "lonely" | "overwhelmed" | "neutral";

export interface PlantState {
  id: string;
  type: "flower" | "fern" | "succulent" | "rose" | "willow" | "cactus" | "moss";
  emotion: Emotion;
  gridX: number;
  gridY: number;
  scale: number;
  phase: number;
  swayOffset: number;
  opacity: number;
}

export interface GardenState {
  emotion: Emotion;
  intensity: number;
  plants: PlantState[];
  timeOfDay: number;
  history: Array<{ emotion: Emotion; timestamp: number }>;
}

// ─── Constants ─────────────────────────────────────

const GRID_SIZE = 5;
const MAX_PLANTS = GRID_SIZE * GRID_SIZE;
const MAX_RETRIES = 20;
const STORAGE_KEY = "mindwell_garden_v4";

// ─── Emotion → Plant Mapping ───────────────────────

const PLANT_FOR_EMOTION: Record<Emotion, PlantState["type"][]> = {
  happy: ["flower", "rose"],
  calm: ["fern", "moss"],
  stressed: ["cactus"],
  anxious: ["willow"],
  lonely: ["willow", "moss"],
  overwhelmed: ["cactus", "willow"],
  neutral: ["fern", "succulent"],
};

// ─── Emotion Detection ─────────────────────────────

const EMOTION_KEYWORDS: Record<Emotion, string[]> = {
  happy: ["happy", "joy", "great", "love"],
  calm: ["calm", "peaceful", "relaxed"],
  stressed: ["stress", "pressure", "tired"],
  anxious: ["anxious", "nervous", "panic"],
  lonely: ["lonely", "alone", "sad"],
  overwhelmed: ["overwhelmed", "too much"],
  neutral: [],
};

export function detectEmotion(text: string) {
  const lower = text.toLowerCase();

  let best: Emotion = "neutral";
  let score = 0;

  for (const [emotion, words] of Object.entries(EMOTION_KEYWORDS) as [Emotion, string[]][]) {
    let s = 0;
    for (const w of words) if (lower.includes(w)) s++;
    if (s > score) {
      score = s;
      best = emotion;
    }
  }

  return { emotion: best, intensity: Math.min(1, score / 3) };
}

// ─── Grid System (Isometric 3D) ─────────────────────

function isCellOccupied(gx: number, gy: number, plants: PlantState[]) {
  return plants.some(p => p.gridX === gx && p.gridY === gy);
}

// ─── Plant Factory ─────────────────────────────────

function makePlant(
  id: string,
  emotion: Emotion,
  plants: PlantState[]
): PlantState {
  const types = PLANT_FOR_EMOTION[emotion];

  let gridX = 0;
  let gridY = 0;

  for (let i = 0; i < MAX_RETRIES; i++) {
    const gx = Math.floor(Math.random() * GRID_SIZE);
    const gy = Math.floor(Math.random() * GRID_SIZE);

    if (!isCellOccupied(gx, gy, plants)) {
      gridX = gx;
      gridY = gy;
      break;
    }
  }

  return {
    id,
    type: types[Math.floor(Math.random() * types.length)],
    emotion,
    gridX,
    gridY,
    scale: 0.8 + Math.random() * 0.4,
    phase: Math.random(),
    swayOffset: Math.random() * Math.PI * 2,
    opacity: 0,
  };
}

// ─── Default Canvas ────────────────────────────────

function defaultCanvas() {
  if (typeof window !== "undefined") {
    return { width: Math.min(window.innerWidth, 720), height: 380 };
  }
  return { width: 660, height: 380 };
}

// ─── Initial Plants ────────────────────────────────

function initialPlants() {
  const base: Emotion[] = ["calm", "neutral", "calm"];
  const plants: PlantState[] = [];

  base.forEach((e, i) => {
    const p = makePlant(`seed_${i}`, e, plants);
    p.opacity = 1;
    plants.push(p);
  });

  return plants;
}

// ─── MAIN HOOK ─────────────────────────────────────

export function useGardenState() {
  const [state, setState] = useState<GardenState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      emotion: "neutral",
      intensity: 0.3,
      plants: initialPlants(),
      timeOfDay: 0.5,
      history: [],
    };
  });
  useEffect(() => {
    const id = setInterval(() => {
      setState(prev => ({
        ...prev,
        plants: prev.plants.map(p => ({
          ...p,
          opacity: Math.min(1, p.opacity + 0.05),
        })),
      }));
    }, 50);
    return () => clearInterval(id);
  }, []);

  // save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // update
  const updateFromMessage = useCallback((text: string) => {
    const { emotion, intensity } = detectEmotion(text);

    setState(prev => {
      let plants = [...prev.plants];

      const count = Math.max(1, Math.round(intensity * 3));

      for (let i = 0; i < count; i++) {
        plants.push(
          makePlant(`p_${Date.now()}_${i}`, emotion, plants)
        );
      }

      if (plants.length > MAX_PLANTS) {
        plants = plants.slice(plants.length - MAX_PLANTS);
      }

      return {
        ...prev,
        emotion,
        intensity,
        plants,
        history: [...prev.history.slice(-20), { emotion, timestamp: Date.now() }],
      };
    });
  }, []);

  return {
    state,
    updateFromMessage,
  };
}