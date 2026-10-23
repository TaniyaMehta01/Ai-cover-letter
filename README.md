# AI Cover Letter Generator

A simple full-stack application that generates tailored cover letters using Google Gemini and can personalize them from an uploaded PDF resume.

## Stack
- React + Vite
- Node.js + Express
- Google Gemini API (server-side)
- `pdf-parse` for PDF text extraction
- `marked` + `dompurify` for safe formatted output

## Requirements
- Node.js 20+ recommended
- npm
- A Google Gemini API key

## Setup

### 1. Configure the API key
Copy `server/.env.example` to `server/.env` and set your key:

```env
GEMINI_API_KEY=put_your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
```

Never put the Gemini key in the React client or commit `server/.env` to GitHub.

### 2. Install dependencies
Run these commands from the project root:

```bash
npm install
npm run install:all
```

### 3. Start the application
From the project root:

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend health check: http://localhost:5000/api/health

## Features
- Candidate name, job role, target company and key skills form
- Gemini-powered personalized cover letter
- Optional PDF resume upload and text extraction
- Loading and error states
- Copy-to-clipboard
- Markdown output rendered as sanitized HTML
- API key stored only in backend environment variables

## Notes / limitations
- Text-based PDFs are supported. Scanned/image-only PDFs need OCR, which is not included.
- Uploaded files are processed in memory and are not saved to disk.
- Do not upload resumes without the owner's permission.
- Gemini model availability and free-tier quotas depend on the Google account and current API access.

## Manual QA checklist
1. Submit the form without required fields; confirm validation.
2. Generate a letter with valid fields and a configured API key.
3. Confirm the loading state appears while the request runs.
4. Copy the result and paste it into a text editor.
5. Upload a text-based PDF resume and generate a personalized letter.
6. Try a non-PDF file and confirm it is rejected.
7. Remove the API key temporarily and confirm a helpful server error appears.
8. Confirm `server/.env` is ignored by Git.

## GitHub submission
```bash
git init
git add .
git status
git commit -m "Build AI Cover Letter Generator"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
Check `git status` and the staged file list before pushing. Never commit the real `.env` file.
