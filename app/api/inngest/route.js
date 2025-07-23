import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
<<<<<<< HEAD
=======

>>>>>>> c408a44 (First Commit)
import { checkBudgetAlerts, generateMonthlyReports, processRecurringTransaction, triggerRecurringTransactions } from "@/lib/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processRecurringTransaction, triggerRecurringTransactions, generateMonthlyReports, checkBudgetAlerts],
});
