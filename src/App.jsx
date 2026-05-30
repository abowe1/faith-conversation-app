import { useState } from "react";

const SYSTEM_PROMPT = `You are a warm, Spirit-filled family faith guide deeply rooted in the Word of God. Your theological foundation is shaped by these core truths taught by Apostle Grace Lubega of Phaneroo Ministries International:

1. RIGHTEOUSNESS: Believers are the righteousness of God in Christ Jesus. Children should grow knowing they are not sinners trying to be good — they are righteous children of God learning to walk in who they already are.
2. IDENTITY IN CHRIST: Every challenge a family faces must be answered from the position of who God says they are — not from fear, lack, or the world's definition.
3. THE WORD AS FOUNDATION: Scripture is not merely advice — it is the living reality that governs life. Every conversation must be anchored in a specific scripture that becomes the family's foundation for that moment.
4. GRACE: God's grace is not just forgiveness — it is divine empowerment. Families are empowered by grace to live above the challenges of life.
5. THE FATHERING SPIRIT: Faith is passed from generation to generation through intentional relationship and Word. Parents are spiritual fathers and mothers raising children in the Word.

YOUR TASK:
Given a child's age group and a family topic/challenge, generate a complete 5-minute family faith conversation. Make it:
- Warm, natural, and conversational — not preachy or formal
- Immediately usable at dinner, in the car, or at bedtime
- Age-appropriate in language and depth
- Rooted in one clear scripture
- Shaped by the theological DNA above

RESPOND ONLY IN THIS EXACT JSON FORMAT (no markdown, no preamble):
{
  "title": "Short catchy title for this conversation (5 words max)",
  "scripture": {
    "reference": "Book Chapter:Verse",
    "text": "Full verse text (NIV or NKJV)"
  },
  "truth": "One core spiritual truth from this scripture, written in 2-3 warm sentences. Connect it to identity, righteousness, or grace. This is for the parent to understand before the conversation.",
  "opener": "One natural sentence a parent can say RIGHT NOW to start the conversation. Casual and warm.",
  "question": "One age-appropriate discussion question for the child",
  "parent_note": "One sentence of quiet encouragement for the parent — remind them they are doing something eternally significant.",
  "activity": {
    "name": "Short activity name",
    "description": "One practical activity the family can do together in 2-5 minutes that brings this truth to life"
  },
  "declaration": "A short, powerful faith declaration the whole family can say together out loud. 1-2 sentences. Start with 'We declare...'"
}`;

const AGE_GROUPS = [
  { id: "toddler", label: "2–4 years", icon: "🌱", desc: "Toddlers" },
  { id: "early", label: "5–7 years", icon: "🌿", desc: "Early Childhood" },
  { id: "middle", label: "8–11 years", icon: "🌳", desc: "Middle Childhood" },
  { id: "teen", label: "12–17 years", icon: "⚡", desc: "Teens" },
  { id: "family", label: "All ages", icon: "🏡", desc: "Whole Family" },
];

const TOPICS = [
  "Fear & Anxiety", "School Challenges", "Friendship Problems",
  "Anger & Emotions", "Identity & Self-Worth", "Trusting God",
  "Family Change", "Disappointment", "Kindness & Forgiveness",
  "Purpose & Calling", "Peer Pressure", "Gratitude",
  "Loss & Grief", "Sickness", "Prayer & Faith",
];

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #fdf6f0; font-family: 'DM Sans', sans-serif; }

.app {
  min-height: 100vh;
  background: #fdf6f0;
  background-image:
    radial-gradient(ellipse at 15% 15%, rgba(220,150,150,0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 85%, rgba(188,110,110,0.08) 0%, transparent 55%);
  color: #3a2a2a;
}

/* HEADER */
.header {
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(188,110,110,0.18);
  background: #fff8f5;
}
.logo-wrap { display: flex; align-items: center; gap: 10px; }
.logo-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #C47C7C, #E8A598);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}
.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-weight: 600;
  color: #C47C7C;
  line-height: 1.1;
}
.logo-text span {
  display: block;
  font-size: 11px;
  font-weight: 400;
  color: rgba(58,42,42,0.45);
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.header-verse {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 13px;
  color: rgba(58,42,42,0.4);
  max-width: 280px;
  text-align: right;
  line-height: 1.4;
}

/* HERO */
.hero {
  text-align: center;
  padding: 60px 32px 40px;
  position: relative;
  background: linear-gradient(160deg, #fff0eb 0%, #fdf6f0 100%);
}
.hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 1px; height: 40px;
  background: linear-gradient(to bottom, rgba(196,124,124,0.4), transparent);
}
.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(196,124,124,0.1);
  border: 1px solid rgba(196,124,124,0.28);
  color: #C47C7C;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
}
.hero h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 6vw, 58px);
  font-weight: 600;
  color: #3a2a2a;
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}
.hero h1 em {
  color: #C47C7C;
  font-style: italic;
}
.hero p {
  font-size: 15px;
  color: rgba(58,42,42,0.55);
  font-weight: 300;
  max-width: 420px;
  margin: 0 auto;
  line-height: 1.7;
}

