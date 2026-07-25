const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) console.warn("GEMINI_API_KEY environment variable is not defined.");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 45000);
const MAX_ATTEMPTS = 3;
const inFlightRequests = new Map();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (error) => {
  const status = error?.status || error?.response?.status;
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504 || !status;
};

const withTimeout = (promise) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    const error = new Error("The AI service took too long to respond. Please try again.");
    error.status = 504;
    reject(error);
  }, REQUEST_TIMEOUT_MS);
  promise.then(resolve, reject).finally(() => clearTimeout(timer));
});

async function requestContent(prompt, minimumWords) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("AI generation is not configured. Add GEMINI_API_KEY to the backend environment.");
    error.status = 503;
    throw error;
  }

  const model = ai.getGenerativeModel({ model: MODEL_NAME });
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const result = await withTimeout(model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        // Do not cap maxOutputTokens here. Gemini 2.5 Flash uses part of that
        // budget internally, and low caps can leave only a fragment for users.
        generationConfig: { temperature: 0.7 },
      }));
      const content = result.response.text().trim();
      if (!content) throw new Error("The AI service returned an empty response.");
      if (content.split(/\s+/).length < minimumWords) {
        throw new Error("The AI service returned incomplete content.");
      }
      return content;
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS || !isRetryable(error)) break;
      await sleep(300 * (2 ** (attempt - 1)));
    }
  }
  const error = new Error(lastError?.message === "The AI service returned incomplete content."
    ? "The AI returned incomplete content. Please try again."
    : isRetryable(lastError)
    ? "The AI service is temporarily busy. Please try again in a moment."
    : "Unable to generate content. Please check your request and try again.");
  error.status = lastError?.status || lastError?.response?.status || 502;
  throw error;
}

const generateOnce = (key, prompt, minimumWords) => {
  if (!inFlightRequests.has(key)) {
    const request = requestContent(prompt, minimumWords).finally(() => inFlightRequests.delete(key));
    inFlightRequests.set(key, request);
  }
  return inFlightRequests.get(key);
};

const lengthInstructions = {
  short: { text: "60-100 words.", minimumWords: 45 },
  medium: { text: "120-200 words.", minimumWords: 90 },
  long: { text: "220-350 words.", minimumWords: 160 },
};
const toneInstructions = {
  professional: "Authoritative, clear, business-focused.",
  casual: "Friendly, conversational, authentic.",
  storytelling: "Narrative hook, challenge, turning point, lesson.",
  "thought-leadership": "Insightful perspective that challenges conventional thinking.",
};

// Providers occasionally return a perfectly valid response as one long line.
// Preserve their wording, but give that response the readable LinkedIn layout
// the UI and copied post expect.
const ensureReadableLayout = (content) => {
  if (content.includes('\n')) return content;

  const hashtagMatch = content.match(/\s+(#[\w]+(?:\s+#[\w]+)*)\s*$/);
  const hashtags = hashtagMatch ? hashtagMatch[1] : '';
  const body = hashtagMatch ? content.slice(0, hashtagMatch.index).trim() : content;
  const sentences = body.split(/(?<=[.!?])\s+/).filter(Boolean);

  if (sentences.length < 3) return content;

  const paragraphs = [sentences.slice(0, 1).join(' ')];
  for (let index = 1; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(' '));
  }
  return [...paragraphs, ...(hashtags ? [hashtags] : [])].join('\n\n');
};

const generatePostContent = (topic, tone, length) => {
  const settings = lengthInstructions[length];
  const prompt = `Write a ready-to-publish LinkedIn post about: ${topic}\nTone: ${toneInstructions[tone]}\nLength: ${settings.text}\nRequired layout: write a one-line hook, then at least 3 separate short paragraphs or bullet sections, then a one-line CTA, then 3-5 hashtags on their own final line. Separate every section with a blank line. Use useful, specific insight. Return only the post; no preamble or placeholders.`;
  return generateOnce(`post:${topic}:${tone}:${length}`, prompt, settings.minimumWords).then(ensureReadableLayout);
};
const rewritePostContent = (originalPost) => {
  const prompt = `Rewrite this LinkedIn draft for clarity and engagement while preserving its meaning:\n${originalPost}\nUse a stronger hook, at least 3 short paragraphs or bullet sections separated by blank lines, a CTA, and 3-5 relevant hashtags on a final separate line. Return only the rewritten post.`;
  return generateOnce(`rewrite:${originalPost}`, prompt, 90).then(ensureReadableLayout);
};
const generateCarouselContent = (topic) => {
  const prompt = `Create concise content for a 5-slide educational LinkedIn carousel about: ${topic}\nFormat exactly as Slide 1 through Slide 5. Cover: hook, problem, solution, example/actionable points, and CTA. Return only slide content.`;
  return generateOnce(`carousel:${topic}`, prompt, 80);
};

module.exports = { generatePostContent, rewritePostContent, generateCarouselContent };
