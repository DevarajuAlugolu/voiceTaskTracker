import React from "react";
import { CheckCircle2, Circle, AlertTriangle, ListTodo } from "lucide-react";

export default function StatsBar({ stats }) {
  const { total, pending, completed, overdue } = stats;

  const cards = [
    {
      key: "total",
      label: "Total",
      value: total,
      icon: ListTodo,
      tone: "border-slate-600 bg-slate-900/80",
    },
    {
      key: "pending",
      label: "Pending",
      value: pending,
      icon: Circle,
      tone: "border-sky-600/80 bg-sky-950/40",
    },
    {
      key: "completed",
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      tone: "border-emerald-600/80 bg-emerald-950/40",
    },
    {
      key: "overdue",
      label: "Overdue",
      value: overdue,
      icon: AlertTriangle,
      tone: "border-rose-600/80 bg-rose-950/40",
    },
  ];

  return (
    <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, value, icon: Icon, tone }) => (
        <article
          key={key}
          className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 text-sm shadow-sm ${tone}`}
        >
          <div className="space-y-0.5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {label}
            </p>
            <p className="text-lg font-semibold text-slate-50">{value}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/60">
            <Icon className="h-4 w-4 text-slate-200" />
          </div>
        </article>
      ))}
    </section>
  );
}