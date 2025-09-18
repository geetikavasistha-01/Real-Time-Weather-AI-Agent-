# Real-Time Weather AI Agent

An AI-powered chat assistant that integrates the Perplexity API for conversational intelligence and the MetaWeather API for fetching real-time weather updates.

---

## Features

- Uses Perplexity's `sonar-pro` model for AI planning and chat interaction
- Fetches real-time weather data from MetaWeather (no API key needed)
- Implements action-observation loop for dynamic weather queries by city
- Demonstrates integration of external APIs with AI-based decision making

---

## Getting Started

### Prerequisites

- Node.js (version 14 or above recommended)
- npm (Node package manager)

### Installation

1. Clone the repository:

git clone https://github.com/yourusername/Real-Time-Weather-AI-Agent.git
cd Real-Time-Weather-AI-Agent

2. Install dependencies:

npm install

3. Create a `.env` file in the project root with the following content:

PERPLEXITY_API_KEY=your_actual_perplexity_api_key_here

### Usage

Run the agent with:


The agent will process the user prompt and fetch real-time weather data for specified cities.

---

## Project Structure

- `index.js` — Main application code integrating AI chat and weather API
- `.env` — Environment variables file (not included in source control)

---

## Notes

- Make sure your `.env` file is included in `.gitignore` to keep your API keys secure.
- This project demonstrates basic prompt engineering and external tool integration; consider improvements for robust production use.

---

## License

This project is licensed under the MIT License.

---


