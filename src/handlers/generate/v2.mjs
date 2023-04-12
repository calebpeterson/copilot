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
  logFileIntents,
  logSpecification,
} from "../../utils/logging.mjs";
import { fileIntentsSchema } from "../../schemas/index.mjs";

const parser = StructuredOutputParser.fromZodSchema(fileIntentsSchema);
const formatInstructions = parser.getFormatInstructions();

const translationPrompt = ChatPromptTemplate.fromPromptMessages([
  ...[
    "You are a helpful software development assistant using TypeScript, React, Recoil, and Next.js",
    "Only generate tests if explicitly asked.",
    "When creating tests use 'jest', '@testing-library/react' and '@testing-library/react-hooks'.",
    "Write code using this specification:\n\n{specification}\n\n",
    "Reply using these formatting instructions:\n\n{format_instructions}",
  ].map((message) => SystemMessagePromptTemplate.fromTemplate(message)),
]);

const chat = new ChatOpenAI({ temperature: 0 });
const chain = new LLMChain({
  prompt: translationPrompt,
  llm: chat,
});

export const generate = async (req, res) => {
  const { specification } = req.body;

  logSpecification(specification);

  try {
    const response = await chain.call({
      specification,
      format_instructions: parser.getFormatInstructions(),
    });

    const fileIntents = await parser.parse(response.text);

    logFileIntents(fileIntents);

    res.send(fileIntents);
  } catch (error) {
    logError(error);

    res.status(500).json({
      message: "Generation failed.",
      specification,
      error: error.message,
    });
  }
};
