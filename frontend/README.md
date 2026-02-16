# Wizard Frontend

A conversational React frontend for the Wizard web navigation assistant.

## Features

- 🎨 Modern, exciting UI with gradient backgrounds and smooth animations
- 💬 Conversational chat interface
- ⚡ Real-time typing indicators
- 📱 Responsive design
- 🎯 Clean message formatting for step-by-step guides

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and proxy API requests to `http://localhost:8000`.

## Environment Variables

Create a `.env` file in the frontend directory to customize the API URL:

```
VITE_API_URL=http://localhost:8000
```

## Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.
