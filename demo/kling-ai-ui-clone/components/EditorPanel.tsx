'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  Upload, 
  RefreshCw, 
  Image as ImageIcon,
  Film,
  Loader2
} from 'lucide-react';
import { TabState, SubTabState } from '../types';

interface EditorPanelProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ onGenerate, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<TabState>(TabState.MULTI_ELEMENTS);
  const [activeSubTab, setActiveSubTab] = useState<SubTabState>(SubTabState.SWAP);
  const [prompt, setPrompt] = useState("swap [x] from [@Image] for [x] from [@Video]");
  
  return (
    <div className="flex flex-col h-full w-[440px] border-r border-[#1f1f1f] bg-[#000] flex-shrink-0">
      
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-[#1f1f1f]">
        <h1 className="text-lg font-medium text-white">AI Video Generator</h1>
        <button className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-md text-xs text-gray-300 hover:bg-[#252525]">
          VIDEO 1.6
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-6 pb-2 border-b border-transparent">
        <div className="flex gap-6 text-sm font-medium">
          {Object.values(TabState).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        
        {/* Sub Tabs (Pills) */}
        {activeTab === TabState.MULTI_ELEMENTS && (
          <div className="bg-[#1a1a1a] p-1 rounded-lg flex mb-6">
            {Object.values(SubTabState).map((subTab) => (
              <button
                key={subTab}
                onClick={() => setActiveSubTab(subTab)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                  activeSubTab === subTab 
                    ? 'bg-[#333] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* Upload Video Section */}
        <div className="mb-4">
          <div className="border border-[#2a2a2a] bg-[#0a0a0a] rounded-xl p-4 relative group hover:border-[#3a3a3a] transition-colors cursor-pointer h-[160px] flex flex-col justify-center">
             <div className="absolute top-4 left-4 z-10">
                <h3 className="text-sm font-medium text-gray-200">Upload Video to Edit</h3>
                <div className="flex items-center gap-2 mt-1">
                   <p className="text-[10px] text-gray-500">Select from</p>
                   <span className="text-[10px] text-gray-300 hover:underline">History</span>
                </div>
             </div>
             
             <div className="absolute bottom-4 left-4 max-w-[180px] z-10">
                 <p className="text-[10px] text-gray-500 leading-tight">
                    Supports MP4/MOV files, 100MB max file size 10s max duration, 720P/1080P in resolution
                 </p>
             </div>

             {/* Placeholder Image Logic */}
             <div className="absolute right-2 top-2 bottom-2 w-[140px] bg-[#151515] rounded-lg overflow-hidden border border-[#222]">
                <img 
                  src="https://picsum.photos/300/400?grayscale" 
                  alt="placeholder" 
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center">
                        <Film size={14} className="text-gray-400" />
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Upload Image Section */}
        <div className="mb-6">
          <div className="border border-[#2a2a2a] bg-[#0a0a0a] rounded-xl p-4 relative group hover:border-[#3a3a3a] transition-colors cursor-pointer h-[100px] flex items-center justify-between">
             <div className="z-10">
                <h3 className="text-sm font-medium text-gray-200">Upload Image</h3>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                   <p className="text-[10px] text-gray-500">from</p>
                   <span className="text-[10px] text-gray-300 hover:underline">History</span>
                   <p className="text-[10px] text-gray-500">or</p>
                   <span className="text-[10px] text-gray-300 hover:underline">Stock Library</span>
                   <span className="text-[10px] text-gray-300 hover:underline ml-1">Select</span>
                </div>
             </div>
             
             {/* Placeholder Image Logic */}
             <div className="w-[100px] h-[70px] bg-[#151515] rounded-lg overflow-hidden border border-[#222] relative">
                <img 
                  src="https://picsum.photos/200/200?blur=2" 
                  alt="placeholder" 
                  className="w-full h-full object-cover opacity-50"
                />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw size={14} className="text-gray-400" />
                </div>
             </div>
          </div>
        </div>

        {/* Prompt Section */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
             <label className="text-sm font-medium text-gray-200">Prompt <span className="text-gray-500 text-xs font-normal">(Required)</span></label>
          </div>
          <div className="relative">
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               className="w-full h-32 bg-[#121212] border border-[#2a2a2a] rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#444] resize-none font-mono leading-relaxed"
             />
          </div>
        </div>

        {/* Settings Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
            <button className="flex items-center justify-between bg-[#121212] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white hover:border-[#444]">
               <div className="flex items-center gap-1">
                 Professional <span className="bg-[#1f2f1f] text-[#4ade80] text-[9px] px-1 rounded font-bold">VIP</span>
               </div>
               <ChevronDown size={12} className="text-gray-500" />
            </button>
            <button className="flex items-center justify-between bg-[#121212] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white hover:border-[#444]">
               5s
               <ChevronDown size={12} className="text-gray-500" />
            </button>
            <button className="flex items-center justify-between bg-[#121212] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white hover:border-[#444]">
               1 Output
               <ChevronDown size={12} className="text-gray-500" />
            </button>
        </div>

        {/* Generate Button */}
        <button 
          onClick={() => onGenerate(prompt)}
          disabled={isGenerating}
          className="w-full bg-[#66ff66] hover:bg-[#52cc52] disabled:bg-[#333] disabled:text-gray-500 text-black font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </button>

      </div>
    </div>
  );
};

export default EditorPanel;