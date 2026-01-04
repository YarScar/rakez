"use client";
import React from "react";

export default function CatImageModal({ open, src, onClose, saveFilename }) {
  if (!open || !src) return null;

  const filename = saveFilename || 'rakez-cat-reward.png';

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: 20
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          maxWidth: 500,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 8,
            width: 32,
            height: 32,
            fontSize: "1.2rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ×
        </button>

        <h2 style={{ marginBottom: 16, color: "#1f2937" }}>🎉 Your Image Reward!</h2>
        <img
          src={src}
          alt="Cat Image Reward"
          style={{ width: "100%", borderRadius: 12, marginBottom: 16 }}
        />

        <div style={{ display: "flex", gap: 12 }}>
          <a
            href={src}
            download={filename}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px 24px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: 8,
              textDecoration: "none",
              color: "white",
              fontSize: "1rem",
              fontWeight: 600
            }}
          >
            💾 Save Image
          </a>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 24px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

