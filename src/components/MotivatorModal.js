"use client";
import React from "react";

export default function MotivatorModal({ fact, onClose }) {
  console.log('MotivatorModal render, fact:', fact);
  return (
    <div className="motivator-overlay">
      <div className="motivator-modal card">
        <h3 style={{ marginTop: 0 }}>💡 Quick Tip</h3>
        <p style={{ marginTop: 8 }}>{fact}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button className="button" onClick={onClose}>Close</button>
        </div>
      </div>

      <style jsx>{`
        .motivator-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.35);
          z-index: 9999;
          padding: 24px;
        }
        .motivator-modal {
          max-width: 560px;
          width: 100%;
          padding: 20px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
