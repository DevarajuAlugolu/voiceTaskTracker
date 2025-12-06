import React from "react";
import { Filter, Search } from "lucide-react";

export default function FilterBar({ filters, onChange }) {
  const update = (patch) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Filter className="h-3.5 w-3.5" />
        Filters
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search title or description"
            className="h-8 w-full rounded-full border border-slate-700 bg-slate-900 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => update({ status: e.target.value })}
          className="h-8 min-w-[120px] rounded-full border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => update({ priority: e.target.value })}
          className="h-8 min-w-[120px] rounded-full border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          type="date"
          value={filters.dueFrom}
          onChange={(e) => update({ dueFrom: e.target.value })}
          className="h-8 flex-1 min-w-[140px] rounded-full border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={filters.dueTo}
          onChange={(e) => update({ dueTo: e.target.value })}
          className="h-8 flex-1 min-w-[140px] rounded-full border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={() =>
            onChange({
              status: "",
              priority: "",
              search: "",
              dueFrom: "",
              dueTo: "",
            })
          }
          className="h-8 rounded-full border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}