# Analytiq | AI Resume Analyzer

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwindcss)
![Vulnerabilities](https://img.shields.io/badge/vulnerabilities-0-brightgreen)

**Analytiq** is a modern, AI-powered resume analyzer that gives you an ATS compatibility score and actionable improvement tips | all in your browser, for free.

Upload your PDF resume, describe the job you're applying for, and receive detailed feedback on tone, content, structure, and skills | powered by Claude AI via Puter.js.

---

## ✨ Features

- 📄 **PDF Resume Upload** | Drag-and-drop or click to upload (up to 20 MB)
- 🤖 **AI-Powered Analysis** | Claude claude-3-7-sonnet evaluates your resume against the job description
- 📊 **ATS Score** | Applicant Tracking System compatibility rating (0–100)
- 🔍 **Detailed Feedback** | Categorized tips for Tone & Style, Content, Structure, and Skills
- 🖼️ **Resume Preview** | Visual PDF thumbnail shown alongside your feedback
- 📁 **Dashboard** | Track all your analyzed resumes in one place
- 🔐 **Auth via Puter** | Free sign-in, no credit card or API key required
- 📱 **Fully Responsive** | Mobile-first design

---

## 🛠 Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Framework    | React Router v7 (SPA mode)                  |
| UI           | React 19 + TypeScript 5.8                   |
| Styling      | Tailwind CSS v4                             |
| State        | Zustand v5                                  |
| AI + Storage | Puter.js (Claude AI, KV store, File System) |
| PDF → Image  | pdfjs-dist v4                               |
| File Upload  | react-dropzone v14                          |
| Bundler      | Vite v6                                     |
| Linting      | ESLint v9 + typescript-eslint               |
| Formatting   | Prettier v3                                 |

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/analytiq.git
cd analytiq

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
analytiq/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Accordion.tsx    # Collapsible sections (accessible)
│   │   ├── ATS.tsx          # ATS score + suggestions panel
│   │   ├── Details.tsx      # Categorized feedback accordion
│   │   ├── ErrorFallback.tsx
│   │   ├── FileUploader.tsx # Drag-and-drop PDF uploader
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx
│   │   ├── ResumeCard.tsx   # Dashboard card with score + thumbnail
│   │   ├── ScoreBadge.tsx
│   │   ├── ScoreCircle.tsx  # Circular progress indicator
│   │   ├── ScoreGauge.tsx   # Semi-circular gauge
│   │   └── Summary.tsx      # Overall score summary panel
│   ├── hooks/
│   │   ├── useResumes.ts       # Load all resumes from KV store
│   │   └── useResumeDetail.ts  # Load single resume + blobs
│   ├── routes/
│   │   ├── home.tsx    # Dashboard page
│   │   ├── auth.tsx    # Sign-in page
│   │   ├── upload.tsx  # Upload + analyze page
│   │   ├── resume.tsx  # Individual resume review page
│   │   └── wipe.tsx    # Data management utility
│   ├── services/
│   │   ├── pdf.ts      # PDF → PNG conversion via pdfjs-dist
│   │   └── puter.ts    # Zustand store wrapping Puter.js APIs
│   ├── utils/
│   │   └── index.ts    # cn(), formatSize(), safeParseJSON(), etc.
│   ├── app.css         # Global styles + Tailwind theme
│   ├── root.tsx        # HTML shell, error boundary
│   └── routes.ts       # Route configuration
├── constants/
│   └── index.ts        # AI prompt builders, score helpers
├── types/
│   ├── index.d.ts      # Resume, Feedback, FeedbackTip types
│   └── puter.d.ts      # Puter.js API types
├── public/
│   ├── favicon.ico
│   ├── site.webmanifest
│   ├── icons/
│   └── images/
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── react-router.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable        | Default                 | Description              |
| --------------- | ----------------------- | ------------------------ |
| `VITE_APP_NAME` | `Analytiq`              | Application display name |
| `VITE_APP_URL`  | `http://localhost:5173` | Base URL                 |

> **No API keys required.** Puter.js handles all AI calls, file storage, and authentication through their free platform.

---

## 📜 Available Scripts

```bash
npm run dev        # Start development server (HMR)
npm run build      # Production build → ./build/
npm run preview    # Preview production build locally
npm run typecheck  # Run TypeScript type checking
npm run lint       # Run ESLint
npm run format     # Run Prettier formatter
```

---

## 🌐 Deployment

This project is built in **SPA mode** (`ssr: false`), producing a fully static `build/client/` directory that can be deployed anywhere.

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add a `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

```bash
# Build command: npm run build
# Publish directory: build/client
```

Add `public/_redirects`:

```
/*  /index.html  200
```

### Render / Any Static Host

Upload the contents of `build/client/` and configure your host to serve `index.html` for all routes.

---

## 🔐 How Authentication Works

Analytiq uses [Puter.js](https://puter.com) for authentication | a free, open platform that provides:

- User authentication (OAuth-style sign-in popup)
- Cloud key-value storage (`puter.kv`)
- Cloud file system (`puter.fs`)
- AI access via Claude (`puter.ai.chat`)

No backend, no database, no API keys | everything runs client-side through Puter's infrastructure.

---

## 🧠 How AI Analysis Works

1. User uploads a PDF + fills in job title & description
2. The PDF is uploaded to Puter's file system
3. A prompt is sent to Claude claude-3-7-sonnet with the PDF file and job context
4. Claude returns a structured JSON object with scores and tips per category
5. The response is safely parsed with `safeParseJSON()` and stored in Puter KV
6. The user is redirected to the feedback dashboard

---

## 📸 Screenshots

| Dashboard          | Upload             | Resume Review      |
| ------------------ | ------------------ | ------------------ |
| _(add screenshot)_ | _(add screenshot)_ | _(add screenshot)_ |

---

## 🛡️ Security

- `npm audit` reports **0 vulnerabilities**
- All AI responses are safely parsed through `safeParseJSON()` (strips markdown fences, handles malformed JSON)
- Object URLs are revoked on component unmount to prevent memory leaks
- No sensitive data stored client-side beyond what Puter.js manages

---

## 📄 License

MIT © 2026 Analytiq Contributors
