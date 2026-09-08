export default function Preloader() {
  return (
    <div
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-cream text-charcoal"
      role="status"
      aria-label="Loading Lunora Fashion"
    >
      <div className="w-[min(11rem,60vw)] text-center">
        <div className="mb-8">
          <span className="block text-[10px] uppercase tracking-[0.45em] text-neutral-500">
            LUNORA
          </span>
          <span className="heading-serif block text-xl tracking-[0.18em] text-neutral-900">
            Fashion
          </span>
        </div>
        <div className="preloader-line h-px w-full overflow-hidden bg-neutral-300">
          <div className="h-full w-2/5 bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}
