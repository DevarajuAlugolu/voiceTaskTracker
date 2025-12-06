import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const statusOptions = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export default function TaskFormModal({ initialTask, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (initialTask) {
      if (initialTask.title) setTitle(initialTask.title);
      if (initialTask.description) setDescription(initialTask.description);
      if (initialTask.status) setStatus(initialTask.status);
      if (initialTask.priority) setPriority(initialTask.priority);
      if (initialTask.dueDate || initialTask.due_date) {
        const raw = initialTask.dueDate || initialTask.due_date;
        if (raw) {
          console.log("raw----", raw);
          const filledDate = raw.slice(0, 16);
          console.log("------", filledDate);
          setDueDate(filledDate);
        }
      }
    }
  }, [initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
  };

  const isEditing = Boolean(initialTask && initialTask.id);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/80">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-50">
              {isEditing ? "Edit task" : "Create task"}
            </h2>
            {initialTask && initialTask.transcript && (
              <p className="mt-0.5 text-xs text-slate-400">
                Parsed from voice – adjust details before saving.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-slate-100 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {initialTask && initialTask.transcript && (
          <div className="mb-3 rounded-xl border border-indigo-500/60 bg-indigo-950/30 px-3 py-2 text-xs text-slate-100">
            <p className="text-[11px] uppercase tracking-[0.16em] text-indigo-300">
              Voice transcript
            </p>
            <p className="mt-1 text-xs text-slate-100">
              {initialTask.transcript}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1 text-sm"
        >
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="taskTitle"
                className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400"
              >
                Title
              </label>
              <input
                id="taskTitle"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize what needs to happen"
                className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="taskDescription"
                className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400"
              >
                Description
                <span className="ml-1 text-[11px] font-normal normal-case text-slate-500">
                  Optional
                </span>
              </label>
              <textarea
                id="taskDescription"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, links, or notes for your future self."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <label
                  htmlFor="taskStatus"
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Status
                </label>
                <select
                  id="taskStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="taskPriority"
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Priority
                </label>
                <select
                  id="taskPriority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="taskDueDate"
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Due date
                </label>
                <input
                  id="taskDueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded-full border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-200 hover:border-slate-500 hover:text-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 rounded-full bg-indigo-500 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 hover:bg-indigo-400 transition"
            >
              {isEditing ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