/* FORM */
.form-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 32px 60px;
}
.form-section { margin-bottom: 36px; }
.form-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C47C7C;
  margin-bottom: 14px;
  display: block;
}

/* AGE GRID */
.age-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.age-btn {
  background: #fff;
  border: 1.5px solid rgba(188,110,110,0.15);
  border-radius: 12px;
  padding: 14px 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  color: rgba(58,42,42,0.55);
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 1px 4px rgba(188,110,110,0.06);
}
.age-btn:hover {
  border-color: rgba(196,124,124,0.45);
  background: #fff5f3;
  color: #3a2a2a;
}
.age-btn.selected {
  border-color: #C47C7C;
  background: rgba(196,124,124,0.08);
  color: #C47C7C;
}
.age-btn .icon { font-size: 22px; margin-bottom: 6px; }
.age-btn .range { font-size: 12px; font-weight: 600; display: block; }
.age-btn .desc { font-size: 10px; opacity: 0.6; display: block; margin-top: 2px; }

/* TOPIC GRID */
.topic-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.topic-btn {
  background: #fff;
  border: 1.5px solid rgba(188,110,110,0.15);
  border-radius: 20px;
  padding: 7px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(58,42,42,0.6);
  box-shadow: 0 1px 3px rgba(188,110,110,0.05);
}
.topic-btn:hover {
  border-color: rgba(196,124,124,0.4);
  color: #3a2a2a;
  background: #fff5f3;
}
.topic-btn.selected {
  border-color: #C47C7C;
  background: rgba(196,124,124,0.09);
  color: #C47C7C;
  font-weight: 500;
}

/* CUSTOM TOPIC */
.custom-input-wrap { margin-top: 12px; }
.custom-input {
  width: 100%;
  background: #fff;
  border: 1.5px solid rgba(188,110,110,0.2);
  border-radius: 10px;
  padding: 12px 16px;
  color: #3a2a2a;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.custom-input:focus { border-color: #C47C7C; box-shadow: 0 0 0 3px rgba(196,124,124,0.1); }
.custom-input::placeholder { color: rgba(58,42,42,0.3); }

/* GENERATE BTN */
.gen-btn {
  width: 100%;
  background: linear-gradient(135deg, #C47C7C, #b06868);
  border: none;
  border-radius: 14px;
  padding: 18px;
  color: #fff;
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
}
.gen-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.5s;
}
.gen-btn:hover::before { left: 100%; }
.gen-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(196,124,124,0.35); }
.gen-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

/* LOADING */
.loading-wrap {
  text-align: center;
  padding: 60px 32px;
}
.loading-cross {
  font-size: 40px;
  display: block;
  margin-bottom: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.9); } }
.loading-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #C47C7C;
  margin-bottom: 8px;
}
.loading-sub { font-size: 13px; color: rgba(58,42,42,0.4); }

/* RESULT */
.result-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 32px 60px;
}
.result-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(196,124,124,0.2);
}
.result-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(196,124,124,0.09);
  border: 1px solid rgba(196,124,124,0.2);
  color: #C47C7C;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 14px;
  font-weight: 600;
}
.result-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px;
  font-weight: 600;
  color: #3a2a2a;
  line-height: 1.15;
  margin-bottom: 8px;
}
.result-meta { font-size: 13px; color: rgba(58,42,42,0.4); }

/* CARDS */
.cards { display: flex; flex-direction: column; gap: 14px; }

.card {
  background: #fff;
  border: 1px solid rgba(188,110,110,0.12);
  border-radius: 16px;
  padding: 24px;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 10px rgba(188,110,110,0.05);
}
.card:hover { border-color: rgba(196,124,124,0.28); box-shadow: 0 4px 18px rgba(188,110,110,0.1); }

