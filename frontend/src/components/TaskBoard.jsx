import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard.jsx";

const COLUMNS = [
  { id: "todo", title: "To do" },
  { id: "in_progress", title: "In progress" },
  { id: "done", title: "Done" },
];

export default function TaskBoard({ groups, onEdit, onDelete, onMoveTask }) {
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    const id = parseInt(draggableId, 10);
    onMoveTask(id, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-3 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex min-h-[140px] flex-col rounded-2xl border p-2.5 transition ${
                  snapshot.isDraggingOver
                    ? "border-indigo-500/80 bg-slate-900"
                    : "border-slate-800 bg-slate-950/80"
                }`}
              >
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-300">
                    {column.title}
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px]">
                    {groups[column.id]?.length || 0}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {(groups[column.id] || []).map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className={`transition ${
                            dragSnapshot.isDragging
                              ? "rotate-[-1deg] drop-shadow-xl"
                              : ""
                          }`}
                        >
                          <TaskCard
                            task={task}
                            onEdit={() => onEdit(task)}
                            onDelete={() => onDelete(task.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
