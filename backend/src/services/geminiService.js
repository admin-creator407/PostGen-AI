const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY environment variable is not defined.");
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const generatePostContent = async (topic, tone, length) => {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  let lengthPrompt = "";
  if (length === "short") {
    lengthPrompt =
      "Keep it under 100 words. Straight to the point, impactful, brief.";
  } else if (length === "medium") {
    lengthPrompt =
      "Between 100 to 200 words. Balanced depth, readable paragraphs, easy to scan.";
  } else {
    lengthPrompt =
      "Between 200 to 350 words. Deep dive, storytelling details, substantial content.";
  }

  let tonePrompt = "";
  if (tone === "professional") {
    tonePrompt =
      "Use an authoritative, industry-expert tone. Emphasize business value, clarity, and professionalism.";
  } else if (tone === "casual") {
    tonePrompt =
      "Use a friendly, conversational, approachable, and authentic tone. Like talking to a peer.";
  } else if (tone === "storytelling") {
    tonePrompt =
      "Start with a narrative hook, share a struggle or challenge, pivot to a turning point, and share the key lesson learned. Highly relatable and engaging.";
  } else if (tone === "thought-leadership") {
    tonePrompt =
      "Contrarian or insightful perspective. Challenge the status quo, offer unique observations, and write with inspiring credibility.";
  }

  const prompt = `
    You are a professional social media strategist and world-class LinkedIn writer.
    Generate a compelling LinkedIn post about the following topic:
    Topic: "${topic}"
    Tone of post: ${tonePrompt}
    Length of post: ${lengthPrompt}
    
    Structure requirements:
    1. A strong opening hook (first 1-2 lines) that commands attention and stops the feed-scroll.
    2. High-value insights, actionable points, or a compelling story formatted with clear line breaks. Use short paragraphs (1-3 sentences maximum) to keep readability high.
    3. Use subtle bullet points or numbered lists where appropriate for scanning.
    4. A clear, natural Call to Action (CTA) at the end, inviting reader comments or thoughts (e.g. asking a question).
    5. Place 3 to 5 highly relevant hashtags at the very bottom, separated by spaces.
    
    Important Constraints:
    - Never include generic placeholder text like "[Your Name]" or "[Your Company]". Make the post complete and ready-to-publish.
    - Keep formatting clean, avoiding excessive emojis. Only use emojis where they add visual structure.
    - Provide ONLY the post content. No introductory greetings or meta-text.
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return result.response.text().trim();
};

//  Rewrites ur existing post into new linkedin post

const rewritePostContent = async (originalPost) => {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert LinkedIn copywriter. Rewrite the following LinkedIn draft to make it far more engaging, professional, and readable while preserving its core message and value.
    
    Original Draft:
    "${originalPost}"
    
    Ensure the rewritten version:
    1. Has a significantly stronger, scroll-stopping hook.
    2. Restructures long paragraphs into readable, short blocks (1-3 sentences).
    3. Adds structure using bullet points or spacing if it improves clarity.
    4. Includes an engaging Call to Action (CTA) at the end.
    5. Concludes with 3 to 5 highly relevant hashtags.
    
    Return ONLY the rewritten post. No introduction or notes.
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return result.response.text().trim();
};

//Generates a slide-by-slide LinkedIn Carousel.

const generateCarouselContent = async (topic) => {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert social media creator. Generate content for a 5-slide educational LinkedIn PDF Carousel about the following topic:
    Topic: "${topic}"
    
    Format the response as a clear slide-by-slide structure.
    
    Output requirements:
    Slide 1: Hook (Title & Subtitle - high attention grabber)
    Slide 2: Problem (The pain point or challenge the audience faces)
    Slide 3: Solution (The core concept, framework, or answer)
    Slide 4: Example (A real-world application, checklist, or 3 actionable bullet points)
    Slide 5: CTA (Call to action - save, share, comment)
    
    Write content for each slide clearly. Keep it concise since slides have limited space.
    Return ONLY the text for the slides. Label each section as "Slide 1: [Title]" followed by its content.
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return result.response.text().trim();
};

module.exports = {
  generatePostContent,
  rewritePostContent,
  generateCarouselContent,
};
