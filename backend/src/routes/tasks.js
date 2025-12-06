import express from "express";
import { pool } from "../pgClient.js";

const router = express.Router();

const validStatuses = ["todo", "in_progress", "done"];
const validPriorities = ["low", "medium", "high", "critical"];

function normalizeStatus(status) {
  if (!status) return null;
  const v = status.toLowerCase();
  if (["todo", "to_do"].includes(v)) return "todo";
  if (["in_progress", "in progress", "doing"].includes(v)) return "in_progress";
  if (["done", "completed", "finished"].includes(v)) return "done";
  return null;
}

function normalizePriority(priority) {
  if (!priority) return null;
  const v = priority.toLowerCase();
  if (["low", "low priority"].includes(v)) return "low";
  if (["medium", "medium priority", "normal"].includes(v)) return "medium";
  if (["high", "high priority", "urgent", "important"].includes(v))
    return "high";
  if (["critical", "very high"].includes(v)) return "critical";
  return null;
}

router.get("/", async (req, res, next) => {
  try {
    const { status, priority, dueFrom, dueTo, search } = req.query;
    const conditions = [];
    const values = [];
    let idx = 1;

    if (status) {
      const norm = normalizeStatus(status);
      if (norm) {
        conditions.push(`status = $${idx++}`);
        values.push(norm);
      }
    }

    if (priority) {
      const norm = normalizePriority(priority);
      if (norm) {
        conditions.push(`priority = $${idx++}`);
        values.push(norm);
      }
    }

    if (dueFrom) {
      conditions.push(`due_date >= $${idx++}`);
      values.push(dueFrom);
    }

    if (dueTo) {
      conditions.push(`due_date <= $${idx++}`);
      values.push(dueTo);
    }

    if (search) {
      conditions.push(
        `(LOWER(title) LIKE $${idx} OR LOWER(description) LIKE $${idx})`
      );
      values.push(`%${search.toLowerCase()}%`);
      idx++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";
    const query = `
      SELECT id, title, description, status, priority, due_date, created_at, updated_at
      FROM tasks
      ${whereClause}
      ORDER BY 
        CASE status 
          WHEN 'todo' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'done' THEN 3
        END,
        COALESCE(due_date, created_at) ASC
    `;
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT id, title, description, status, priority, due_date, created_at, updated_at FROM tasks WHERE id = $1",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const normStatus = normalizeStatus(status) || "todo";
    const normPriority = normalizePriority(priority) || "medium";

    if (!validStatuses.includes(normStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (!validPriorities.includes(normPriority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    let dueDateVal = null;
    if (dueDate) {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ message: "Invalid dueDate" });
      }
      dueDateVal = d.toISOString();
    }

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, status, priority, due_date, created_at, updated_at`,
      [title.trim(), description || "", normStatus, normPriority, dueDateVal]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      fields.push(`title = $${idx++}`);
      values.push(title.trim());
    }

    if (description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }

    if (status !== undefined) {
      const normStatus = normalizeStatus(status);
      if (!normStatus || !validStatuses.includes(normStatus)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      fields.push(`status = $${idx++}`);
      values.push(normStatus);
    }

    if (priority !== undefined) {
      const normPriority = normalizePriority(priority);
      if (!normPriority || !validPriorities.includes(normPriority)) {
        return res.status(400).json({ message: "Invalid priority" });
      }
      fields.push(`priority = $${idx++}`);
      values.push(normPriority);
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === "") {
        fields.push(`due_date = NULL`);
      } else {
        const d = new Date(dueDate);
        if (isNaN(d.getTime())) {
          return res.status(400).json({ message: "Invalid dueDate" });
        }
        fields.push(`due_date = $${idx++}`);
        values.push(d.toISOString());
      }
    }

    fields.push(`updated_at = NOW()`);

    if (!fields.length) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    const query = `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING id, title, description, status, priority, due_date, created_at, updated_at
    `;

    const { rows } = await pool.query(query, values);
    if (!rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM tasks WHERE id = $1", [
      id,
    ]);
    if (!rowCount) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).send();
  } catch (err) {
    next(err);
  }
});

export default router;
