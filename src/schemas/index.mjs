import { z } from "zod";

export const fileIntentSchema = z.object({
  filename: z.string(),
  content: z.string({ description: "the raw code for this file" }),
});

export const fileIntentsSchema = z.array(fileIntentSchema);
