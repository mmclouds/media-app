import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import { generateVideo } from './services/geminiService';

const App: React.FC = () => {
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    const checkApiKey = async () => {
      // Cast to any to avoid type declaration conflict with global AIStudio type
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setApiKeyMissing(true);
        }
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
        await aistudio.openSelectKey();
        setApiKeyMissing(false);
    }
  };

  const handleGenerate = async (prompt: string) => {
    if (apiKeyMissing) {
        await handleSelectKey();
        // Don't proceed immediately, let user click again to confirm context
        return;
    }

    setIsGenerating(true);
    setGeneratedVideo(null);

    try {
        // We use the environment variable which is injected by the platform after selection
        // In a real localized env, this would need manual entry, but per instructions we use process.env.API_KEY
        // after the window.aistudio selection flow
        const apiKey = process.env.API_KEY || '';
        
        if (!apiKey) {
            console.warn("API Key might be missing even after selection flow.");
        }

        const videoUrl = await generateVideo(prompt, apiKey);
        if (videoUrl) {
            setGeneratedVideo(videoUrl);
        }
    } catch (error) {
        console.error("Failed to generate video", error);
        alert("Failed to generate video. Please check your API key quota (Veo requires a paid project).");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-[#66ff66] selection:text-black">
      {/* Required API Key Modal Overlay if missing */}
      {apiKeyMissing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] max-w-md text-center shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-white">Veo Access Required</h2>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                To use the video generation features (Veo Model), you must select a Google Cloud Project with billing enabled.
              </p>
              <div className="flex flex-col gap-3">
                 <button 
                    onClick={handleSelectKey}
                    className="w-full bg-[#66ff66] hover:bg-[#52cc52] text-black font-bold py-3 rounded-xl transition-all"
                 >
                    Select API Key
                 </button>
                 <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-300 underline"
                 >
                    Read Billing Documentation
                 </a>
              </div>
           </div>
        </div>
      )}

      <Sidebar />
      <EditorPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
      <PreviewPanel generatedVideo={generatedVideo} loading={isGenerating} />
    </div>
  );
};

export default App;