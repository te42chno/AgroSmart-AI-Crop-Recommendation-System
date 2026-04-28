import { GoogleGenAI, Type } from "@google/genai";
import type { LanguageCode } from "../i18n";

// Initialize the Gemini API using Vite env variable (browser-safe)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const genAI = new GoogleGenAI({ apiKey: apiKey || "" });

export interface FarmerInput {
  season: 'Summer' | 'Winter' | 'Monsoon';
  soilType: 'Sandy' | 'Clay' | 'Loamy' | 'Black Soil';
  rainfallLevel: 'Low' | 'Medium' | 'High';
  temperatureCondition: 'Cold' | 'Moderate' | 'Hot';
}

export interface RecommendationResult {
  crop: string;
  confidence: number;
  description: string;
  suitability_factors?: string[];
}

export interface PredictionResponse {
  recommendations: RecommendationResult[];
  status: string;
}

// Mapping logic as requested
const mapFarmerInputToNumerical = (input: FarmerInput) => {
  let temperature = 25;
  let humidity = 65;
  let rainfall = 120;
  let n = 80, p = 50, k = 50;

  // Season -> Temperature
  if (input.season === 'Summer') temperature = 32;
  else if (input.season === 'Winter') temperature = 18;
  else if (input.season === 'Monsoon') temperature = 25;

  // Rainfall Level -> Rainfall
  if (input.rainfallLevel === 'Low') rainfall = 50;
  else if (input.rainfallLevel === 'Medium') rainfall = 120;
  else if (input.rainfallLevel === 'High') rainfall = 200;

  // Soil Type -> N, P, K
  if (input.soilType === 'Sandy') { n = 50; p = 30; k = 30; }
  else if (input.soilType === 'Clay') { n = 70; p = 40; k = 40; }
  else if (input.soilType === 'Loamy') { n = 80; p = 50; k = 50; }
  else if (input.soilType === 'Black Soil') { n = 90; p = 60; k = 60; }

  // Temperature Condition -> Humidity
  if (input.temperatureCondition === 'Cold') humidity = 40;
  else if (input.temperatureCondition === 'Moderate') humidity = 65;
  else if (input.temperatureCondition === 'Hot') humidity = 80;

  return { n, p, k, temperature, humidity, ph: 6.5, rainfall };
};

const languageNames: Record<LanguageCode, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
};

export const getCropRecommendation = async (
  input: FarmerInput,
  language: LanguageCode,
): Promise<PredictionResponse> => {
  const numericalData = mapFarmerInputToNumerical(input);
  const languageName = languageNames[language] ?? languageNames.en;
  
  const prompt = `Recommend the TOP 3 most suitable crops for the following parameters (derived from farmer inputs).
  All natural language text in your response (crop names if possible, description, suitability_factors and status) must be written in ${languageName}.

  Nitrogen: ${numericalData.n}
  Phosphorus: ${numericalData.p}
  Potassium: ${numericalData.k}
  Temperature: ${numericalData.temperature}°C
  Humidity: ${numericalData.humidity}%
  pH: ${numericalData.ph}
  Rainfall: ${numericalData.rainfall}mm
  
  Farmer Selections:
  Season: ${input.season}
  Soil Type: ${input.soilType}
  Rainfall Level: ${input.rainfallLevel}
  Temperature Condition: ${input.temperatureCondition}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `You are a highly accurate Agricultural Machine Learning Model specialized in crop recommendation. 
        Your logic is based on a Random Forest Classifier.

        Your task is to analyze the parameters and recommend the TOP 3 most suitable crops.
        Provide the response in JSON format only, matching exactly the provided JSON schema.

        Very important:
        - The user interface language is ${languageName} (${language}).
        - Write every human‑readable text field (crop, description, suitability_factors, status) in ${languageName}.
        - Do NOT add any explanations outside the JSON.

        Example crops: Rice, Wheat, Maize, Cotton, Sugarcane, Barley, Millet, Soybean, Pea, Groundnut, Sunflower, Tomato, Potato, Onion, Cabbage, Chickpea, Coffee, Tea, Banana, Mango.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  crop: { type: Type.STRING, description: "The name of the recommended crop" },
                  confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
                  description: { type: Type.STRING, description: "A brief explanation of why this crop is suitable" },
                  suitability_factors: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Key factors that make this crop suitable for these conditions"
                  }
                },
                required: ["crop", "confidence", "description"]
              }
            },
            status: { type: Type.STRING }
          },
          required: ["recommendations", "status"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Empty response from AI");
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error fetching crop recommendation:", error);
    throw new Error("Failed to get recommendation. Please check your inputs and try again.");
  }
};
