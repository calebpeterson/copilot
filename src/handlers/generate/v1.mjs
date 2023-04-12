// Code generator using the OpenAPI package directly

import { Configuration, OpenAIApi } from "openai";

const createPrompt = (specification) =>
  [
    "Using TypeScript, React, Recoil, and Next.js",
    "Answer using the following format:",
    "FILENAME: <filename>",
    "markdown code block containing the code belonging in that file",
    "Write code given the following specification:",
    specification,
    "Only generate tests if explicitly asked.",
    "Use jest, '@testing-library/react' and '@testing-library/react-hooks'.",
  ].map((content) => ({ role: "user", content }));

export const generate = async (req, res) => {
  const { specification } = req.body;
  console.log("Generate", { specification });

  try {
    const configuration = new Configuration({
      organization: process.env.OPENAI_ORGANIZATION,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: createPrompt(specification),
      temperature: 0,
    });

    res.send(completion.data.choices[0].message.content);
  } catch (error) {
    console.error(error.message);
    res.send({
      message: "Generation failed.",
      specification,
      error: error.message,
    });
  }
};
