import * as dotenv from "dotenv";
dotenv.config();

import fastify from "fastify";
const app = fastify();

import { ping } from "./handlers/ping.mjs";
app.get("/ping", ping);

import { generate } from "./handlers/generate/v2.mjs";
app.post("/generate/v2", generate);

import { refactor } from "./handlers/refactor/v1.mjs";
app.post("/refactor/v1", refactor);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Copilot running at http://localhost:${port}`);
});
