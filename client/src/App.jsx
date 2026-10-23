import { useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const initialForm = { candidateName: "", jobRole: "", company: "", skills: "" };

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [resume, setResume] = useState(null);
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function generateLetter(event) {
    event.preventDefault();
    setError("");
    setLetter("");
    setCopied(false);
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value.trim()));
      if (resume) payload.append("resume", resume);

      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        body: payload
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not generate the cover letter.");
      setLetter(data.letter);
    } catch (err) {
      setError(err.message || "Could not connect to the backend. Check that both servers are running.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLetter() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Clipboard access failed. Select and copy the letter manually.");
    }
  }

  const html = letter
    ? DOMPurify.sanitize(marked.parse(letter, { breaks: true }))
    : "";

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="LetterCraft home">
          <span className="brand-mark">L</span>
          <span>LetterCraft</span>
        </a>
        <span className="topbar-note">AI-powered career writing</span>
      </header>

      <section className="hero">
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>A cover letter that<br /><span>opens doors.</span></h1>
        <p>Turn your experience and ambition into a clear, tailored introduction to your next opportunity.</p>
      </section>

      <section className="workspace">
        <form className="form-card" onSubmit={generateLetter}>
          <div className="section-heading">
            <div><span className="step-label">STEP 01</span><h2>Tell us about the role</h2></div>
            <span className="required-note">* Required fields</span>
          </div>

          <label htmlFor="candidateName">Your full name <span>*</span></label>
          <input id="candidateName" name="candidateName" value={form.candidateName} onChange={updateForm} placeholder="e.g. Vikas Prajapat" required maxLength={150} />

          <label htmlFor="jobRole">Job title <span>*</span></label>
          <input id="jobRole" name="jobRole" value={form.jobRole} onChange={updateForm} placeholder="e.g. Junior AI Engineer" required maxLength={200} />

          <label htmlFor="company">Target company <span>*</span></label>
          <input id="company" name="company" value={form.company} onChange={updateForm} placeholder="e.g. Acme Technologies" required maxLength={200} />

          <label htmlFor="skills">Key skills <span>*</span></label>
          <textarea id="skills" name="skills" value={form.skills} onChange={updateForm} placeholder="Python, machine learning, REST APIs..." required rows={3} maxLength={3000} />

          <div className="upload-area">
            <div className="upload-icon" aria-hidden="true">↑</div>
            <div className="upload-copy">
              <strong>Personalize with your resume</strong>
              <p>PDF only · Up to 5 MB · Optional</p>
              {resume && <span className="file-selected">{resume.name}</span>}
            </div>
            <button className="upload-button" type="button" onClick={() => fileRef.current?.click()}>Choose PDF</button>
            <input ref={fileRef} className="visually-hidden" type="file" accept=".pdf,application/pdf" onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected && selected.size > 5 * 1024 * 1024) {
                setError("PDF must be 5 MB or smaller.");
                event.target.value = "";
                return;
              }
              setError("");
              setResume(selected || null);
            }} />
            {resume && <button type="button" className="remove-file" onClick={() => { setResume(null); if (fileRef.current) fileRef.current.value = ""; }}>Remove</button>}
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}
          <button className="generate-button" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating your letter…</> : <>Generate cover letter <span aria-hidden="true">→</span></>}
          </button>
          <p className="privacy-note">Your resume is processed for this request and is not saved to disk by this app.</p>
        </form>

        <section className="result-card" aria-live="polite">
          <div className="section-heading result-heading">
            <div><span className="step-label">STEP 02</span><h2>Your cover letter</h2></div>
            {letter && <button type="button" className="copy-button" onClick={copyLetter}>{copied ? "Copied ✓" : "Copy text"}</button>}
          </div>

          {letter ? (
            <article className="letter-content" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="empty-state">
              <div className="document-icon"><span /><span /><span /><span /></div>
              <h3>Your story, professionally told.</h3>
              <p>Complete the form and generate your personalized cover letter. Your result will appear here, ready to review and copy.</p>
              <div className="empty-tip"><span>✦</span> Tip: Add your resume for more relevant details.</div>
            </div>
          )}
          {letter && <p className="review-note">Review the details for accuracy before sending your letter.</p>}
        </section>
      </section>

      <footer><span>LetterCraft</span><span>Made for your next opportunity.</span></footer>
    </main>
  );
}