import { uploadAudio, transcribeAudio } from "./assemblyai.js";
import {
  countFillers,
  getSpeakingSpeed,
  detectConfidenceDrop,
  calculateConfidenceScore,
  getWPM,
  calculateWordAccuracy,
  detectPausesFromTimestamps
} from "./analysis.js";

/**
 * Main function used by the app / UI
 * @param {string} filePath - path to audio file (e.g. sample.wav)
 * @param {number} durationSec - duration of audio in seconds
 * @returns {object} analysis result
 */
export async function analyzeInterview(filePath, durationSec) {
  // 1. Upload audio to AssemblyAI
  const audioUrl = await uploadAudio(filePath);
  if (!audioUrl) {
    return { error: "Audio upload failed" };
  }

  // 2. Transcribe audio (TEXT + WORD TIMESTAMPS)
  const transcriptionResult = await transcribeAudio(audioUrl);
  if (!transcriptionResult) {
    return { error: "Transcription failed" };
  }

  const transcriptText = transcriptionResult.text;
  const words = transcriptionResult.words;

  // 3. Run analysis logic
  return {
    transcript: transcriptText,
    fillerCount: countFillers(transcriptText),
    speed: getSpeakingSpeed(transcriptText, durationSec),
    wpm: getWPM(transcriptText, durationSec),

    // ✅ REAL pause detection (audio-based)
    pauseCount: detectPausesFromTimestamps(words),

    confidenceDrop: detectConfidenceDrop(transcriptText),
    confidenceScore: calculateConfidenceScore(transcriptText, durationSec),
    wordAccuracy: calculateWordAccuracy(transcriptText)
  };
}
