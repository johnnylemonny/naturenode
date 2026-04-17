import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface BiodiversityInfo {
  id?: string;
  commonName: string;
  scientificName: string;
  family: string;
  genus: string;
  species: string;
  conservationStatus: string;
  ecologicalRole: string;
  habitat: string;
  nativeRange: string;
  protectionTips: string[];
  locationTag?: {
    lat: number;
    lng: number;
    placeName?: string;
  };
}

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    commonName: { type: SchemaType.STRING },
    scientificName: { type: SchemaType.STRING },
    family: { type: SchemaType.STRING },
    genus: { type: SchemaType.STRING },
    species: { type: SchemaType.STRING },
    conservationStatus: { type: SchemaType.STRING },
    ecologicalRole: { type: SchemaType.STRING },
    habitat: { type: SchemaType.STRING },
    nativeRange: { type: SchemaType.STRING },
    protectionTips: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    }
  },
  required: ["commonName", "scientificName", "family", "genus", "species", "conservationStatus", "ecologicalRole", "habitat", "nativeRange", "protectionTips"]
};

export async function analyzeImage(file: File, apiKey: string): Promise<BiodiversityInfo> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  const imageData = await fileToGenerativePart(file);

  const prompt = `Identify the species in this image. 
  Focus on plants, animals, insects, or fungi. 
  Provide accurate scientific and ecological data. 
  If you cannot identify the species, provide the closest possible classification.
  IMPORTANT: Return ONLY the JSON object. No extra text.`;

  try {
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from AI. The image might be unclear or blocked by safety filters.");
    }
    
    return JSON.parse(text) as BiodiversityInfo;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    if (error instanceof Error && error.message.includes("SAFETY")) {
      throw new Error("Analysis blocked by safety filters. Please try another image.");
    }
    throw error;
  }
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
