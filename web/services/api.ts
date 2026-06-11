import { AnalysisResponse, IntakeContext } from '../types';

export const uploadDocument = async (files: File[], context?: IntakeContext): Promise<AnalysisResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  // Append intake context as JSON string if provided
  if (context) {
    formData.append('context', JSON.stringify(context));
  }

  // TIKUN: Increased timeout to 300s for Deep Reasoning
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);

  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/api/analyze/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error ${response.status}: ${errorText}`);
    }

    const rawText = await response.text();
    console.log("RAW BACKEND RESPONSE:", rawText);

    try {
        const data = JSON.parse(rawText);
        console.log("PARSED DATA:", data);
        return data as AnalysisResponse;
    } catch (e) {
        console.error("JSON PARSE ERROR:", e);
        throw new Error("Backend returned invalid JSON");
    }

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("CRITICAL FAILURE (Backend Link):", error);
    // TIKUN: No more lies. Throw the real error.
    throw error; 
  }
};