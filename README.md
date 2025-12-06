# **Voice-Enabled Task Tracker**

## **Overview**

A full-stack task management application with intelligent voice input capabilities. Users can create, manage, and track tasks using natural language voice commands. The app automatically parses voice input using OpenAI GPT to extract task details like title, priority, and due date.

---

## **Project Setup**

## **a) Prerequisites**

Before you begin, ensure you have the following installed:

| Requirement        | Version | Purpose                        |
| ------------------ | ------- | ------------------------------ |
| **Node.js**        | 14.0.0+ | JavaScript runtime             |
| **npm**            | 6.0.0+  | Package manager                |
| **PostgreSQL**     | 12+     | Database                       |
| **Git**            | Latest  | Version control                |
| **OpenAI API Key** | Free    | Voice parsing with GPT-4o-mini |

**Check installed versions:**

```bash
node --version     # Should be v14.0.0+
npm --version      # Should be 6.0.0+
psql --version     # Should be 12.0+
```

**Get OpenAI API Key:**

1. Visit https://platform.openai.com/api-keys
2. Sign up/Login (free $5 credit)
3. Click "Create new secret key"
4. Copy and save securely: `sk-proj-abc123...`

---

## **b) Installation Steps**

### **1. Fork the Repository**

1. Open the GitHub repository.
2. Click **Fork** (top-right).
3. Fork it to your own GitHub account.

### **2. Clone Your Fork**

```bash
git clone https://github.com/<your-username>/voiceTaskTracker.git
cd voiceTaskTracker
```

### **3. Backend Setup**

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```
PORT=4000
DATABASE_URL=postgres://<user>:<password>@localhost:5432/voice_task_tracker
OPENAI_API_KEY=sk-xxxx
```

### **4. Database Setup (PostgreSQL)**

Create the database:

```sql
CREATE DATABASE voice_task_tracker;
```

Run migration (creates the `tasks` table):

```bash
npm run migrate
```

Optional: Insert sample tasks:

```bash
npm run seed
```

### **5. Start Backend**

```bash
npm run dev
```

Backend will run at:

```
http://localhost:4000
```

### **6. Frontend Setup**

Go to the frontend folder:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

### **7. Voice Input Notes**

- Click mic icon → speak
- Browser captures speech (Web Speech API)
- Transcript sent to backend → AI parser (OpenAI)
- Modal auto-opens with parsed data
- User reviews → saves task

No extra setup required.

---

## 🛠️ **c)Tech Stack**

### **Frontend**

| Technology              | Version | Purpose                 |
| ----------------------- | ------- | ----------------------- |
| **React**               | 18.3.1  | UI framework            |
| **Vite**                | 6.0.0   | Build tool & dev server |
| **Tailwind CSS**        | 3.4.0   | Styling                 |
| **Axios**               | 1.7.7   | HTTP client             |
| **React Beautiful DnD** | 13.1.1  | Drag-and-drop           |
| **Lucide React**        | 0.460.0 | Icons                   |

### **Backend**

| Technology     | Version | Purpose               |
| -------------- | ------- | --------------------- |
| **Express.js** | 4.21.1  | Web framework         |
| **Node.js**    | 14.0.0+ | Runtime               |
| **PostgreSQL** | 12+     | Database              |
| **pg**         | 8.13.0  | Database driver       |
| **OpenAI**     | 6.10.0  | GPT parsing           |
| **CORS**       | 2.8.5   | Cross-origin requests |
| **dotenv**     | 16.4.5  | Environment variables |
| **Morgan**     | 1.10.0  | HTTP logging          |

### **AI Provider**

| Service      | Details                              |
| ------------ | ------------------------------------ |
| **Model**    | OpenAI GPT-4o-mini                   |
| **Cost**     | $0.15/1M tokens (~$0.0001 per voice) |
| **Usage**    | Voice transcript parsing             |
| **Features** | Structured JSON output               |

### **Voice Recognition**

| Component    | Details                         |
| ------------ | ------------------------------- |
| **Type**     | Web Speech API (browser-native) |
| **Provider** | Chrome/Google (built-in)        |
| **Cost**     | Free (no API key needed)        |
| **Accuracy** | ~95% in English                 |

---

## Decisions & Assumptions

## **a) Key Design Decisions**

### **1. Single User Only**

No login/auth → simpler, faster UX.
One user = one workspace.

### **2. No ORM**

Using raw SQL with `pg`:

- predictable queries
- full control
- faster debugging

### **3. AI Over Regex**

AI parsing handles:

- relative dates
- vague speech
- priority/status inference
- title cleanup

### **4. UI Architecture**

- Component-driven React
- Tailwind for speed
- Smooth Kanban drag/drop
- Stats bar like modern SaaS dashboards

### **5. Voice → Modal Flow**

- User speaks
- Transcript ends
- Backend parses
- Modal auto-opens
- User edits → saves

---

## **b) Assumptions**

- Browser provides reliable speech-to-text
- AI model always returns valid JSON due to schema
- User is in a single timezone
- Title excludes date/time phrases
- No multi-user, no roles, no authentication
- No email, no notifications

---

## AI Tools Usage

### **a) Tools Used**

- **ChatGPT (GPT-5.1)**
- **Cursor** (auto-complete, quick scaffolding)

---

### **b) How AI Helped**

- Redesigning UI layouts
- Creating Tailwind components
- Debugging drag-and-drop behavior
- Designing backend route structure
- Improving date/time parsing logic
- Writing documentation and cleanup

---

### **c) Notable Prompts**

- “Parse natural language task commands into JSON via schema”
- “Rewrite UI using modern SaaS design principles”
- “Fix react-beautiful-dnd board jittering”
- “Convert informal text to structured task fields”

---

### **d) What I Learned**

- JSON schema ensures predictable LLM output
- Tailwind + AI accelerates UI building dramatically
- Voice-first apps need tight loop between UI & AI parsing
- Raw SQL is easier to debug for small projects
- AI can replace complex text parsing logic cleanly

---
