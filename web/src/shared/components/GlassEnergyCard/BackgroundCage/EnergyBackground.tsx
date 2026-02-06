type EnergyBackgroundProps = {
  color: string;
  styleType: 'fluid-waves' | 'dual-pulse';
};

export default function EnergyBackground({
  color,
  styleType
}: EnergyBackgroundProps) {
  return (
    <div
      className={`item-gradient-overlay ${styleType}`}
      style={{
        '--widget-accent': color,
        '--widget-accent-deep': `color-mix(in srgb, ${color}, black 30%)`,
        '--widget-accent-light': `color-mix(in srgb, ${color}, white 30%)`
      } as React.CSSProperties}
    />
  );
}
