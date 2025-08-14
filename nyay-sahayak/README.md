Nyay Sahayak - Frontend
This is the user interface for the Nyay Sahayak application, built with React and styled with Tailwind CSS. It provides a comprehensive, user-friendly platform for interacting with the AI legal assistant.

Features
Home Screen: A welcoming landing page with clear navigation.

Legal Q&A: An interactive chat interface for asking legal questions.

Know Your Rights Guides: Proactive, scenario-based legal guides.

Document Explainer: A tool to simplify complex legal clauses.

Application Drafter: A feature to generate drafts of formal letters and applications.

Chat History: Saves past conversations using localStorage.

Shareable Responses: Easily copy and share AI-generated answers.

Setup and Installation
1. Prerequisites
Node.js (v16 or later)

npm (comes with Node.js)

The backend server must be running for the frontend to make API calls.

2. Create the React Project
Navigate to your desired workspace directory in your terminal and run the following command to create the application. This will set up the project structure and install React for you.

npx create-react-app nyay-sahayak

Once it's finished, move into the newly created project folder:

cd nyay-sahayak

3. Install Dependencies
Now, run the following command to install all other necessary packages listed in package.json.

npm install

4. Configure Tailwind CSS
This project uses Tailwind CSS for styling. Set it up with the following commands:

npm install -D tailwindcss
npx tailwindcss init

Next, configure your tailwind.config.js file by replacing its content with this:

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

Finally, open src/index.css, delete all its content, and add the following lines:

@tailwind base;
@tailwind components;
@tailwind utilities;

Running the Application
To start the frontend development server, run:

npm start

The application will automatically open in your default web browser at http://localhost:3000.