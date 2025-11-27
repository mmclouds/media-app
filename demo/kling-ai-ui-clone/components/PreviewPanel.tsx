'use client';

import React from 'react';
import { LayoutGrid, FolderOpen, Play } from 'lucide-react';

interface PreviewPanelProps {
  generatedVideo: string | null;
  loading: boolean;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ generatedVideo, loading }) => {
  return (
    <div className="flex-1 bg-[#000] flex flex-col h-full min-w-0">
      
      {/* Top Bar */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-lg">
           <TabItem label="All" active />
           <TabItem label="Images" />
           <TabItem label="Videos" />
           <TabItem label="Audio" />
        </div>
        
        <div className="flex items-center gap-4">
           <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white">
             <input type="checkbox" className="rounded border-gray-600 bg-[#1a1a1a] text-[#66ff66] focus:ring-0 w-3 h-3" />
             Favorites
           </label>
           
           <button className="flex items-center gap-2 text-xs text-white bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] px-3 py-1.5 rounded-lg">
             <FolderOpen size={14} />
             Assets
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
             <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-[#66ff66] rounded-full animate-spin"></div>
                <p className="text-sm animate-pulse">Creating your masterpiece...</p>
             </div>
        ) : generatedVideo ? (
            <div className="w-full h-full flex items-center justify-center">
                 <div className="max-w-[800px] w-full bg-[#121212] rounded-2xl overflow-hidden border border-[#2a2a2a]">
                    <div className="aspect-video relative bg-black">
                        <video 
                          src={generatedVideo} 
                          controls 
                          autoPlay 
                          loop 
                          className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                       <div>
                         <h3 className="text-white text-sm font-medium">Generated Result</h3>
                         <p className="text-gray-500 text-xs mt-1">1080p • 5s</p>
                       </div>
                       <button className="bg-[#1a1a1a] hover:bg-[#252525] text-white text-xs px-3 py-1.5 rounded-lg border border-[#333]">
                          Download
                       </button>
                    </div>
                 </div>
            </div>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#333] gap-2">
                <LayoutGrid size={48} strokeWidth={1} />
                <p className="text-sm">Generated content will appear here</p>
            </div>
        )}
      </div>
    </div>
  );
};

const TabItem = ({ label, active = false }: { label: string; active?: boolean }) => (
  <button className={`px-4 py-1 rounded-md text-xs font-medium transition-colors ${active ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
    {label}
  </button>
);

export default PreviewPanel;