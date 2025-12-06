import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export default function TaskList({ tasks, onEdit, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="py-6 text-center text-sm text-slate-400">
        No tasks yet. Use voice or the New Task button to add your first one.
      </div>
    );
  }

  return (
    <div className="mt-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
      <div className="grid grid-cols-[1.7fr_0.7fr_0.7fr_0.9fr_0.4fr] items-center border-b border-slate-800 bg-slate-950 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
        <div>Title</div>
        <div>Priority</div>
        <div>Status</div>
        <div>Due</div>
        <div className="text-right">Actions</div>
      </div>
      <div className="divide-y divide-slate-800 text-xs">
        {tasks.map((task) => {
          const priorityLabel = PRIORITY_LABELS[task.priority] || task.priority;
          const due =
            task.due_date
              ? new Date(task.due_date).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No date";

          return (
            <div
              key={task.id}
              className="grid grid-cols-[1.7fr_0.7fr_0.7fr_0.9fr_0.4fr] items-center px-3 py-2.5 text-slate-100 hover:bg-slate-900/90"
            >
              <div className="truncate text-[13px] font-medium text-slate-50">
                {task.title}
              </div>
              <div>
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
              <div>
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
              </div>
              <div className="text-slate-200">{due}</div>
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => onEdit(task)}
                  title="Edit task"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:border-indigo-500 hover:text-indigo-100 transition"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  title="Delete task"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:border-rose-500 hover:text-rose-100 transition"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}