// ===============================
// TEXT ANALYSIS LOGIC
// ===============================

// Count filler words
export function countFillers(text) {
  const fillers = [
    "uh",
    "um",
    "like",
    "actually",
    "basically",
    "you know"
  ];

  const words = text.toLowerCase().split(/\s+/);
  return words.filter(word => fillers.includes(word)).length;
}

// Calculate speaking speed category
export function getSpeakingSpeed(text, durationSec) {
  const words = text.trim().split(/\s+/).length;
  const wpm = Math.round((words / durationSec) * 60);

  if (wpm > 160) return "fast";
  if (wpm < 110) return "slow";
  return "normal";
}

// Calculate Words Per Minute (numeric)
export function getWPM(text, durationSec) {
  const words = text.trim().split(/\s+/).length;
  return Math.round((words / durationSec) * 60);
}

// Estimate pauses based on transcript symbols
export function estimatePauses(text) {
  return (text.match(/\.{2,}|--|\.\s\./g) || []).length;
}

// Detect confidence drop in second half of speech
export function detectConfidenceDrop(text) {
  const mid = Math.floor(text.length / 2);

  const firstHalf = text.slice(0, mid);
  const secondHalf = text.slice(mid);

  return countFillers(secondHalf) > countFillers(firstHalf);
}

// Calculate word accuracy percentage
export function calculateWordAccuracy(text) {
  const words = text.trim().split(/\s+/);
  const totalWords = words.length;
  const fillerCount = countFillers(text);

  if (totalWords === 0) return 0;

  return Math.round(((totalWords - fillerCount) / totalWords) * 100);
}

// Calculate overall confidence score (0–100)
export function calculateConfidenceScore(text, durationSec) {
  let score = 100;

  const fillers = countFillers(text);
  const pauses = estimatePauses(text);
  const speed = getSpeakingSpeed(text, durationSec);

  // Penalize filler usage
  score -= fillers * 5;

  // Penalize pauses
  score -= pauses * 3;

  // Penalize awkward speed
  if (speed === "fast" || speed === "slow") {
    score -= 10;
  }

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, score));
}

export function detectPausesFromTimestamps(words, thresholdMs = 1500) {
  let pauseCount = 0;

  for (let i = 1; i < words.length; i++) {
    const gap = words[i].start - words[i - 1].end;

    if (gap >= thresholdMs) {
      pauseCount++;
    }
  }

  return pauseCount;
}
