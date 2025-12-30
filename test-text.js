import {
  countFillers,
  getSpeakingSpeed,
  estimatePauses,
  detectConfidenceDrop
} from "./analysis/analysis.js";

const fakeText =
  "Uh I think my name is Lokesh and um I work on projects. " +
  "I have experience and like I am confident... but um sometimes nervous.";

console.log("Fillers:", countFillers(fakeText));
console.log("Speed:", getSpeakingSpeed(fakeText, 30)); // 30 sec
console.log("Pauses:", estimatePauses(fakeText));
console.log("Confidence Drop:", detectConfidenceDrop(fakeText));
