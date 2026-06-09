// Quiet background: a soft accent glow + a fine static grain. No animation,
// no canvas — just depth and texture behind the content.
export default function Atmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
      <div className="atmo-glow" />
      <div className="atmo-grain" />
    </div>
  );
}
