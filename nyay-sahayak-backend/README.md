Nyay Sahayak - Backend
This is the secure backend server for the Nyay Sahayak application. It acts as a proxy between the React frontend and the Google Gemini API, protecting the API key and handling AI logic.

Features
Securely manages the Gemini API key.

Receives prompts from the frontend.

Constructs detailed, structured prompts for the Gemini API.

Forwards responses back to the frontend.

Setup and Installation
1. Prerequisites
Node.js (v16 or later)

npm (comes with Node.js)

2. Install Dependencies
Navigate to the nyay-sahayak-backend directory in your terminal and run:

npm install

This will install all the necessary packages listed in package.json.

3. Create Environment File
Create a file named .env in the root of the backend directory. This file will hold your secret API key. Add your key to it like this:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

Important: The .env file should be added to your .gitignore to prevent it from being committed to version control.

Running the Server
To run the server in development mode with automatic restarts on file changes, use nodemon:

nodemon server.js

If you don't have nodemon installed globally, you can run it via npx: npx nodemon server.js.

The server will start and listen on http://localhost:5001.