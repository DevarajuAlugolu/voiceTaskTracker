import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const dueDateLabel = task.due_date
    ? new Date(task.due_date).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No due date";

  const priorityLabel = PRIORITY_LABELS[task.priority] || task.priority;

  return (
    <article className="group rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 text-xs shadow-sm transition hover:border-indigo-500 hover:bg-slate-900">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              task.priority === "critical"
                ? "bg-rose-500"
                : task.priority === "high"
                ? "bg-orange-500"
                : task.priority === "medium"
                ? "bg-sky-500"
                : "bg-emerald-500"
            }`}
          />
          <h3 className="truncate text-[13px] font-medium text-slate-50">
            {task.title}
          </h3>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] ${
            task.priority === "critical"
              ? "border-rose-500/80 bg-rose-950/40 text-rose-100"
              : task.priority === "high"
              ? "border-orange-500/80 bg-orange-950/40 text-orange-100"
              : task.priority === "medium"
              ? "border-sky-500/80 bg-sky-950/40 text-sky-100"
              : "border-emerald-500/80 bg-emerald-950/40 text-emerald-100"
          }`}
        >
          {priorityLabel}
        </span>
      </div>

      {task.description && (
        <p className="mb-1 line-clamp-2 text-[11px] text-slate-400">
          {task.description}
        </p>
      )}

      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex flex-col text-[10px] text-slate-400">
          <span className="uppercase tracking-[0.16em] text-slate-500">
            Due
          </span>
          <span className="whitespace-nowrap text-slate-200">
            {dueDateLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] capitalize ${
              task.status === "done"
                ? "border-emerald-500/80 bg-emerald-950/40 text-emerald-100"
                : task.status === "in_progress"
                ? "border-sky-500/80 bg-sky-950/40 text-sky-100"
                : "border-slate-600 bg-slate-900 text-slate-200"
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
          <button
            onClick={onEdit}
            title="Edit task"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:border-indigo-500 hover:text-indigo-100 transition"
          >
            <Edit2 className="h-3 w-3" />
          </button>
          <button
            onClick={onDelete}
            title="Delete task"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:border-rose-500 hover:text-rose-100 transition"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}