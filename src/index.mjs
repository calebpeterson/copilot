import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import bodyParser from "body-parser";
app.use(bodyParser.json());

import { ping } from "./handlers/ping.mjs";
app.get("/ping", ping);

import { generate } from "./handlers/generate/v2.mjs";
app.post("/generate/v2", generate);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Copilot running at http://localhost:${port}`);
});
