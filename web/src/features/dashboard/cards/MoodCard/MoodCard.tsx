import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Lottie from "lottie-react";
import "./MoodCard.css";
import { EnergyStyle } from "@shared/components/GlassEnergyCard/GlassCard";

import lazyAnim from "@assets/lottie/lazy.json";
import delightedAnim from "@assets/lottie/delighted.json";
import happyAnim from "@assets/lottie/happy.json";
import lowAnim from "@assets/lottie/low.json";
import angryAnim from "@assets/lottie/angry.json";
import unsureAnim from "@assets/lottie/unsure.json";
import blessedAnim from "@assets/lottie/blessed.json";

/* ===============================
   Types
   =============================== */

export type MoodId =
  | "unset"
  | "delighted"
  | "blessed"
  | "happy"
  | "lazy"
  | "low"
  | "angry";

interface MoodOption {
  id: MoodId;
  label: string;
  animation: any;
}

export const MOOD_THEME: Record<
  MoodId,
  { color: string; energy: EnergyStyle }
> = {
  unset: {
    color: "var(--color-bg-mood-unset)",
    energy: "dual-pulse",
  },
  delighted: {
    color: "var(--color-bg-mood-delighted)",
    energy: "dual-pulse",
  },
  blessed: {
    color: "var(--color-bg-mood-blessed)",
    energy: "dual-pulse",
  },
  happy: {
    color: "var(--color-bg-mood-happy)",
    energy: "dual-pulse",
  },
  lazy: {
    color: "var(--color-bg-mood-lazy)",
    energy: "dual-pulse",
  },
  low: {
    color: "var(--color-bg-mood-low)",
    energy: "dual-pulse",
  },
  angry: {
    color: "var(--color-bg-mood-angry)",
    energy: "dual-pulse",
  },
};

const OVERLAY_DURATION_MS = 1500;

const MOODS: MoodOption[] = [
  { id: "delighted", label: "Delighted", animation: delightedAnim },
  { id: "blessed", label: "Blessed", animation: blessedAnim },
  { id: "happy", label: "Happy", animation: happyAnim },
  { id: "lazy", label: "Lazy", animation: lazyAnim },
  { id: "low", label: "Low", animation: lowAnim },
  { id: "angry", label: "Angry", animation: angryAnim },
];

const UNSET_MOOD: MoodOption = {
  id: "unset",
  label: "Not set",
  animation: unsureAnim,
};

/* ===============================
   Component
   =============================== */

export default function MoodCard({
  onMoodChange,
}: {
  onMoodChange?: (moodId: MoodId) => void;
}) {
  const [currentMood, setCurrentMood] = useState<MoodOption>(UNSET_MOOD);
  const [open, setOpen] = useState(false);
  const [overlayMood, setOverlayMood] = useState<MoodOption | null>(null);
  const [position, setPosition] =
    useState<{ top: number; left: number } | null>(null);

  const anchorRef = useRef<HTMLButtonElement>(null);

  /* Flyout positioning */
  useEffect(() => {
    if (!open || !anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    setPosition({
      top: rect.top - 80,
      left: rect.left + rect.width / 2,
    });
  }, [open]);

  /* Auto-dismiss overlay */
  useEffect(() => {
    if (!overlayMood) return;
    const timer = setTimeout(() => setOverlayMood(null), OVERLAY_DURATION_MS);
    return () => clearTimeout(timer);
  }, [overlayMood]);

  return (
    <>
      {/* Anchor */}
      <button
        ref={anchorRef}
        className="mood-anchor"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Lottie
          animationData={currentMood.animation}
          loop
          className="mood-lottie-anchor"
        />
      </button>

      {/* Flyout */}
      {open && position &&
        createPortal(
          <div
            className="mood-flyout"
            style={{ top: position.top, left: position.left }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {MOODS.map(mood => (
              <button
                key={mood.id}
                className={`mood-option ${
                  mood.id === currentMood.id ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentMood(mood);
                  setOverlayMood(mood);
                  onMoodChange?.(mood.id);
                  setOpen(false);
                }}
              >
                <Lottie
                  animationData={mood.animation}
                  loop
                  className="mood-lottie-option"
                />
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}

      {/* Overlay */}
      {overlayMood &&
        createPortal(
          <div className="mood-overlay">
            <div className="mood-overlay-text">
              <span className="mood-overlay-subtitle">Feeling</span>
              <span className="mood-overlay-title">
                {overlayMood.label}
              </span>
            </div>

            <Lottie
              animationData={overlayMood.animation}
              loop={false}
              className="mood-overlay-lottie"
            />

            <span className="mood-overlay-subtitle">
              Logged for{" "}
              {new Date().toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>,
          document.body
        )}
    </>
  );
}