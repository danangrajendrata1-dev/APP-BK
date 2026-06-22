export default function Loading() {
  return (
    <section className="space-y-4">
      <div className="border border-slate-300 bg-white px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Filter Kelas
        </p>
      </div>
      <div className="border border-slate-300 bg-white px-4 py-6 text-sm text-slate-600">
        Memuat data...
      </div>
    </section>
  );
}
