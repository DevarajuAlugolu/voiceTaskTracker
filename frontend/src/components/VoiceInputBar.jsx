import React, { useRef, useState } from "react";
import axios from "axios";
import { Mic, MicOff, Wand2 } from "lucide-react";

const API_BASE = "/api";

const hasSpeechSupport = () =>
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

export default function VoiceInputBar({ onParsed }) {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  const handleParse = async () => {
    const text = (transcriptRef.current || transcript).trim();
    if (!text) {
      setError("Say something or type a task first.");
      return;
    }
    setParsing(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/voice/parse`, {
        transcript: text,
      });
      onParsed(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to parse voice input");
    } finally {
      setParsing(false);
    }
  };

  const startListening = () => {
    setError("");
    if (!hasSpeechSupport()) {
      setError("Speech recognition is not supported in this browser. You can still type.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setTranscript(text);
      transcriptRef.current = text;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError("Unable to capture audio. Please try again.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      if (transcriptRef.current.trim()) {
        handleParse();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const handleChange = (e) => {
    setTranscript(e.target.value);
    transcriptRef.current = e.target.value;
  };

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium">
          <Wand2 className="h-3.5 w-3.5" />
          Voice capture
        </div>
        {!hasSpeechSupport() && (
          <span className="text-[11px] text-amber-300">
            Browser has no speech API – type instead.
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={listening ? stopListening : startListening}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-slate-50 transition ${
            listening
              ? "border-rose-500 bg-rose-600 shadow-md shadow-rose-500/40"
              : "border-slate-700 bg-slate-900 hover:border-indigo-500 hover:text-indigo-100"
          }`}
          title={listening ? "Stop listening" : "Start listening"}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        <input
          value={transcript}
          onChange={handleChange}
          placeholder='Speak or type: "Create a high priority task to review the PR by tomorrow evening…"'
          className="h-9 flex-1 rounded-full border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleParse}
          disabled={parsing}
          className="inline-flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {parsing && <span className="h-3 w-3 animate-spin rounded-full border border-b-transparent" />}
          Review
        </button>
      </div>
      {error && (
        <p className="text-[11px] text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}