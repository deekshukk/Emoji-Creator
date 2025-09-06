# AI Emoji Creator

A full-stack application that generates custom emojis using AI.

## Project Structure

```
text-to-emoji/
├── frontend/          # React.js frontend application
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Python Flask backend
│   ├── app.py        # Flask application
│   ├── emojis/       # Generated emoji images
│   └── venv/         # Python virtual environment
└── node_modules/     # Frontend dependencies
```

## Getting Started

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Activate the virtual environment: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Set up your Stability AI API key in a `.env` file
5. Run the Flask server: `python app.py`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Features

- Generate custom emojis from text descriptions
- AI-powered emoji creation using Stability AI
- Automatic background removal
- Download generated emojis
- Modern, responsive UI

## Tech Stack

- **Frontend**: React.js, Headless UI, CSS3
- **Backend**: Python, Flask, Stability AI API
- **Image Processing**: PIL, rembg
