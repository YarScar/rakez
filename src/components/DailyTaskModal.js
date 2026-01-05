"use client";
import React from "react";

export default function DailyTaskModal({ task, onClose }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  if (!task) return null;

  const doAsk = async () => {
    if (!question || question.trim().length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/daily-task/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: task.title, question }),
      });
      const json = await res.json();
      if (res.ok) setAnswer(json.answer || 'No answer');
      else setAnswer(json.error || 'Failed to get answer');
    } catch (e) {
      setAnswer('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="daily-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="daily-modal card" role="dialog" aria-modal="true">
        <h3 style={{ marginTop: 0 }}>🎯 Today's Bonus Task</h3>
        <h4 style={{ marginTop: 8 }}>{task.title}</h4>
        <p style={{ marginTop: 8 }}>{task.description?.replace(/^BONUS:\d+\n/, '')}</p>

        <div style={{ marginTop: 12 }}>
          <button className="button" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide details' : 'More details'}
          </button>
        </div>

        {showDetails && (
          <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <h5 style={{ margin: '8px 0' }}>Why this helps</h5>
            <p style={{ marginTop: 4, color: 'var(--muted)' }}>
              Short, focused movement boosts blood flow and attention, while small cognitive tasks engage working memory and neural flexibility. Doing this regularly can improve mood and productivity.
            </p>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Ask me about this task</label>
              <div className="ask-row">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doAsk(); } }}
                  placeholder="e.g. How should I pace this?"
                  className="ask-input"
                />
                <button
                  className="button clear-primary"
                  onClick={() => { setQuestion(''); setAnswer(null); }}
                  aria-label="Clear question"
                >
                  Clear
                </button>
              </div>

              {answer && (
                <div className="answer-box">
                  <strong>Answer:</strong>
                  <p style={{ marginTop: 8 }}>{answer}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <div style={{ fontWeight: 700 }}>+15 points</div>
          <div>
            <button className="button" onClick={onClose}>Got it</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .daily-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.35);
          z-index: 9999;
          padding: 24px;
        }
        .daily-modal {
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          overflow: auto;
          padding: 24px;
          border-radius: 10px;
        }
        .daily-modal :global(.button) { min-width: 90px; }

        /* Ask row styling */
        .ask-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .ask-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);
          height: 44px;
          box-sizing: border-box;
          transition: box-shadow 120ms, border-color 120ms;
        }
        .ask-input:focus {
          outline: none;
          border-color: rgba(59,130,246,0.9);
          box-shadow: 0 4px 18px rgba(37,99,235,0.12);
        }
        .clear-primary {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          border: none;
          padding: 0 16px;
          height: 44px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(37,99,235,0.12);
          cursor: pointer;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }
        .clear-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(37,99,235,0.16); }

        .answer-box {
          margin-top: 12px;
          background: var(--surface);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}
