import readLineSync from "readline-sync";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const workspaceId = process.env.WORKSPACE_ID;
const projectId = process.env.PROJECT_ID;
const taskId = process.env.TASK_ID;
const tagIds = process.env.TAG_IDS.split(",");
const CLOCKIFY_API_KEY = process.env.CLOCKIFY_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const addTimeEntry = async ({ start, end, description }) => {
  const response = await fetch(
    `https://api.clockify.me/api/v1/workspaces/${workspaceId}/time-entries`,
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-Api-Key": CLOCKIFY_API_KEY,
      },
      body: JSON.stringify({
        description,
        projectId,
        start,
        end,
        billable: true,
        tagIds,
        taskId,
        customFields: [],
      }),
      method: "POST",
    }
  );
  return response.json();
};

const tools = {
  addTimeEntry: addTimeEntry,
};

const SYSTEM_PROMPT = `
You are an AI Time Entry Assistant with START, PLAN, ACTION, Observation and Output state.
You must wait for the user prompt and first PLAN using available tools.
After planning, Take the action with appropriate tools and wait for the Observation based on Action.
Once you get the observations, Return the AI response based on START prompt and Observation.
Make sure that PLAN, ACTION, Observation and Output state will be in different prompts.

You can help users with creating time entries in Clockify.
IMPORTANT: EveryTime, on response, You must must strictly follow the JSON output format. Ignore triple backticks and not format the output in JSON.
I am second time saying that EveryTime You must must strictly follow the JSON output format. Ignore triple backticks and not format the output in JSON.

Available Tools:
- addTimeEntry(start:string, end:string, description:string): Add a new time entry to Clockify.
addTimeEntry takes the following parameters:
- start: The start time of the time entry(Ex. 2025-02-11T04:45:00Z).
- end: The end time of the time entry(Ex. 2025-02-11T07:30:00Z).
- description: The description of the time entry. YOU MUST FOLLOW THE FORMAT. it will be list of points which will start with "-" and each point will be in new line.

Example:
START
{"type": "user", "user":" add multiple time entries to clockify on 22-10-2024 IST from 10:35 to 13:05 and on same date from 13:48 to 19:16 IST. both will have same description as - Explored how will implement dynamic function support. - Created validation json and backend schema for dynamic function support."}
{"type": "plan", "plan": "I will convert the provided time to UTC, then use the addTimeEntry function twice to add two time entries to Clockify for October 22nd, 2024. The first entry will be from 10:35 to 13:05 IST, and the second from 13:48 to 19:16 IST. Both entries will have the same description: \"Explored how will implement dynamic function support. \n - Created validation json and backend schema for dynamic function support.\""}
{"type": "action", "function": "addTimeEntry", "parameters": {"start": "2024-10-22T05:05:00Z", "end": "2024-10-22T07:35:00Z", "description": "- Explored how will implement dynamic function support. \\n - Created validation json and backend schema for dynamic function support."}}
{"type": "observation", "observation":"First time entry added in Clockify."}
{"type": "action", "function": "addTimeEntry", "parameters": {"start": "2024-10-22T08:18:00Z", "end": "2024-10-22T13:36:00Z", "description": "- Explored how will implement dynamic function support. \\n - Created validation json and backend schema for dynamic function support."}}
{"type": "observation", "observation":"Second time entry added in Clockify."}
{"type": "output", "output":"Your time entries have been added successfully to Clockify."}

MAKE SURE THAT EVERY RESPONSE, ONLY ONE JSON OUTPUT. NO MULTIPLE JSON OUTPUTS.
YOU MUST FOLLOW DESCRIPTION FORMAT. IT WILL BE LIST OF POINTS, EACH POINT WILL START WITH "-" AND EACH POINT WILL BE IN NEW LINE. IF NOT HAVE ADD IT.

EVERYTIME AND EVERY RESPONSE, Output prompt must be in JSON format without any type of formatting or markdown. it must be in single line string. THIS IS MY ORDER. YOU MUST FOLLOW THIS. NO EXCUSES. NO EXCEPTIONS. AND MUST BE EVERY TIME.

`;

// initial System prompt
const messages = [{ role: "user", parts: [{ text: SYSTEM_PROMPT }] }];

(async () => {
  const query = readLineSync.question(">> ");

  // User message
  const userMessage = {
    type: "user",
    user: query,
  };

  messages.push({
    role: "user",
    parts: [{ text: JSON.stringify(userMessage) }],
  });

  while (true) {
    const chat = await model.generateContent({ contents: messages });
    let result = chat.response.text();

    console.log("--------------------AI start ----------------");
    console.log(result);
    console.log("--------------------AI end ----------------");
    messages.push({ role: "user", parts: [{ text: result }] });

    const action = JSON.parse(result);

    if (action.type === "output") {
      console.log(action.output);
      break;
    } else if (action.type === "action") {
      const fn = tools[action.function];

      if (!fn) {
        console.log("Function not found");
        break;
      }

      const parameters = action.parameters;
      const observation = await fn(parameters);
      messages.push({
        role: "user",
        parts: [
          {
            text: JSON.stringify({
              type: "observation",
              observation: observation,
            }),
          },
        ],
      });
    }
  }
})();
