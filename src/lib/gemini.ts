import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface BiodiversityInfo {
  id?: string;
  name: string;
  scientificName: string;
  family: string;
  conservationStatus: "Least Concern" | "Near Threatened" | "Vulnerable" | "Endangered" | "Critically Endangered" | "Extinct" | "Unknown";
  ecologicalRole: string;
  protectionTips: string[];
}

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING },
    scientificName: { type: SchemaType.STRING },
    family: { type: SchemaType.STRING },
    conservationStatus: { type: SchemaType.STRING },
    ecologicalRole: { type: SchemaType.STRING },
    protectionTips: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    }
  },
  required: ["name", "scientificName", "family", "conservationStatus", "ecologicalRole", "protectionTips"]
};

export async function analyzeImage(file: File, apiKey: string): Promise<BiodiversityInfo> {
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using the cutting-edge 2026 preview model: gemini-3-flash
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  const imageData = await fileToGenerativePart(file);

  const prompt = `Analyze this image and identify the biodiversity element (plant, animal, insect, or fungus). 
  Provide accurate scientific details. If multiple species are visible, focus on the most prominent one.
  Return the information strictly in the requested JSON format.
  Language: English.`;

  const result = await model.generateContent([prompt, imageData]);
  const response = await result.response;
  return JSON.parse(response.text()) as BiodiversityInfo;
}

async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