.card-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #C47C7C;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* SCRIPTURE CARD */
.scripture-card {
  background: linear-gradient(135deg, #fff0eb, #fde8e8);
  border-color: rgba(196,124,124,0.25);
}
.scripture-ref {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  font-weight: 600;
  color: #C47C7C;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}
.scripture-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-style: italic;
  color: #3a2a2a;
  line-height: 1.55;
  font-weight: 500;
}

.card-body {
  font-size: 15px;
  color: rgba(58,42,42,0.75);
  line-height: 1.75;
  font-weight: 300;
}

/* OPENER */
.opener-card { border-color: rgba(196,124,124,0.22); background: #fff8f6; }
.opener-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-style: italic;
  color: #C47C7C;
  line-height: 1.5;
}

/* QUESTION */
.question-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 500;
  color: #3a2a2a;
  line-height: 1.4;
}

/* ACTIVITY */
.activity-name {
  font-weight: 600;
  color: #C47C7C;
  font-size: 15px;
  margin-bottom: 8px;
}

/* PARENT NOTE */
.parent-card { background: rgba(196,124,124,0.05); border-color: rgba(196,124,124,0.15); }
.parent-note {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 16px;
  color: rgba(58,42,42,0.6);
  line-height: 1.6;
}

/* DECLARATION */
.declaration-card {
  background: linear-gradient(135deg, rgba(196,124,124,0.1), rgba(232,165,152,0.08));
  border-color: rgba(196,124,124,0.28);
  text-align: center;
  padding: 28px;
}
.declaration-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  font-weight: 600;
  color: #C47C7C;
  line-height: 1.4;
  margin-bottom: 16px;
}
.declare-btn {
  background: rgba(196,124,124,0.1);
  border: 1px solid rgba(196,124,124,0.3);
  color: #C47C7C;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.declare-btn:hover { background: rgba(196,124,124,0.2); }

/* ACTIONS */
.result-actions {
  display: flex;
  gap: 10px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(188,110,110,0.12);
}
.action-btn {
  flex: 1;
  padding: 13px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-align: center;
}
.action-new {
  background: linear-gradient(135deg, #C47C7C, #b06868);
  color: #fff;
}
.action-new:hover { opacity: 0.9; transform: translateY(-1px); }
.action-print {
  background: #fff;
  border: 1.5px solid rgba(188,110,110,0.2);
  color: rgba(58,42,42,0.6);
}
.action-print:hover { border-color: #C47C7C; color: #3a2a2a; }

/* ERROR */
.error-box {
  background: rgba(231,76,60,0.07);
  border: 1px solid rgba(231,76,60,0.2);
  border-radius: 12px;
  padding: 16px 20px;
  color: #c0392b;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

/* PRINT */
@media print {
  body { background: #fff !important; color: #111 !important; }
  .header, .hero, .form-wrap, .result-actions, .declare-btn { display: none !important; }
  .app { background: #fff !important; }
  .card { background: #fdf6f0 !important; border-color: #e8d0d0 !important; page-break-inside: avoid; box-shadow: none !important; }
  .scripture-card { background: #fff0eb !important; }
  .scripture-text, .opener-text, .question-text, .declaration-text, .result-title { color: #3a2a2a !important; }
  .card-body, .parent-note { color: #555 !important; }
  .card-label, .scripture-ref, .result-tag { color: #C47C7C !important; }
  .declaration-card { background: #fff5f3 !important; }
}

@media (max-width: 600px) {
  .age-grid { grid-template-columns: repeat(3, 1fr); }
  .hero h1 { font-size: 32px; }
  .result-title { font-size: 28px; }
  .header-verse { display: none; }
}
`;

async function generateConversation(ageGroup, topic) {
  const ageLabel = AGE_GROUPS.find(a => a.id === ageGroup)?.label || ageGroup;
  const prompt = `Generate a family faith conversation for a child aged ${ageLabel} about the topic: "${topic}".

Remember: ground everything in identity in Christ, righteousness, grace, and the living Word. Make it warm, practical, and immediately usable by a real family today.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [ageGroup, setAgeGroup] = useState("");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [declared, setDeclared] = useState(false);

  const activeTopic = topic === "custom" ? customTopic : topic;
  const canGenerate = ageGroup && activeTopic.trim();

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    setDeclared(false);
    try {
      const data = await generateConversation(ageGroup, activeTopic);
      setResult(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleNew = () => {
    setResult(null);
    setError("");
    setDeclared(false);
  };

  const selectedAge = AGE_GROUPS.find(a => a.id === ageGroup);

  return (
    <div className="app">
      <style>{fonts}{css}</style>

      <div className="header">
        <div className="logo-wrap">
          <div className="logo-icon">✦</div>
          <div className="logo-text">
            The Faith Conversation
            <span>Family App</span>
          </div>
        </div>
        <div className="header-verse">
          "Train up a child in the way he should go..." — Prov. 22:6
        </div>
      </div>

      {!result && !loading && (
        <>
          <div className="hero">
            <div className="hero-label">✦ Daily Family Faith</div>
            <h1>5 minutes that<br />change <em>everything</em></h1>
            <p>Enter your child's age and what's on your family's heart today — and receive a ready-to-use faith conversation rooted in the Word.</p>
          </div>

          <div className="form-wrap">
            {error && <div className="error-box">{error}</div>}

            <div className="form-section">
              <span className="form-label">My child is...</span>
              <div className="age-grid">
                {AGE_GROUPS.map(a => (
                  <button
                    key={a.id}
                    className={`age-btn${ageGroup === a.id ? " selected" : ""}`}
                    onClick={() => setAgeGroup(a.id)}
                  >
                    <div className="icon">{a.icon}</div>
                    <span className="range">{a.label}</span>
                    <span className="desc">{a.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <span className="form-label">We're dealing with...</span>
              <div className="topic-grid">
                {TOPICS.map(t => (
                  <button
                    key={t}
                    className={`topic-btn${topic === t ? " selected" : ""}`}
                    onClick={() => { setTopic(t); setCustomTopic(""); }}
                  >
                    {t}
                  </button>
                ))}
                <button
                  className={`topic-btn${topic === "custom" ? " selected" : ""}`}
                  onClick={() => setTopic("custom")}
                >
                  ✏️ Something else...
                </button>
              </div>
              {topic === "custom" && (
                <div className="custom-input-wrap">
                  <input
                    className="custom-input"
                    placeholder="Describe what your family is going through..."
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                  />
                </div>
              )}
            </div>

            <button
              className="gen-btn"
              disabled={!canGenerate}
              onClick={handleGenerate}
            >
              ✦ Start Our Faith Conversation
            </button>
          </div>
        </>
      )}

      {loading && (
        <div className="loading-wrap">
          <span className="loading-cross">✦</span>
          <div className="loading-text">Preparing your conversation...</div>
          <div className="loading-sub">Rooted in the Word. Ready in moments.</div>
        </div>
      )}

      {result && !loading && (
        <div className="result-wrap">
          <div className="result-header">
            <div className="result-tag">
              ✦ {selectedAge?.icon} {selectedAge?.label} · {activeTopic}
            </div>
            <div className="result-title">{result.title}</div>
            <div className="result-meta">Your 5-minute family faith conversation · Use it right now</div>
          </div>

          <div className="cards">

            {/* SCRIPTURE */}
            <div className="card scripture-card">
              <div className="card-label">📖 Today's Scripture</div>
              <div className="scripture-ref">{result.scripture?.reference}</div>
              <div className="scripture-text">"{result.scripture?.text}"</div>
            </div>

            {/* TRUTH */}
            <div className="card">
              <div className="card-label">💡 The Truth Behind It</div>
              <div className="card-body">{result.truth}</div>
            </div>

            {/* OPENER */}
            <div className="card opener-card">
              <div className="card-label">💬 Start With This</div>
              <div className="opener-text">{result.opener}</div>
            </div>

            {/* QUESTION */}
            <div className="card">
              <div className="card-label">🌿 Ask Your Child</div>
              <div className="question-text">{result.question}</div>
            </div>

            {/* ACTIVITY */}
            <div className="card">
              <div className="card-label">🎨 Do It Together</div>
              <div className="activity-name">{result.activity?.name}</div>
              <div className="card-body">{result.activity?.description}</div>
            </div>

            {/* PARENT NOTE */}
            <div className="card parent-card">
              <div className="card-label">🙏 For You, Parent</div>
              <div className="parent-note">{result.parent_note}</div>
            </div>

            {/* DECLARATION */}
            <div className="card declaration-card">
              <div className="card-label" style={{justifyContent:"center"}}>⚡ Family Declaration</div>
              <div className="declaration-text">{result.declaration}</div>
              <button className="declare-btn" onClick={() => setDeclared(true)}>
                {declared ? "✓ We declared this!" : "Say it together out loud"}
              </button>
            </div>

          </div>

          <div className="result-actions">
            <button className="action-btn action-new" onClick={handleNew}>
              ✦ New Conversation
            </button>
            <button className="action-btn action-print" onClick={() => window.print()}>
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
