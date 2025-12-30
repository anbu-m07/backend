import { analyzeInterview } from "./analysis/index.js";

const filePath = "sample.wav";
const durationSeconds = 30;

(async () => {
  console.log("Sending audio to AssemblyAI...");
  const result = await analyzeInterview(filePath, durationSeconds);
  console.log("\n=== ANALYSIS RESULT ===");
  console.log(result);
})();
