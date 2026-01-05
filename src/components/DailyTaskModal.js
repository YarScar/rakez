"use client";
import React from "react";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export default function DailyTaskModal({ task, onClose }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // internal visibility and fetching state so this component can
  // show a floating bot button even when no `task` prop is provided.
  const [visible, setVisible] = React.useState(Boolean(task));
  const [internalTask, setInternalTask] = React.useState(null);
  const [fetchingTask, setFetchingTask] = React.useState(false);
  const [minimized, setMinimized] = React.useState(false);

  React.useEffect(() => {
    if (task) {
      setInternalTask(null);
      setVisible(true);
    }
  }, [task]);

  const currentTask = task || internalTask;

  const doAsk = async () => {
    if (!question || question.trim().length === 0) return;
    if (!currentTask) return;
    setLoading(true);
    try {
      const res = await fetch('/api/daily-task/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: currentTask.title, question }),
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

  const openBot = async () => {
    // If parent provided a task, just show the modal.
    if (task) {
      setVisible(true);
      return;
    }

    // otherwise fetch the daily task from the API and show it
    setFetchingTask(true);
    try {
      const res = await fetch('/api/daily-task');
      if (!res.ok) return;
      const json = await res.json();
      const t = json.task || json;
      setInternalTask(t);
      setVisible(true);
      setMinimized(false);
    } catch (e) {
      // ignore fetch error for now
    } finally {
      setFetchingTask(false);
    }
  };

  const handleClose = () => {
    // minimize instead of fully hiding so user can re-open
    // persist the current task internally so the minimized widget can remain
    if (currentTask) setInternalTask(currentTask);
    setVisible(false);
    if (currentTask) setMinimized(true);
  };

  return (
    <>
      {visible && currentTask && (
        <div className="daily-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
          <div className="daily-modal card" role="dialog" aria-modal="true">
            <h3 style={{ marginTop: 0 }}>🎯 Today's Bonus Task</h3>
            <h4 style={{ marginTop: 8 }}>{currentTask.title}</h4>
            <p style={{ marginTop: 8 }}>{currentTask.description?.replace(/^BONUS:\d+\n/, '')}</p>

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
                      disabled={loading}
                    />
                    {/* Themed loading spinner */}
                    {loading && (
                      <div className="spinner" aria-hidden="true"></div>
                    )}
                    {/* announce loading to assistive tech */}
                    {loading && <span className="sr-only" role="status">Loading answer…</span>}

                    <button
                      className="button clear-primary"
                      onClick={() => { setQuestion(''); setAnswer(null); }}
                      aria-label="Clear question"
                      disabled={loading}
                    >
                      Clear
                    </button>
                  </div>

                  {answer && (
                    <div className="answer-box">
                      <strong>Answer:</strong>
                      <div style={{ marginTop: 8 }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{answer}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, gap: 12 }}>
              <div style={{ fontWeight: 700 }}>+15 points</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="button" onClick={() => { setVisible(false); setMinimized(true); }}>Minimize</button>
                <button className="button" onClick={handleClose}>Got it</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimized widget or floating bot (bottom-right) */}
      {minimized && currentTask ? (
        <div className="minimized" role="button" tabIndex={0} onClick={() => { setVisible(true); setMinimized(false); }} onKeyDown={(e) => { if (e.key === 'Enter') { setVisible(true); setMinimized(false); } }}>
          <div className="minimized-left">
            <div className="minimized-title">{currentTask.title}</div>
            <div className="minimized-sub">+15 pts</div>
          </div>
          <div className="minimized-actions">
            <button className="button small" onClick={(e) => { e.stopPropagation(); setVisible(true); setMinimized(false); }}>Open</button>
          </div>
        </div>
      ) : (
        <button
          className="bot-button"
          aria-label="Open daily task helper"
          onClick={openBot}
          title="Ask about today's task"
        >
          🤖
        </button>
      )}

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
          box-sizing: border-box;
          padding: 24px;
          border-radius: 10px;
        }
        /* Prevent long/unbroken text from overflowing the modal */
        .daily-modal, .daily-modal p, .daily-modal h3, .daily-modal h4, .daily-modal h5, .answer-box, .answer-box * {
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: pre-wrap;
          max-width: 100%;
        }
        /* Ensure code blocks and inline code wrap instead of causing horizontal scroll */
        .answer-box pre, .answer-box code {
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .answer-box img { max-width: 100%; height: auto; display: block; }
        .daily-modal :global(.button) { min-width: 90px; }

        /* Ask row styling */
        .ask-row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .ask-input {
          flex: 1;
          min-width: 0;
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
          flex: none;
        }
        .clear-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(37,99,235,0.16); }

        .answer-box {
          margin-top: 12px;
          background: var(--surface);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .answer-box p { margin: 0 0 12px; line-height: 1.6; }
        .answer-box h1, .answer-box h2, .answer-box h3 { margin: 8px 0 10px; }
        .answer-box ul { margin: 8px 0 12px; padding-left: 20px; }
        .answer-box li { margin-bottom: 6px; }

        /* Loading spinner (themed) */
        .spinner {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid rgba(0,0,0,0.08);
          border-top-color: var(--primary);
          animation: spin 800ms linear infinite;
          margin-left: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Visually hidden for screen readers */
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }

        .button[disabled], .ask-input[disabled] { opacity: 0.6; pointer-events: none; }

        /* Bot button */
        .bot-button {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 24px rgba(0,0,0,0.18);
          cursor: pointer;
          z-index: 9998;
          font-size: 22px;
        }
        .bot-button:hover { transform: translateY(-3px); }

        /* Minimized widget */
        .minimized {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: 320px;
          height: 64px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
          z-index: 9998;
          cursor: pointer;
        }
        .minimized-left { overflow: hidden; display:flex; flex-direction:column; gap:2px; }
        .minimized-title { font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:200px; }
        .minimized-sub { font-size:12px; color:var(--muted); }
        .minimized-actions { display:flex; gap:8px; }
        .button.small { min-width:60px; padding:6px 8px; height:36px; }
      `}</style>
    </>
  );
}
