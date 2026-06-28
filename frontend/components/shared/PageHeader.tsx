type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700/70">
        Aplikasi BK
      </p>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        {title}
      </h1>
      <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
        {description}
      </p>
    </div>
  );
}
