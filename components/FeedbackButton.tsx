"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("feedback").insert({
      message: message.trim(),
      page_url: window.location.href,
    });
    setSending(false);
    if (error) {
      console.error(error);
      return;
    }
    setSent(true);
    setMessage("");
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 1800);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 56,
          right: 16,
          zIndex: 50,
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          padding: 0,
          background: "var(--panel)",
          border: "2px solid var(--panel-border)",
          color: "var(--text-dim)",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        title="Feedback"
        aria-label="Feedback"
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 104,
            right: 16,
            zIndex: 50,
            width: 260,
            background: "var(--panel)",
            border: "2px solid var(--panel-border)",
            borderRadius: 6,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {sent ? (
            <div style={{ fontSize: 9, color: "var(--green)", textAlign: "center" }}>
              THANKS! 🙏
            </div>
          ) : (
            <>
              <div style={{ fontSize: 9, color: "var(--gold)" }}>GOT FEEDBACK?</div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="BUGS, IDEAS, COMPLAINTS..."
                rows={4}
                maxLength={1000}
                style={{
                  fontFamily: "var(--font-press-start), monospace",
                  fontSize: 8,
                  padding: 8,
                  background: "#0a0e14",
                  border: "2px solid var(--panel-border)",
                  color: "var(--text)",
                  borderRadius: 4,
                  resize: "none",
                }}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setOpen(false)}
                  style={{ fontSize: 8, background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer" }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={sending || !message.trim()}
                  style={{
                    fontSize: 8,
                    padding: "8px 14px",
                    background: "var(--panel)",
                    border: "2px solid var(--gold)",
                    color: "var(--text)",
                    borderRadius: 4,
                    cursor: sending ? "default" : "pointer",
                    opacity: sending || !message.trim() ? 0.6 : 1,
                  }}
                >
                  {sending ? "..." : "SEND"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
