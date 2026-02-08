import React from "react";
import "./GlassCard.css";

export type EnergyStyle = "fluid-waves" | "dual-pulse";

/* ===============================
   Props
   =============================== */

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  accent?: string;
  energy?: EnergyStyle;
  className?: string;
};

type CSSVars = React.CSSProperties & {
  "--widget-accent"?: string;
  "--widget-accent-light"?: string;
  "--widget-accent-deep"?: string;
};

/* ===============================
   Component
   =============================== */

export default function GlassCard({
  children,
  accent = "#62a145",
  energy,
  className = "",
  style,
  ...rest
}: GlassCardProps) {
  const styleVars: CSSVars = {
    "--widget-accent": accent,
    "--widget-accent-light": `color-mix(in srgb, ${accent}, white 35%)`,
    "--widget-accent-deep": `color-mix(in srgb, ${accent}, black 30%)`,
    ...style,
  };

  return (
    <div
      {...rest}
      className={`glass-card ${className}`}
      style={styleVars}
    >
      <div className="glass-card-bg">
        {energy && <div className={`energy-layer ${energy}`} />}
      </div>

      <div className="glass-card-content">
        {children}
      </div>
    </div>
  );
}
