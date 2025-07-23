import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "grow-easy", // Unique app ID
  name: "GrowEasy",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});
