import { AssemblyAI } from "assemblyai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Create AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

/**
 * Upload audio file to AssemblyAI
 * @param {string} filePath - path to audio file (e.g. sample.wav)
 * @returns {string|null} upload URL
 */
export async function uploadAudio(filePath) {
  try {
    console.log("Uploading file:", filePath);

    const audioData = fs.readFileSync(filePath);
    const uploadResponse = await client.files.upload(audioData);

    return uploadResponse;
  } catch (err) {
    console.error("AssemblyAI upload error:", err);
    return null;
  }
}

/**
 * Transcribe audio using AssemblyAI
 * RETURNS TEXT + WORD TIMESTAMPS
 * @param {string} audioUrl
 * @returns {{ text: string, words: Array } | null}
 */
export async function transcribeAudio(audioUrl) {
  try {
    console.log("Starting transcription...");

    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
      punctuate: true,
      format_text: true
      // word timestamps are included by default
    });

    if (transcript.status === "error") {
      console.error("AssemblyAI transcription error:", transcript.error);
      return null;
    }

    console.log("Transcription completed.");

    return {
      text: transcript.text,
      words: transcript.words || []
    };
  } catch (err) {
    console.error("AssemblyAI transcription API error:", err);
    return null;
  }
}
