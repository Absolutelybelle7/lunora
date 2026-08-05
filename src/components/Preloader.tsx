export default function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-black/10 border-t-black animate-spin" />
        <div className="text-sm uppercase tracking-[0.4em] text-gray-500">
          Élan Atelier
        </div>
      </div>
    </div>
  );
}
