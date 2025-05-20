# AI Agent Chat UI (Frontend)

This is a React-based chat interface where users can interact with an AI agent to query mobile bill summaries, view details, make payments, and see billing history. The interface communicates with a Node.js backend gateway, which integrates Ollama + Mistral for intent recognition.

## ✨ Features

- User login with JWT authentication
- Secure access to chat screen
- Realtime messaging using Firebase Realtime Database
- Bill summary, detailed view, payment, and history handling
- Mobile-friendly and responsive layout using Material UI (MUI)
- "Agent is typing..." animated feedback
- Message timestamps and chat clearing
- Local or production API selection using environment variables

## 📁 File Structure

```
src/
├── App.js               # Routing and auth context
├── ChatScreen.js        # Main chat UI
├── LoginScreen.js       # Login form
├── firebase.js          # Firebase configuration
├── index.js             # React root
└── ...
```

## 🔐 Auth and Token Flow

1. User logs in via `LoginScreen.js`.
2. Token is retrieved from the backend `/api/v1/auth/login` endpoint.
3. Token is stored in `localStorage`.
4. All `/chat` requests include the token in the `Authorization` header.

```js
headers: {
  Authorization: localStorage.getItem("token")
}
```


## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm start
```

## 🛠 Tech Stack

- React.js
- Firebase Realtime Database
- Material UI
- Axios
- JWT Authentication

## 🔐 Test User Login

You must have a valid user in the backend system to log in. Use the same credentials as used in the Midterm API project. (Username: admin , Password: 1234)


## 🎥 Presentation Video

[📺 Watch the video here](https://drive.google.com/file/d/1LgFTzhip-IQkafnt3iItlVR-iBcV8Qyk/view?usp=drive_link)

## 🚀 Deployment

This project is deployed on [Render](https://render.com/)  

🔗 **Live URL:** (https://ai-agent-chat.onrender.com)

🔗 **Midterm API Swagger UI:** [`https://se4458-midterm-project.onrender.com/swagger-ui.html`](https://se4458-midterm-project.onrender.com/swagger-ui.html)
