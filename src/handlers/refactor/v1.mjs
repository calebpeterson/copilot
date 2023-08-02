// Code generator using langchain. Capable of generating multiple files.

import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import chalk from "chalk-template";
import {
  logError,
  logRefactorIntent,
  logSpecification,
} from "../../utils/logging.mjs";
import { refactorIntentSchema } from "../../schemas/index.mjs";

const parser = StructuredOutputParser.fromZodSchema(refactorIntentSchema);
const formatInstructions = parser.getFormatInstructions();

const translationPrompt = ChatPromptTemplate.fromPromptMessages([
  ...[
    "You are a helpful software development assistant using TypeScript, React, Recoil, and Next.js",
    "Refactor the given code based on the comments at the beginning:\n\n{specification}\n\n",
    "Reply using these formatting instructions:\n\n{format_instructions}",
  ].map((message) => SystemMessagePromptTemplate.fromTemplate(message)),
]);

const chat = new ChatOpenAI({ temperature: 0 });
const chain = new LLMChain({
  prompt: translationPrompt,
  llm: chat,
});

export const refactor = async (req, res) => {
  const { specification } = req.body;

  logSpecification(specification);

  try {
    const response = await chain.call({
      specification,
      format_instructions: parser.getFormatInstructions(),
    });

    const refactorIntent = await parser.parse(response.text);

    logRefactorIntent(refactorIntent);

    res.send(refactorIntent.content);
  } catch (error) {
    logError(error);

    res.status(500).json({
      message: `Refactor failed: ${error.message}`,
      specification,
      error: error.message,
    });
  }
};
