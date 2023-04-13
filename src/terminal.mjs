import * as dotenv from "dotenv";
dotenv.config();

import chalk from "chalk-template";
import { createInterface } from "readline";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { CallbackManager } from "langchain/callbacks";

// Clear the console
process.stdout.write("\x1Bc");

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0,
  streaming: true,
  callbackManager: CallbackManager.fromHandlers({
    async handleLLMNewToken(token) {
      process.stdout.write(token);
    },

    async handleLLMEnd() {
      console.log("");
    },
  }),
});

const PROMPT = [
  "You are a helpful software development assistant.",
  "You are using ES6, TypeScript, React, Recoil, Next.js and Node.js",
  "All code results should be wrapped in markdown code blocks.",
];

const response = await chat.call(
  PROMPT.map((prompt) => new SystemChatMessage(prompt))
);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run(input) {
  console.log();
  await chat.call([new HumanChatMessage(input)]);
}

async function ask() {
  const answer = await new Promise((resolve) => {
    rl.question(chalk`\n{white ▶} `, resolve);
  });

  if (answer.trim() === ".exit") {
    rl.close();
    process.exit(0);
  } else {
    await run(answer);
    await ask();
  }
}

ask();
