/* src/WhisperClient.js
import { pipeline, env } from "@xenova/transformers";
import {
  decodeToMonoFloat32,
  trimSilence,
  normalize,
} from "./utils/audioUtils";

// Make sure we use remote Hugging Face models, not local ones
env.allowLocalModels = false;

// You can change this to another Whisper model later (tiny.en / base.en / small.en, etc.)
const MODEL_ID = "Xenova/distil-whisper-base.en";

let asrPipeline = null;

/**
 * Initialize the Whisper pipeline once and reuse it.
 
export async function initWhisper() {
  if (!asrPipeline) {
    console.log("[Whisper] Initializing pipeline with model:", MODEL_ID);

    asrPipeline = await pipeline(
      "automatic-speech-recognition",
      MODEL_ID,
      {
        // If you ever want download progress logs:
        // progress_callback: (p) => console.log("[Whisper] Download progress:", p),
      }
    );

    console.log("[Whisper] Pipeline ready");
  }

  return asrPipeline;
}

/**
 * Transcribe a File/Blob using Whisper via transformers.js
 * @param {File|Blob} fileOrBlob
 * @returns {Promise<string>}
 
export async function transcribeAudio(fileOrBlob) {
  if (!fileOrBlob) {
    throw new Error("No audio file provided");
  }

  const pipe = await initWhisper();
  console.log("[Whisper] Input file/blob:", fileOrBlob);

  // 1) Decode to mono Float32 and get the real sampleRate
  const { signal, sampleRate } = await decodeToMonoFloat32(fileOrBlob);
  console.log(
    "[Whisper] Decoded mono audio length:",
    signal.length,
    "samples @",
    sampleRate,
    "Hz"
  );

  // 2) Trim leading/trailing silence
 // const trimmed = trimSilence(signal, { threshold: 0.01, sampleRate });
  const trimmed = signal;
  // 3) Normalize volume so peaks ≈ 0.9
  const normalized = normalize(trimmed, 0.9);
  console.log(
    "[Whisper] After trim+normalize:",
    normalized.length,
    "samples"
  );
 

  // 4) Run Whisper pipeline with cleaned audio
  const result = await pipe(normalized, {
    sampling_rate: sampleRate,
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: false,
  });

  console.log("[Whisper] Raw result from pipeline:", result);

  // Normalize result into a plain string for NoteTaker
  let text;
  if (typeof result === "string") {
    text = result;
  } else if (result && typeof result.text === "string") {
    text = result.text;
  } else {
    console.warn("[Whisper] Unexpected result shape; returning JSON string");
    text = JSON.stringify(result);
  }

  return text;
}

// Optional: default export if you ever want it
export default {
  initWhisper,
  transcribeAudio,
};

*/