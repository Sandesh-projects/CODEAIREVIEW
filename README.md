# Project Setup Instructions

This guide will help you set up both the backend and frontend for the project.

---

## Directory Structure

```
CODEAIREVIEW
│   .gitignore
│   README.md
│
├───backend
│   │   .env
│   │   package.json
│   │   README.md
│   │   server.js
│   │
│   └───src
│       │   app.js
│       │
│       ├───controllers
│       │       ai.controller.js
│       │
│       ├───routes
│       │       ai.routes.js
│       │
│       └───services
│               ai.service.js
│
└───frontend
    │   .gitignore
    │   eslint.config.js
    │   index.html
    │   package.json
    │   README.md
    │   vite.config.js
    │
    ├───public
    │       vite.svg
    │
    └───src
        │   App.css
        │   App.jsx
        │   index.css
        │   main.jsx
        │
        └───assets
                react.svg
```

---

## Backend Setup

1. **Create a `.env` file** in the `backend` folder.

2. **Add your Gemini API key** to the `.env` file:

   ```
   GOOGLE_GEMINI_KEY=YOUR_GEMINI_API_KEY_HERE
   ```

   Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini key.

3. **Install backend dependencies**:

   ```bash
   npm install
   ```

4. **Start the backend server**:

   ```bash
   nodemon server.js
   ```

---

## Frontend Setup

1. **Navigate to the frontend folder**.

2. **Install frontend dependencies**:

   ```bash
   npm install
   ```

3. **Start the frontend development server**:

   ```bash
   npm run dev
   ```

---

## Notes

- Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- Run backend and frontend servers in separate terminal windows.
- For any issues, check the respective folder's documentation or contact the maintainer.
