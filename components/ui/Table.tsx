import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({
  className = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={["min-w-full border-separate border-spacing-0", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
}

export function TableHead({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props} />;
}

export function TableBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TableRow({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={["transition hover:bg-slate-50", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TableHeaderCell({
  className = "",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={[
        "border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TableCell({
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={[
        "border-b border-slate-100 px-4 py-3 text-sm text-slate-700 align-top",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
