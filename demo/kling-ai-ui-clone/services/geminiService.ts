import { GoogleGenAI } from "@google/genai";

export const generateVideo = async (prompt: string, apiKey: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey });

    // Using Veo fast model as per instructions for general video generation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9' 
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (videoUri) {
        // Append API key to fetch the content
        return `${videoUri}&key=${apiKey}`;
    }
    return null;

  } catch (error) {
    console.error("Video generation failed:", error);
    throw error;
  }
};
