import fetch from 'node-fetch';
import 'dotenv/config';
// Load Perplexity API key from environment variables
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  throw new Error('Please set the PERPLEXITY_API_KEY environment variable');
}

// MetaWeather API helper: get WOEID for a city
async function getWoeid(city) {
  const response = await fetch(`https://www.metaweather.com/api/location/search/?query=${encodeURIComponent(city)}`);
  const data = await response.json();
  if (data.length === 0) return null;
  return data[0].woeid;
}

// MetaWeather API helper: get current weather for WOEID
async function getWeatherByWoeid(woeid) {
  const response = await fetch(`https://www.metaweather.com/api/location/${woeid}/`);
  const data = await response.json();
  const today = data.consolidated_weather[0];
  return `${today.the_temp.toFixed(1)}°C, ${today.weather_state_name}`;
}

// Function to get weather details by city (uses MetaWeather API)
async function getWeatherDetails(city = '') {
  const woeid = await getWoeid(city);
  if (!woeid) return 'City not found';

  try {
    return await getWeatherByWoeid(woeid);
  } catch {
    return `Error fetching weather for ${city}`;
  }
}

// Your system prompt describing tools and expected flow
const SYSTEM_PROMPT = `
You are an AI Assistant with PLAN, ACTION, OBSERVATION, and OUTPUT states.
Wait for the user prompt and PLAN your actions.
Call the tool getWeatherDetails(city) when needed.
Return observations and then the final OUTPUT.

Example flow:
USER: What is the weather in London and Paris?
PLAN: I will call getWeatherDetails for London.
ACTION: getWeatherDetails("London")
OBSERVATION: 15°C, Clear
PLAN: I will call getWeatherDetails for Paris.
ACTION: getWeatherDetails("Paris")
OBSERVATION: 17°C, Rainy
OUTPUT: The weather in London is 15°C and Clear, and in Paris is 17°C and Rainy.
`;

async function chat(userInput) {
  // Call Perplexity API chat completions to get AI plan and next steps
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userInput }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${error}`);
  }

  const data = await response.json();
  const aiMessage = data.choices?.[0]?.message?.content;
  if (!aiMessage) throw new Error('No message content from Perplexity API');

  console.log('AI Plan:', aiMessage);

  // Extract city names from AI plan by simple regex (for demo)
  // Assumes AI calls getWeatherDetails("City") in ACTION lines
  const regex = /getWeatherDetails\(["']([^"']+)["']\)/gi;
  const cities = [];
  let match;
  while ((match = regex.exec(aiMessage)) !== null) {
    cities.push(match[1]);
  }

  // For each city, fetch real weather details
  const observations = {};
  for (const city of cities) {
    observations[city] = await getWeatherDetails(city);
  }

  // Construct final output text based on observations
  let output = 'Weather updates:\n';
  for (const [city, weather] of Object.entries(observations)) {
    output += `${city}: ${weather}\n`;
  }

  console.log(output);
  return output;
}

// Example usage:
(async () => {
  try {
    const user = 'What is the weather in London and Paris?';
    await chat(user);
  } catch (e) {
    console.error(e);
  }
})();
