import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { LayoutGrid, List, Plus, Loader2 } from "lucide-react";
import TaskBoard from "./components/TaskBoard.jsx";
import TaskList from "./components/TaskList.jsx";
import TaskFormModal from "./components/TaskFormModal.jsx";
import VoiceInputBar from "./components/VoiceInputBar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import StatsBar from "./components/StatsBar.jsx";

const API_BASE = "/api";

const groupByStatus = (tasks) => ({
  todo: tasks.filter((t) => t.status === "todo"),
  in_progress: tasks.filter((t) => t.status === "in_progress"),
  done: tasks.filter((t) => t.status === "done"),
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("board"); // board | list
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    dueFrom: "",
    dueTo: "",
  });

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.dueFrom) params.dueFrom = filters.dueFrom;
      if (filters.dueTo) params.dueTo = filters.dueTo;

      const res = await axios.get(`${API_BASE}/tasks`, { params });
      console.log(res);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const grouped = useMemo(() => groupByStatus(tasks), [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const pending = tasks.filter((t) => t.status !== "done").length;
    const now = new Date();
    const overdue = tasks.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d < now && t.status !== "done";
    }).length;
    return { total, pending, completed, overdue };
  }, [tasks]);

  const openCreateModal = (initialData = null) => {
    setEditingTask(initialData);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (data) => {
    try {
      if (editingTask && editingTask.id) {
        const res = await axios.put(
          `${API_BASE}/tasks/${editingTask.id}`,
          data
        );
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? res.data : t))
        );
      } else {
        const res = await axios.post(`${API_BASE}/tasks`, data);
        setTasks((prev) => [...prev, res.data]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const handleMoveTask = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/tasks/${id}`, {
        status: newStatus,
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert("Failed to move task");
    }
  };

  const handleVoiceParsed = (payload) => {
    const { transcript, parsed } = payload;
    openCreateModal({
      ...parsed,
      transcript,
    });
  };

  return (
    <div className="min-h-screen bg-bg-body text-slate-50">
      <div className="max-w-6xl mx-auto px-4 pb-8 pt-5 flex flex-col gap-3">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                Single User · Voice First
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-50">
                Voice Task Tracker
              </h1>
              <p className="text-sm text-slate-400">
                Capture tasks by voice, refine quickly, and track them on a
                focused board.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <div className="inline-flex rounded-full border border-slate-700/80 bg-slate-900/80 p-1">
              <button
                onClick={() => setViewMode("board")}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "board"
                    ? "bg-slate-100 text-slate-900 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "list"
                    ? "bg-slate-100 text-slate-900 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
            </div>
            <button
              onClick={() => openCreateModal(null)}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 hover:bg-indigo-400 transition"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </header>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Main surface */}
        <main className="mt-1 rounded-2xl border border-slate-800/90 bg-[radial-gradient(circle_at_top,_#020617,_#020617_40%,_#020617)] p-3 shadow-soft-elevated">
          {/* Filters + Voice */}
          <section className="flex flex-col gap-3 md:flex-row md:items-stretch">
            <FilterBar filters={filters} onChange={setFilters} />
            <VoiceInputBar onParsed={handleVoiceParsed} />
          </section>

          {/* Content */}
          <section className="mt-3 space-y-2">
            {error && (
              <div className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 px-1 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading tasks…
              </div>
            ) : viewMode === "board" ? (
              <TaskBoard
                groups={grouped}
                onEdit={(task) => {
                  setEditingTask(task);
                  setModalOpen(true);
                }}
                onDelete={handleDeleteTask}
                onMoveTask={handleMoveTask}
              />
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={(task) => {
                  setEditingTask(task);
                  setModalOpen(true);
                }}
                onDelete={handleDeleteTask}
              />
            )}
          </section>
        </main>
      </div>

      {modalOpen && (
        <TaskFormModal
          initialTask={editingTask}
          onClose={closeModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
