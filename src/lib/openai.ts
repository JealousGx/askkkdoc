import OpenAI from "openai";
import { env } from "./config";

const openai = new OpenAI({
  apiKey: env.OPEN_AI_KEY,
});

export default openai;
