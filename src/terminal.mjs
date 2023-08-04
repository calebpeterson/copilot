import * as dotenv from "dotenv";
dotenv.config();

import chalk from "chalk-template";
import { default as CHALK } from "chalk";
import { createInterface } from "readline";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  HumanChatMessage,
  SystemChatMessage,
  AIChatMessage,
} from "langchain/schema";
import { CallbackManager } from "langchain/callbacks";
import ipc from "node-ipc";
import { IPC_HOST_ID, PROMPT_INJECTION } from "./constants.mjs";

// Clear the console
process.stdout.write("\x1Bc");

let HISTORY = [];

function countOccurrences(str) {
  let count = 0;
  let pos = str.indexOf("```");

  while (pos !== -1) {
    count++;
    pos = str.indexOf("```", pos + 1);
  }

  return count;
}

const createAnswerHandlers = (history) => {
  let buffer = "";
  return {
    async handleLLMNewToken(token) {
      buffer += token;

      const isInCodeBlock = countOccurrences(buffer) % 2 === 1;

      if (isInCodeBlock) {
        process.stdout.write(chalk`{green ${token}}`);
      } else {
        process.stdout.write(token);
        process.stdout.write(CHALK.reset());
      }
    },

    async handleLLMEnd() {
      console.log("");
      history.push({ role: "assistant", message: buffer });
      buffer = "";
    },
  };
};

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0,
  streaming: true,
  callbackManager: CallbackManager.fromHandlers(createAnswerHandlers(HISTORY)),
});

const PROMPT = [
  "You are a terse, helpful software development assistant.",
  "You are using ES6, TypeScript, React, Recoil, Next.js and Node.js",
  "All code results should be wrapped in markdown code blocks.",
];

const response = await chat.call([
  ...PROMPT.map((prompt) => new SystemChatMessage(prompt)),
]);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run(input) {
  console.log();

  HISTORY.push({ role: "user", message: input });

  await chat.call([
    ...HISTORY.map(({ role, message }) =>
      role === "user"
        ? new HumanChatMessage(message)
        : new AIChatMessage(message)
    ),
  ]);
}

ipc.config.id = IPC_HOST_ID;
ipc.config.silent = true;
ipc.serve(() => {
  ipc.server.on(PROMPT_INJECTION, async (question) => {
    console.log("(INJECTED)", question);
    await run(question);

    console.log();
    await ask();
  });
});
ipc.server.start();

async function ask() {
  const question = await new Promise((resolve) => {
    rl.question(chalk`\n{green ▶} `, resolve);
  });

  if (question.trim() === ".exit") {
    rl.close();
    ipc.server.stop();
    process.exit(0);
  } else if (question.trim() === ".reset") {
    HISTORY = [];
  } else {
    await run(question);
    await ask();
  }
}

ask();
