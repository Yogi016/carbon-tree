
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available as an environment variable
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have better error handling or fallback.
  // For this context, we'll proceed, but API calls will fail.
  console.error("Gemini API key not found in process.env.API_KEY");
}

const ai = new GoogleGenAI({ apiKey: API_KEY as string });

export const getTreeFacts = async (speciesName: string, scientificName: string): Promise<string> => {
  const model = "gemini-2.5-flash-preview-04-17";
  const prompt = `Berikan ringkasan singkat dan menarik tentang pohon ${speciesName} (${scientificName}) dalam bahasa Indonesia. Sertakan:
1.  Deskripsi singkat pohonnya.
2.  Manfaat ekologis atau kegunaan umumnya.
3.  Satu fakta unik atau menarik.
Format jawaban sebagai paragraf yang mengalir, bukan dalam bentuk daftar. Buat agar mudah dibaca oleh audiens umum.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching tree facts from Gemini:", error);
    return "Maaf, terjadi kesalahan saat mengambil fakta menarik tentang pohon ini. Silakan coba lagi nanti.";
  }
};
