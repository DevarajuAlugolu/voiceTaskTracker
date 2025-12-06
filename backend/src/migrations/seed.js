import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Clear existing data
    await client.query("DELETE FROM tasks;");
    console.log("Cleared existing tasks");

    const seedTasks = [
      {
        title: "Review authentication pull request",
        description: "Check security fixes and test login flow thoroughly",
        priority: "high",
        status: "todo",
        due_date: "2025-12-08T16:00:00.000Z",
      },
      {
        title: "Fix login OAuth bug",
        description:
          "Google OAuth callback failing intermittently - investigate token refresh",
        priority: "critical",
        status: "in_progress",
        due_date: "2025-12-07T12:00:00.000Z",
      },
      {
        title: "Deploy staging environment",
        description: "Backend to Railway, frontend to Vercel, update API URLs",
        priority: "medium",
        status: "done",
        due_date: "2025-12-06T18:00:00.000Z",
      },
      {
        title: "Add task analytics dashboard",
        description:
          "Weekly completion stats, priority breakdown, due date trends",
        priority: "low",
        status: "todo",
        due_date: null,
      },
      {
        title: "Optimize voice parsing accuracy",
        description:
          "Handle edge cases: 'ASAP', 'EOD Friday', 'next sprint', slang priorities",
        priority: "high",
        status: "todo",
        due_date: "2025-12-10T14:00:00.000Z",
      },
    ];

    for (const task of seedTasks) {
      await client.query(
        `
        INSERT INTO tasks (title, description, status, priority, due_date)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          task.title,
          task.description,
          task.status,
          task.priority,
          task.due_date,
        ]
      );
    }

    console.log("Seed data inserted successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

seed();
