#!/usr/bin/env node

import ipc from "node-ipc";
import { IPC_CLIENT_ID, IPC_HOST_ID, PROMPT_INJECTION } from "./constants.mjs";

if (process.argv.length < 2) {
  console.error(`Usage: `);
  process.exit(1);
}

const prompt = process.argv[process.argv.length - 1];

console.log(`Sending "${prompt}" to Copilot`);

ipc.config.id = IPC_CLIENT_ID;
ipc.config.maxRetries = 3;
ipc.config.silent = true;
ipc.connectTo(IPC_HOST_ID, () => {
  ipc.of[IPC_HOST_ID].on("connect", () => {
    ipc.of[IPC_HOST_ID].emit(PROMPT_INJECTION, prompt);
    ipc.disconnect(IPC_HOST_ID);
  });
});
