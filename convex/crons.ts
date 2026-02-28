import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every day at 03:00 UTC — purges users past their 30-day deletion window
crons.daily(
  "hard-delete-expired-accounts",
  { hourUTC: 3, minuteUTC: 0 },
  internal.scheduled.hardDeleteUsers.run
);

export default crons;
