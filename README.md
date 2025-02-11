# Clockify AI Time Entry Assistant  

This project is an AI-powered assistant that helps users create time entries in **Clockify** using **Google Gemini API**.  
The assistant follows a structured approach with **PLAN, ACTION, OBSERVATION, and OUTPUT** states to interact with users and automate time entry creation.

---

## 🚀 Features  
- 🕒 **Automated Time Entry** in Clockify  
- 🤖 Uses **Google Gemini AI** for processing  
- ✅ **Structured AI Responses** with JSON format  
- 🛠️ **Supports Tool Usage** for executing actions  

---

## 📌 Prerequisites  
Ensure you have the following installed:  
- **Node.js** (v16 or later)  
- **Clockify API Key**  
- **Google Gemini API Key**  

---

## ⚙️ Installation  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/Padamaniabhay/clockify-AI-agent.git
cd clockify-ai-agent
```

### 2️⃣ Install Dependencies  
```sh
npm install
```

### 3️⃣ Set Up Environment Variables  
Create a `.env` file and add the following:  

```env
CLOCKIFY_API_KEY=
WORKSPACE_ID=
PROJECT_ID=
TASK_ID=
TAG_IDS=
GEMINI_API_KEY=
```

---

## 🏃‍♂️ Usage  

Run the assistant using:  
```sh
node index.js
```

Then, interact with the AI by entering requests such as:  
```
>> Can you add a time entry from 10 FEB 2025, 10:00 AM to 1:00 PM with description as worked on join query building?
```

### ✅ Example Output  

```
--------------------AI start ----------------
{"type": "plan", "plan": "I will add a time entry in Clockify from 10 FEB 2025, 10:00 AM to 10 FEB 2025, 01:00 PM with the description 'worked on join query building'."}
--------------------AI end ----------------

--------------------AI start ----------------
{"type": "action", "function": "addTimeEntry", "parameters": {"start": "2025-02-10T10:00:00Z", "end": "2025-02-10T13:00:00Z", "description": "worked on join query building"}}
--------------------AI end ----------------

--------------------AI start ----------------
{"type": "output", "output": "Your Time entry added Successfully in Clockify with ID: 67aa3beedsfebrfdb11d6df2f1e"}
--------------------AI end ----------------

✅ **Your Time entry added Successfully in Clockify with ID: 67aa3beedsfebrfdb11d6df2f1e**
```

---

## 🛠️ How It Works  
1️⃣ **User Input** → The user provides a time entry request.  
2️⃣ **AI Plans the Action** → The AI generates a plan.  
3️⃣ **AI Executes the Action** → Calls `addTimeEntry()` function.  
4️⃣ **AI Observes the Result** → Captures response from Clockify.  
5️⃣ **Final Output** → AI confirms the time entry creation.  

---

## 🤝 Contributing  
Feel free to submit pull requests or open issues to improve this project!  

---

## 📧 Contact  
For any questions, reach out via:  
📩 **padamaniabhay920@gmail.com**  
📌 [GitHub Issues](https://github.com/Padamaniabhay/clockify-AI-agent/issues)  