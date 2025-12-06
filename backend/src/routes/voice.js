// export default router;
import express from "express";
import openai from "../lib/openai.js"; // adjust path

const router = express.Router();

router.post("/parse", async (req, res) => {
  const { transcript } = req.body || {};
  if (!transcript || typeof transcript !== "string") {
    return res.status(400).json({ message: "transcript is required" });
  }

  const nowIso = new Date().toISOString();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // good + cheap, you can upgrade later
      response_format: {
        // Structured output so you always get valid JSON :contentReference[oaicite:1]{index=1}
        type: "json_schema",
        json_schema: {
          name: "task_parse_result",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: {
                type: "string",
                description:
                  "Short task title, cleaned of filler like 'create a task to', dates, and time phrases.",
              },
              priority: {
                type: "string",
                enum: ["low", "medium", "high", "critical"],
              },
              status: {
                type: "string",
                enum: ["todo", "in_progress", "done"],
              },
              dueDate: {
                // ISO 8601 string or null
                anyOf: [
                  { type: "string", description: "ISO 8601 datetime" },
                  { type: "null" },
                ],
              },
            },
            required: ["title", "priority", "status", "dueDate"],
          },
        },
      },
      messages: [
        {
          role: "system",
          content: [
            "You are a strict JSON parser for task commands.",
            "You must read a natural-language transcript and extract:",
            "- title: concise task title.",
            "- priority: one of low, medium, high, critical.",
            "- status: one of todo, in_progress, done.",
            "- dueDate: a concrete ISO 8601 datetime or null.",
            "",
            "Rules:",
            "- Use the provided current datetime to resolve relative phrases",
            "  like 'tomorrow', 'day after tomorrow', 'next Monday',",
            "  'in 3 days', 'tomorrow evening', etc.",
            "- If user says time-of-day:",
            "    morning  → 09:00,",
            "    afternoon → 15:00,",
            "    evening   → 18:00,",
            "    night     → 21:00.",
            "- If they say a specific time (like '3 pm' / '4:30 pm' / '6 am' / '6:30 am'),",
            "  use that exact time.",
            "- If they give a date but no time, default to 18:00.",
            "- If you truly cannot infer any date, set dueDate to null.",
            "- Title should NOT include due date or time phrases.",
            "",
            "Output ONLY JSON that matches the schema. No extra text.",
          ].join("\n"),
        },
        {
          role: "user",
          content: [
            `Current datetime (user local time): ${nowIso}`,
            "",
            "Transcript:",
            transcript,
          ].join("\n"),
        },
      ],
      temperature: 0, // more deterministic
    });

    const messageContent = completion.choices[0]?.message?.content;
    console.log("----------------------------");
    console.log(messageContent);
    console.log("----------------------------");

    let parsed;
    if (typeof messageContent === "string") {
      parsed = JSON.parse(messageContent);
    } else {
      // in case SDK already returns structured object in future
      parsed = messageContent;
    }
    console.log("----------------");
    console.log(parsed);
    console.log("----------------");

    return res.json({
      transcript,
      parsed,
    });
  } catch (err) {
    console.error("OpenAI parse error:", err?.response?.data || err);
    return res.status(500).json({
      message: "Failed to parse transcript with AI",
    });
  }
});

export default router;
