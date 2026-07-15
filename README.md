<div align="center">

# 🎙️ Cogniva
### AI-Powered Mock Interview Platform

Analyzes your resume, conducts a **live voice-based interview** with an on-screen AI interviewer, and generates a detailed performance report with confidence, communication, and correctness scores.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-interviq--client.onrender.com-4ade80?style=for-the-badge&logo=render&logoColor=white)](https://interviq-client.onrender.com/)
[![Backend API](https://img.shields.io/badge/Backend%20API-interviq.onrender.com-000000?style=for-the-badge&logo=render&logoColor=white)](https://interviq.onrender.com)

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.12-764ABC?style=flat-square&logo=redux&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?style=flat-square&logo=razorpay&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

</div>

---

## 📑 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution — How It Works](#-solution--how-it-works)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database — Models](#-database--models)
- [Credits & Payment System](#-credits--payment-system)
- [Backend — API Reference](#-backend--api-reference)
- [Backend — Code Walkthrough](#-backend--code-walkthrough)
- [Frontend — Pages & Components](#-frontend--pages--components)
- [OpenRouter AI — Prompt Engineering](#-openrouter-ai--prompt-engineering)
- [Authentication Flow](#-authentication--emailotp--google-oauth-flow)
- [Local Setup](#-local-setup)
- [Deployment Guide](#-deployment-guide)
- [Environment Variables](#-environment-variables)
- [Known Bugs & Limitations](#-known-bugs--limitations)
- [Future Scope](#-future-scope)
- [Interview Q&A — Complete Guide](#-interview-qa--complete-guide)

---

## 🎯 Problem Statement

Most students preparing for placements practice interviews by reading questions off a list or rehearsing alone in front of a mirror. Two things are missing:

- **No realistic pressure** — a static question bank doesn't simulate a timed, spoken interview with a human-like interviewer.
- **No objective feedback** — self-assessment is biased; there's no consistent scoring on confidence, communication, and correctness question-by-question.

**The gap:**

| Tool | What it does | What it misses |
|---|---|---|
| Static question PDFs/lists | Question bank | No timing pressure, no feedback, no personalization |
| YouTube mock interviews | Passive learning | Not interactive, generic, not resume-specific |
| Friends/mentors | Real feedback | Not always available, inconsistent scoring |
| **Cogniva** | Resume-aware questions + timed spoken interview + AI scoring | — |

---

## 💡 Solution — How It Works

InterviQ runs the interview in 3 steps (`Step1 → Step2 → Step3`), all inside a single page (`InterviewPage.jsx`):

### Step 1 — Setup & Resume Analysis
- User picks **Role**, **Experience level**, and **Mode** (HR / Technical)
- Optional resume upload (PDF) — parsed with `pdfjs-dist` on the backend
- Extracted resume text is sent to an AI model which returns structured JSON: `role`, `experience`, `projects`, `skills`
- This context personalizes every question that follows

### Step 2 — Live AI Interview
- Backend generates exactly **5 questions** (2 easy → 2 medium → 1 hard) using the candidate's role/experience/projects/skills/resume
- Questions are spoken aloud using the browser's `speechSynthesis` API, with an animated male/female AI interviewer video playing while speaking
- User answers by voice — captured via `webkitSpeechRecognition` (live transcription) — or by typing
- Each question has a countdown timer (60s / 60s / 90s / 90s / 120s based on difficulty) rendered as a circular progress ring
- Answers are submitted per-question and scored instantly by AI on **Confidence**, **Communication**, and **Correctness** (0–10 each)

### Step 3 — Performance Report
- Final composite score averaged across all 5 questions
- Per-question breakdown chart (Recharts area chart) + circular progress gauges for each skill dimension
- Downloadable PDF report generated client-side with `jsPDF` + `jspdf-autotable`
- Report is also saved to interview history, viewable later from `/history`

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.6 | UI framework |
| React Router DOM | 7.16.0 | Client-side routing (SPA) |
| Redux Toolkit + React-Redux | 2.12.0 / 9.3.0 | Global auth/user state |
| Tailwind CSS | 4.3.0 | Utility-first styling (via `@tailwindcss/vite`) |
| Recharts | 3.8.1 | Score trend area chart |
| React Circular Progressbar | 2.2.0 | Timer ring + skill gauges |
| Motion (Framer Motion) | 12.40.0 | Page/element animations |
| Firebase (client SDK) | 12.14.0 | Google OAuth sign-in |
| jsPDF + jspdf-autotable | 4.2.1 / 5.0.8 | Client-side PDF report generation |
| React Icons | 5.6.0 | Icon library |
| Axios | 1.16.1 | HTTP client |
| Vite | 8.0.12 | Build tool + dev server |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 5.2.1 | Web framework + routing |
| Mongoose | 9.6.3 | MongoDB ODM — schema + queries |
| jsonwebtoken | 9.0.3 | Auth token signing/verification |
| bcryptjs | 3.0.3 | Password hashing |
| cookie-parser | 1.4.7 | Cookie parsing middleware |
| cors | 2.8.6 | Cross-origin request handling |
| multer | 2.1.1 | Resume (PDF) upload handling |
| pdfjs-dist | 6.0.227 | Server-side PDF text extraction |
| nodemailer | 8.0.10 | Transactional emails (Gmail) |
| razorpay | 2.9.6 | Payment gateway integration |
| axios | 1.17.0 | OpenRouter REST calls |
| dotenv | 17.4.2 | Environment variable loading |
| nodemon | 3.1.14 | Dev server auto-restart |
| ES Modules | — | `"type": "module"` — import/export syntax |

### External Services

| Service | Purpose | Free Tier |
|---|---|---|
| OpenRouter (`openai/gpt-4o-mini`) | Resume parsing, question generation, answer scoring | Pay-per-use |
| Firebase Auth | Google OAuth sign-in on the client | Yes |
| Razorpay | Credit-pack payments (test/live mode) | Yes (test mode) |
| MongoDB Atlas | Cloud database hosting | M0 — 512MB free |
| Gmail SMTP (Nodemailer) | OTP + verification + password reset emails | Yes |
| Render | Frontend + Backend deployment | Free (sleeps after inactivity) |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)                      │
│                   Render — Static/Web Service                 │
│                                                                │
│  Pages:                                                        │
│  / (Home) · /auth (Auth) · /interview (InterviewPage)         │
│  /history (InterviewHistory) · /report/:id (InterviewReport)  │
│  /pricing (Pricing) · /forgot-password · /reset-password      │
│                                                                │
│  InterviewPage internal steps:                                 │
│  Step1SetUp → Step2Interview → Step3Report                    │
│                                                                │
│  Global State: Redux (userSlice) — userData, loading           │
│  Auth bootstrap: App.jsx useEffect → GET /api/user/current-user│
│                                                                │
│  Data Flow:                                                     │
│  axios (withCredentials: true) → ServerUrl → Backend           │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS — axios + httpOnly cookie (JWT)
                       ↓
┌──────────────────────────────────────────────────────────────┐
│               BACKEND (Node.js + Express)                     │
│               Render — Web Service                             │
│                                                                │
│  index.js → app.listen(PORT) → connectDB()                    │
│           → cors (origin allow-list) → express.json()         │
│           → cookieParser()                                    │
│                                                                │
│  Routes:                                                        │
│  /api/auth      → auth.route.js      (register/login/OTP/...)  │
│  /api/user      → user.route.js      (current-user, delete)   │
│  /api/interview → interview.route.js (resume, Q&A, report)    │
│  /api/payment   → payment.route.js   (Razorpay order/verify)  │
│                                                                │
│  Middlewares:                                                  │
│  isAuth.js   → verifies JWT from cookie, sets req.userID       │
│  multer.js   → disk storage for resume PDF, 5MB limit          │
│                                                                │
│  Controllers:                                                   │
│  auth.controller.js       → register, login, OTP, Google OAuth│
│  interview.controller.js  → resume parse, Q-gen, scoring       │
│  payment.controller.js    → Razorpay order + signature verify  │
│  user.controller.js       → current user, delete account       │
│                                                                │
│  Services:                                                      │
│  openRouter.service.js  → axios POST to OpenRouter chat API    │
│  email.service.js       → Nodemailer + HTML templates          │
│  razorpay.service.js    → Razorpay SDK client                  │
└──────────┬───────────────────────┬───────────────────────────┘
           │                       │
           ↓                       ↓
  ┌─────────────────┐    ┌──────────────────────┐
  │  MongoDB Atlas  │    │   External APIs       │
  │  (M0 Free)      │    │                        │
  │                 │    │  OpenRouter            │
  │  User            │    │  (gpt-4o-mini)         │
  │  Interview       │    │                        │
  │  Payment         │    │  Razorpay Orders API   │
  └─────────────────┘    │                        │
                         │  Gmail SMTP            │
                         └──────────────────────┘
```

---

## 📂 Project Structure

```
InterviQ/
│
├── client/                                  # React frontend (Vite)
│   ├── public/
│   │   └── travel.png / img1.png
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx                     # Landing page
│   │   │   ├── Auth.jsx                     # Login/Register + Google OAuth + OTP
│   │   │   ├── ForgotPassword.jsx           # Request password reset link
│   │   │   ├── ResetPassword.jsx            # Set new password via token
│   │   │   ├── InterviewPage.jsx            # Step orchestrator (1→2→3)
│   │   │   ├── InterviewHistory.jsx         # List of past interviews
│   │   │   ├── InterviewReport.jsx          # Re-view a saved report by id
│   │   │   └── Pricing.jsx                  # Credit packs + Razorpay checkout
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx                   # Nav + auth-aware links
│   │   │   ├── Footer.jsx                   # Footer links
│   │   │   ├── AuthModel.jsx                # Auth prompt modal
│   │   │   ├── Step1SetUp.jsx               # Role/experience/mode + resume upload
│   │   │   ├── Step2Interview.jsx           # Speech synthesis + recognition + timer
│   │   │   ├── Step3Report.jsx              # Charts + gauges + PDF export
│   │   │   └── Timer.jsx                    # Circular countdown ring
│   │   │
│   │   ├── redux/
│   │   │   ├── store.js                     # configureStore — user reducer
│   │   │   └── userSlice.js                 # userData + loading state
│   │   │
│   │   ├── utils/
│   │   │   └── firebase.js                  # Firebase app + GoogleAuthProvider
│   │   │
│   │   ├── assets/                          # Images + male-ai.mp4 / female-ai.mp4
│   │   └── App.jsx                          # Router — 8 routes + auth bootstrap
│   │
│   ├── vite.config.js
│   └── package.json
│
├── server/                                  # Node.js backend
│   ├── config/
│   │   ├── connectDB.js                     # mongoose.connect(MONGODB_URL)
│   │   └── token.js                         # genToken() — JWT sign, 7d expiry
│   │
│   ├── controllers/
│   │   ├── auth.controller.js               # register/login/OTP/Google/reset
│   │   ├── interview.controller.js          # resume parse, Q-gen, scoring, report
│   │   ├── payment.controller.js            # Razorpay order + verify
│   │   └── user.controller.js               # current-user, delete-account
│   │
│   ├── middlewares/
│   │   ├── isAuth.js                        # JWT cookie verification
│   │   └── multer.js                        # PDF upload — disk storage, 5MB limit
│   │
│   ├── models/
│   │   ├── user.model.js                    # 11 fields — auth + verification + credits
│   │   ├── interview.model.js               # nested questions[] sub-schema
│   │   └── payment.model.js                 # Razorpay order/payment tracking
│   │
│   ├── routes/
│   │   ├── auth.route.js                    # 10 routes
│   │   ├── user.route.js                    # 2 routes
│   │   ├── interview.route.js               # 6 routes
│   │   └── payment.route.js                 # 2 routes
│   │
│   ├── services/
│   │   ├── openRouter.service.js            # axios POST to OpenRouter chat API
│   │   ├── email.service.js                 # Nodemailer + 4 HTML templates
│   │   └── razorpay.service.js              # Razorpay SDK instance
│   │
│   ├── public/                              # multer upload destination (temp)
│   ├── index.js                             # Entry point — listen then connectDB
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database — Models

**Collection: `users`** in MongoDB Atlas

```js
const userSchema = new mongoose.Schema({
  name:                     String,   // required
  email:                    String,   // required, unique
  password:                 String,   // optional — Google users won't have one
  credits:                  Number,   // default: 100
  resetPasswordToken:       String,   // default: null
  resetPasswordTokenExpiry: Date,     // default: null
  isVerified:               Boolean,  // default: false
  otp:                      String,   // default: null
  otpExpiry:                Date,     // default: null
  verifyToken:              String,   // default: null
  verifyTokenExpiry:        Date,     // default: null
}, { timestamps: true })
```

**Collection: `interviews`**

```js
const questionsSchema = new mongoose.Schema({
  question:      String,
  difficulty:    String,
  timeLimit:     Number,
  answer:        String,
  feedback:      String,
  score:         { type: Number, default: 0 },
  confidence:    { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness:   { type: Number, default: 0 },
});

const interviewSchema = new mongoose.Schema({
  userID:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role:       { type: String, required: true },
  experience: { type: String, required: true },
  mode:       { type: String, enum: ["HR", "Technical"], required: true },
  resumeText: String,
  questions:  [questionsSchema],
  finalScore: { type: Number, default: 0 },
  status:     { type: String, enum: ["Incompleted", "completed"], default: "Incompleted" },
}, { timestamps: true })
```

**Collection: `payments`**

```js
const paymentSchema = new mongoose.Schema({
  userID:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId:            String,
  amount:            Number,
  credits:           Number,
  razorpayOrderId:   String,
  razorpayPaymentId: String,
  status:            { type: String, enum: ["created", "paid", "failed"], default: "created" },
}, { timestamps: true })
```

<details>
<summary><strong>📄 Sample interview document (click to expand)</strong></summary>

```json
{
  "userID": "665f1c2e...",
  "role": "Backend Developer",
  "experience": "2 years",
  "mode": "Technical",
  "resumeText": "Vinay ... MERN ... chai-backend project ...",
  "questions": [
    {
      "question": "Can you walk me through how JWT refresh token rotation works in your project?",
      "difficulty": "medium",
      "timeLimit": 90,
      "answer": "",
      "score": 0
    }
  ],
  "finalScore": 0,
  "status": "Incompleted"
}
```

</details>

---

## 💳 Credits & Payment System

Every candidate starts with **100 free credits** (default on the `User` schema). Starting a new interview costs **50 credits** (checked and deducted in `generateQuestion`). Credit packs are purchased via Razorpay:

| Plan | Price | Credits | Notes |
|---|---|---|---|
| Free | ₹0 | 100 | Default on signup |
| Starter Pack | ₹100 | 150 | `planId: "basic"` |
| Pro Pack | ₹500 | 650 | `planId: "pro"`, marked "Best Value" |

**Payment flow:**

1. Frontend calls `POST /api/payment/order` with `{ planId, amount, credits }`
2. Backend creates a Razorpay order (amount in paise) and stores a `Payment` record with `status: "created"`
3. Razorpay Checkout opens client-side using the returned `order_id`
4. On success, frontend calls `POST /api/payment/verify` with the Razorpay response
5. Backend recomputes the HMAC-SHA256 signature from `order_id + payment_id` using `RAZORPAY_KEY_SECRET` and compares it to `razorpay_signature`
6. If valid, the `Payment` status becomes `"paid"` and credits are added to the user via `$inc`

---

## 🔌 Backend — API Reference

### Base URL

```
Production: https://interviq.onrender.com/api
Local:      http://localhost:8000/api
```

### Auth routes (`/api/auth`)

| Method | Route | Description |
|---|---|---|
| POST | `/google` | Google OAuth login/signup (Firebase-verified on client, name+email sent) |
| POST | `/register` | Create account, sends OTP + verification link, no login yet |
| POST | `/login` | Login — blocked with 403 `requiresVerification` if email unverified |
| GET | `/logout` | Clears the auth cookie |
| POST | `/forgot-password` | Sends password reset link (1 hour expiry) |
| POST | `/reset-password` | Sets new password using reset token |
| GET | `/validate-reset-token` | Checks if a reset token is still valid |
| POST | `/verify-otp` | Verifies account using the 6-digit OTP (10 min expiry) |
| GET | `/verify-email` | Verifies account via emailed link (24 hour expiry), redirects to frontend |
| POST | `/resend-otp` | Re-issues OTP + verification link |

### User routes (`/api/user`) — require `isAuth`

| Method | Route | Description |
|---|---|---|
| GET | `/current-user` | Returns the logged-in user's document |
| DELETE | `/delete-account` | Deletes user + their interviews + their payments |

### Interview routes (`/api/interview`) — require `isAuth`

| Method | Route | Description |
|---|---|---|
| POST | `/resume` | Upload PDF resume (multipart) → extracted text + AI-parsed role/experience/projects/skills |
| POST | `/generate-questions` | Deducts 50 credits, generates 5 AI questions, creates an Interview document |
| POST | `/submit-answer` | Scores one answer (confidence/communication/correctness/feedback) |
| POST | `/finish` | Averages all question scores, marks interview `"completed"` |
| GET | `/get-interview` | Lists the current user's interviews (summary fields only) |
| GET | `/report/:id` | Full report for one interview — scores + per-question feedback |

### Payment routes (`/api/payment`) — require `isAuth`

| Method | Route | Description |
|---|---|---|
| POST | `/order` | Creates a Razorpay order and a pending Payment record |
| POST | `/verify` | Verifies Razorpay signature, marks payment paid, credits user |

> **Response format:** Most endpoints return raw JSON (no shared envelope) — controllers return either the resource directly (e.g. the user or interview object) or a `{ message }` string on error, with the relevant HTTP status code (400/403/404/500).

---

## 🧩 Backend — Code Walkthrough

<details>
<summary><strong>index.js — Entry Point</strong></summary>

```js
const app = express()

const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true)
        else callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)

const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDB()   // DB connects after the server starts listening
})
```

</details>

<details>
<summary><strong>isAuth.js — JWT Cookie Middleware</strong></summary>

```js
const isAuth = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) return res.status(400).json({ message: "user does not have a token" })

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!verifyToken) return res.status(400).json({ message: "user does not have a token" })

    req.userID = verifyToken.userID
    next()
}
```

Cookie set on login/register/OTP-verify (`auth.controller.js`):

```js
res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",   // required for cross-site cookies (frontend ↔ backend on different Render subdomains)
    maxAge: 7 * 24 * 60 * 60 * 1000,
})
```

</details>

<details>
<summary><strong>Resume Parsing (interview.controller.js)</strong></summary>

```js
// PDF → raw text using pdfjs-dist (legacy build, ESM-compatible)
const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
let resumeText = ""
for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    resumeText += content.items.map(item => item.str).join(" ") + "\n"
}
resumeText = resumeText.replace(/\s+/g, " ").trim()

// Then sent to OpenRouter with a strict JSON-only system prompt
// to extract { role, experience, projects, skills }
```

</details>

<details>
<summary><strong>Credit Deduction Guard (generateQuestion)</strong></summary>

```js
if (user.credits < 50) {
    return res.status(400).json({ message: "Not enough credits. Minimum 50 credits are required" })
}
// ...generate questions...
user.credits -= 50
await user.save()
```

</details>

<details>
<summary><strong>Scoring Aggregation (finishInterview)</strong></summary>

```js
// Averages every question's score/confidence/communication/correctness
// across all 5 questions to produce the final report
const finalScore = totalQuestions ? totalScore / totalQuestions : 0
interview.finalScore = finalScore
interview.status = "completed"
await interview.save()
```

</details>

<details>
<summary><strong>Razorpay Signature Verification (payment.controller.js)</strong></summary>

```js
const body = razorpay_order_id + "|" + razorpay_payment_id
const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(body)
  .digest("hex")

if (expectedSignature !== razorpay_signature) {
  return res.status(400).json({ message: "Invalid payment signature" })
}
// Only trust the payment after the signature matches — prevents forged "success" calls
```

</details>

---

## 🖥️ Frontend — Pages & Components

<details>
<summary><strong>App.jsx — Auth Bootstrap</strong></summary>

On every app load, `App.jsx` fetches the current user before rendering any route, so pages never flash a logged-out state incorrectly:

```jsx
useEffect(() => {
  const getuser = async () => {
    try {
      const result = await axios.get(ServerUrl + "/api/user/current-user", { withCredentials: true })
      dispatch(setUserData(result.data))
    } catch (error) {
      dispatch(setUserData(null))
    }
  }
  getuser()
}, [dispatch])

if (loading) return <SpinnerScreen />   // blocks routes until the check resolves
```

</details>

<details>
<summary><strong>InterviewPage.jsx — Step Orchestrator</strong></summary>

A simple 3-step local state machine, no routing between steps:

```jsx
const [step, setStep] = useState(1)
const [interviewData, setInterviewData] = useState(null)

{step === 1 && <Step1SetUp onStart={(data) => { setInterviewData(data); setStep(2) }} />}
{step === 2 && <Step2Interview interviewData={interviewData} onFinish={(report) => { setInterviewData(report); setStep(3) }} />}
{step === 3 && <Step3Report report={interviewData} />}
```

Leaving mid-interview (step 2) triggers a confirm dialog to avoid losing progress accidentally.

</details>

<details>
<summary><strong>Step2Interview.jsx — Voice Interview Engine</strong></summary>

- **Text-to-speech:** `window.speechSynthesis` speaks each question aloud; an AI interviewer video (`male-ai.mp4` / `female-ai.mp4`, chosen by `voiceGender`) plays while speaking and pauses when done.
- **Speech-to-text:** `webkitSpeechRecognition` transcribes the candidate's spoken answer live into the answer textbox.
- **Timer:** a countdown (`Timer.jsx`, a `CircularProgressbar`) runs per question; if it hits 0, the answer auto-submits with whatever has been captured.

```jsx
useEffect(() => {
  if (timeLeft === 0 && !isSubmitting && !feedback) {
    submitAnswer()
  }
}, [timeLeft])
```

</details>

<details>
<summary><strong>Timer.jsx — Countdown Ring</strong></summary>

```jsx
function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100
  return (
    <CircularProgressbar
      value={percentage}
      text={`${timeLeft}s`}
      styles={buildStyles({ pathColor: "#10b981", textColor: "#ef4444", trailColor: "#e5e7eb" })}
    />
  )
}
```

</details>

<details>
<summary><strong>Step3Report.jsx — Charts + PDF Export</strong></summary>

- Recharts `AreaChart` plots per-question score trend (Q1–Q5)
- Three `CircularProgressbar` gauges for Confidence / Communication / Correctness
- `jsPDF` + `jspdf-autotable` render a downloadable PDF version of the same report, built entirely client-side (no server round-trip)

</details>

<details>
<summary><strong>Pricing.jsx — Razorpay Checkout</strong></summary>

```jsx
const result = await axios.post(ServerUrl + "/api/payment/order", { planId, amount, credits }, { withCredentials: true })

const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: result.data.amount,
  currency: "INR",
  name: "Cogniva",
  order_id: result.data.id,
  handler: async (response) => {
    const verifypay = await axios.post(ServerUrl + "/api/payment/verify", response, { withCredentials: true })
    dispatch(setUserData(verifypay.data.user))   // credits update instantly in Redux
  },
}
```

</details>

---

## 🤖 OpenRouter AI — Prompt Engineering

**Model used:** `openai/gpt-4o-mini` via OpenRouter's REST API (a unified gateway across model providers, not the OpenAI SDK directly).

**Resume parsing prompt** — forces strict JSON output:

```
Extract structured data from resume.
Return strictly JSON:
{ "role":"string", "experience":"string", "projects":["project1","project2"], "skills":["skill1","skill2"] }
```

**Question generation prompt** — constrains format and difficulty progression:

```
You are a real human interviewer conducting a professional interview.
Generate exactly 5 interview questions.
- Each question must contain between 15 and 25 words.
- One question per line only, no numbering, no extra text.

Difficulty progression:
Question 1 → easy, Question 2 → easy, Question 3 → medium, Question 4 → medium, Question 5 → hard
```

Real role/experience/projects/skills/resume data is injected into the user message so questions are personalized rather than generic.

**Answer scoring prompt** — returns strict JSON with 3 sub-scores + feedback:

```
Score the answer in these areas (0 to 10): Confidence, Communication, Correctness.
Be realistic and unbiased — do not give random high scores.
Return ONLY valid JSON: { "confidence", "communication", "correctness", "finalScore", "feedback" }
```

> **Why this works:** injecting real candidate data prevents generic advice, the strict-JSON instruction keeps responses machine-parseable, and the 0-10 rubric with explicit "don't inflate scores" guidance keeps feedback realistic instead of uniformly positive.

---

## 🔐 Authentication — Email/OTP + Google OAuth Flow

**Registration**
1. `POST /api/auth/register` → account created with `isVerified: false`
2. A 6-digit OTP (10 min expiry) and a secure verification link (24 hour expiry, via `crypto.randomBytes`) are generated and emailed together
3. No cookie/login is issued yet — `requiresVerification: true` is returned to the frontend

**Verification** (either path completes the account)
- **OTP path:** `POST /api/auth/verify-otp` with `{ email, otp }`
- **Link path:** `GET /api/auth/verify-email?token=...` — clicking the emailed link verifies and redirects to `FRONTEND_URL/?verify=success`
- Both paths call the same `completeVerification()` helper: clears OTP/token fields, sends a welcome email, issues the JWT cookie

**Login**
- Blocked with `403` + `requiresVerification: true` if the account isn't verified yet, so the frontend can prompt for OTP again
- Google-signup accounts (no `password` field) get a clear message if they try password login: *"This account uses Google sign-in..."*

**Google OAuth**
- Client signs in via Firebase Google provider, then sends `{ name, email }` to `POST /api/auth/google`
- Backend finds-or-creates the user with `isVerified: true` (Google already verified the email) and issues the cookie directly — no OTP step needed

**Password Reset**
- `POST /api/auth/forgot-password` → emails a reset link (1 hour expiry) — always returns the same generic message whether or not the email exists, to avoid leaking which emails are registered
- `POST /api/auth/reset-password` → sets new password, invalidates the token, sends a "password changed" confirmation email

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free M0 tier)
- OpenRouter API key ([openrouter.ai](https://openrouter.ai))
- Gmail account with an App Password (for Nodemailer)
- Razorpay account (test mode keys)
- Firebase project (Google Auth)
- Git

### Step 1 — Clone

```bash
git clone https://github.com/your-username/InterviQ.git
cd InterviQ
```

### Step 2 — Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/interviq?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
OPENROUTER_API_KEY=your_openrouter_key_here
EMAIL_USER=youraddress@gmail.com
EMAIL_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
PORT=8000
```

Start backend:

```bash
npm run dev
# Server running on port 8000
# Database connected
```

### Step 3 — Frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Update `ServerUrl` in `App.jsx` if not using a proxy:

```js
export const ServerUrl = "http://localhost:8000"
```

Start frontend:

```bash
npm run dev
# Local: http://localhost:5173
```

### Step 4 — Verify
- ✅ Open `http://localhost:5173` — landing page should load
- ✅ Register a new account — check your inbox for the OTP email
- ✅ Complete an interview — resume upload, live voice Q&A, final report
- ✅ Open `http://localhost:8000/api/user/current-user` — should require auth (400 without cookie)

---

## 🚀 Deployment Guide

### MongoDB Atlas
```
1. cloud.mongodb.com → Create free M0 cluster
2. Security → Network Access → Add IP: 0.0.0.0/0 (allow all)
3. Security → Database Access → Create user with read/write
4. Connect → Drivers → Copy connection string into MONGODB_URL
```

### Backend — Render
```
1. render.com → New → Web Service
2. Connect GitHub repo
3. Settings:
   Root Directory:  server
   Build Command:   npm install
   Start Command:   node index.js
4. Environment Variables:
   MONGODB_URL, JWT_SECRET, OPENROUTER_API_KEY,
   EMAIL_USER, EMAIL_PASS, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
   FRONTEND_URL = https://interviq-client.onrender.com
   BACKEND_URL  = https://interviq.onrender.com
5. Deploy → URL: https://interviq.onrender.com
```

> ⚠️ **Render free tier issue:** Server sleeps after 15 min inactivity — first request after idle takes 30-50s to wake up.

### Frontend — Render (Static Site / Web Service)
```
1. render.com → New → Static Site (or Web Service if SSR-style build)
2. Settings:
   Root Directory:   client
   Build Command:    npm install && npm run build
   Publish Directory: dist
3. Environment Variables:
   VITE_FIREBASE_APIKEY = your firebase api key
   VITE_RAZORPAY_KEY_ID = your razorpay key id
4. Deploy → URL: https://interviq-client.onrender.com
```

**Update CORS after deploy** — backend's `allowedOrigins` array (`index.js`) must include the deployed frontend URL — set via `FRONTEND_URL` env var on Render, then redeploy the backend.

### 🔗 Live URLs
| Service | URL |
|---|---|
| Frontend | [https://interviq-client.onrender.com/](https://interviq-client.onrender.com/) |
| Backend | [https://interviq.onrender.com](https://interviq.onrender.com) |

---

## 🔑 Environment Variables

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URL` | ✅ | Atlas connection string |
| `JWT_SECRET` | ✅ | Secret for signing auth JWTs |
| `OPENROUTER_API_KEY` | ✅ | OpenRouter key — resume parsing, Q-gen, scoring |
| `EMAIL_USER` | ✅ | Gmail address used to send OTP/verification emails |
| `EMAIL_PASS` | ✅ | Gmail App Password (not the regular account password) |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay secret — used for signature verification |
| `FRONTEND_URL` | ✅ | Deployed frontend URL — used for CORS + email links + redirects |
| `BACKEND_URL` | ✅ | Deployed backend URL — used to build the email verification link |
| `PORT` | ✅ | Server port (8000 locally, Render sets its own) |

### `client/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_FIREBASE_APIKEY` | ✅ | Firebase Web API key — for Google OAuth |
| `VITE_RAZORPAY_KEY_ID` | ✅ | Razorpay public key — used in Checkout options |

> **Important:** `VITE_` prefix required — Vite only exposes env vars with this prefix to browser code.

---

## 🐛 Known Bugs & Limitations

| # | Bug/Limitation | File | Status | Fix |
|---|---|---|---|---|
| 1 | `ServerUrl` is hardcoded to `localhost:8000` in `App.jsx` instead of reading an env var | `client/src/App.jsx` | Bug | Move to `import.meta.env.VITE_SERVER_URL` |
| 2 | `getInterviewReport` has unreachable 404 check after the return statement | `server/controllers/interview.controller.js` | Bug | Move the `!interview` check above the `res.json()` call |
| 3 | Speech recognition uses `webkitSpeechRecognition` only — no fallback for non-Chromium browsers | `client/src/components/Step2Interview.jsx` | Known limitation | Add a typed-answer-only fallback UI |
| 4 | Uploaded resumes are stored on local disk (`server/public`) — lost on redeploy on ephemeral hosts | `server/middlewares/multer.js` | Known limitation | Switch to cloud storage (Cloudinary/S3) |
| 5 | Payment amount for "free" plan is hardcoded to 0 inline instead of derived from the plan list | `client/src/pages/Pricing.jsx` | Minor | Use `plan.amount` directly instead of an inline ternary |
| 6 | No rate limiting on OTP resend / login endpoints | `server/routes/auth.route.js` | Security gap | Add `express-rate-limit` |
| 7 | Render free tier cold start ~30-50 seconds on both frontend and backend | Deployment | Known | Consider a keep-alive ping (e.g. UptimeRobot) |
| 8 | Credit check for interviews happens only at generation time, not enforced again mid-interview | `server/controllers/interview.controller.js` | Design choice | Acceptable for current scope — one interview = one deduction |

---

## 🔮 Future Scope

### Short-Term (3-6 months)
- **Cloud Resume Storage** — Move multer uploads to Cloudinary/S3 so resumes survive redeploys and server restarts.
- **Cross-Browser Speech Support** — Add a text-only fallback for browsers without `webkitSpeechRecognition` (Firefox, Safari).
- **Rate Limiting** — Add `express-rate-limit` on auth and OTP endpoints to prevent abuse.
- **Interview History Filters** — Filter/search past interviews by role, mode, or score range.

### Mid-Term (6-18 months)
- **Video Proctoring** — Webcam-based eye-contact/posture feedback alongside voice scoring.
- **Multi-language Support** — Hindi/regional language interview mode using multilingual TTS/STT.
- **Company-Specific Question Banks** — Curated question sets tagged by target company (FAANG, service-based, startups).
- **Admin Dashboard** — Track usage, revenue from credit packs, and aggregate scoring trends across users.

### Long-Term (18+ months)
- **Live Mentor Review** — Option to have a real human reviewer add comments on top of the AI-generated report.
- **Adaptive Difficulty** — Adjust question difficulty in real time based on how well earlier questions were answered.
- **Placement Cell Integration** — Bulk account provisioning and cohort-level analytics for college placement cells.

---

## 🎤 Interview Q&A — Complete Guide

<details>
<summary><strong>A. Problem & Solution</strong></summary>

**Q: Why this project? What gap does it fill?**
A: Most interview prep tools are either static question banks or passive video content. Neither simulates the pressure of a timed, spoken interview or gives objective, consistent feedback. InterviQ combines resume-aware question generation, a real voice-based Q&A loop with a visual AI interviewer, and per-question AI scoring across three dimensions — closing the gap between "reading about interviews" and "practicing one."

**Q: Is the AI scoring reliable? How do you keep it consistent?**
A: The scoring prompt gives the model an explicit 0-10 rubric across three named dimensions (confidence, communication, correctness), instructs it not to inflate scores for weak answers, and forces strictly-parseable JSON output. It's not perfectly deterministic — it's an LLM — but the structured rubric and few-shot-style constraints keep it far more consistent than an unconstrained prompt would be.

</details>

<details>
<summary><strong>B. Architecture & Backend</strong></summary>

**Q: Walk me through what happens when a user starts an interview.**
A: `Step1SetUp` collects role/experience/mode and optionally uploads a resume PDF via `POST /api/interview/resume` — multer saves it to disk, `pdfjs-dist` extracts the text, and it's deleted immediately after. That parsed context (role/experience/projects/skills/resume) is sent to `POST /api/interview/generate-questions`, which checks the user has at least 50 credits, calls OpenRouter for 5 structured questions, deducts credits, and creates an Interview document in MongoDB. The frontend then moves to `Step2Interview` with the returned questions.

**Q: How does authentication work end-to-end?**
A: On login/register-verification, the backend signs a JWT with the user's ID (`jsonwebtoken`, 7-day expiry) and sets it as an `httpOnly`, `secure`, `sameSite: "none"` cookie — needed because frontend and backend are on different Render subdomains. Every protected route runs `isAuth` middleware, which reads the cookie, verifies the JWT, and attaches `req.userID` for the controller to use.

**Q: Why `sameSite: "none"` and `secure: true` on the cookie?**
A: The frontend (`interviq-client.onrender.com`) and backend (`interviq.onrender.com`) are different origins. Browsers block cookies on cross-site requests unless `sameSite` is explicitly `"none"` — which in turn requires `secure: true` (HTTPS only). Both services run over HTTPS on Render, so this works in production; locally it falls back to same-site behavior since both run on localhost.

**Q: Why extract text from the resume on the backend instead of the browser?**
A: `pdfjs-dist`'s legacy Node build handles this reliably server-side without needing a browser DOM or worker setup, and keeping resume parsing on the backend means the OpenRouter API key never has to be exposed to the client.

</details>

<details>
<summary><strong>C. Database & Data</strong></summary>

**Q: Why is `questions` an embedded array inside the Interview document instead of a separate collection?**
A: Each interview's 5 questions are always read and written together — there's no case where you'd query a single question independently of its interview. Embedding avoids extra joins/populates and keeps one interview = one document, which is a natural fit for MongoDB's document model.

**Q: How do you calculate the final score?**
A: `submitAnswer` scores each question individually (confidence, communication, correctness averaged into that question's score by the AI). `finishInterview` then averages score, confidence, communication, and correctness across all 5 questions to produce the interview's `finalScore` and the three headline metrics shown in the report.

**Q: What happens if a user runs out of time on a question?**
A: If `timeTaken > question.timeLimit`, `submitAnswer` short-circuits: the question gets `score: 0` and `feedback: "Time Limit Exceeded answer not evaluated."` — no AI call is made for that question, saving cost and keeping scoring fair.

</details>

<details>
<summary><strong>D. Frontend</strong></summary>

**Q: How does the AI interviewer "speak" the questions?**
A: The browser's built-in `window.speechSynthesis` API converts each question to speech. While speaking, an AI interviewer video (`male-ai.mp4` or `female-ai.mp4`, chosen by a `voiceGender` setting) plays via a `<video>` ref; it pauses and resets when speech ends, giving the illusion of a live interviewer.

**Q: How is the candidate's spoken answer captured?**
A: `window.webkitSpeechRecognition` listens continuously and transcribes speech into the answer textbox in real time, so the candidate can also review/edit the text before submitting or the timer runs out.

**Q: Why build the PDF report client-side instead of generating it on the server?**
A: `jsPDF` + `jspdf-autotable` can build the entire report directly in the browser using data already in Redux/component state — no extra API round-trip, and it works even if the backend is temporarily asleep (Render cold start).

**Q: Why Redux here instead of just React Context?**
A: The current user (and their credit balance) is read and updated from many disconnected places — the Navbar, the Pricing page's payment handler, `App.jsx`'s auth bootstrap. Redux Toolkit's single `userSlice` gives one predictable source of truth updated via `setUserData`.

</details>

<details>
<summary><strong>E. Payments & AI</strong></summary>

**Q: How do you make sure a user actually paid before adding credits?**
A: The frontend never directly claims a payment succeeded. After Razorpay's checkout handler fires, the frontend sends the response to `POST /api/payment/verify`, and the backend independently recomputes the HMAC-SHA256 signature using the Razorpay key secret and compares it to what Razorpay sent. Credits are added only if that signature matches — this can't be spoofed from the client since the secret never leaves the server.

**Q: Why OpenRouter instead of calling OpenAI directly?**
A: OpenRouter provides a single unified API across many model providers with one API key and consistent request/response shape, making it easy to swap models without changing the integration code.

**Q: How do you keep the AI's questions relevant to the candidate instead of generic?**
A: The prompt injects the candidate's actual role, experience, extracted projects, extracted skills, and raw resume text into the user message, and the system prompt explicitly instructs the model to base questions on those details. Real data in the prompt is what prevents boilerplate questions.

</details>

<details>
<summary><strong>F. Deployment & DevOps</strong></summary>

**Q: Why deploy both frontend and backend on Render instead of splitting (e.g. Vercel + Render)?**
A: Keeping both services on the same platform simplifies environment variable management and avoids juggling two different dashboards/pipelines. The trade-off is that Render's free static/web services both cold-start after inactivity.

**Q: What's the biggest security consideration in this app?**
A: Payment signature verification (never trust the client's "payment succeeded" claim) and JWT httpOnly cookies (prevents XSS from stealing the auth token via JavaScript). Both are handled server-side and can't be bypassed from the browser.

</details>

---

<div align="center">

**Built for placement interview preparation** · Powered by OpenRouter (GPT-4o-mini) + Firebase + Razorpay

</div>
