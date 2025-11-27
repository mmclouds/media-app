'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Shirt, 
  Headphones, 
  Clock, 
  MoreHorizontal 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-[72px] h-screen bg-[#0f0f0f] border-r border-[#1f1f1f] flex flex-col items-center py-4 justify-between flex-shrink-0 z-20 relative">
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Logo Area */}
        <div className="w-10 h-10 flex items-center justify-center text-white mb-2">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-6 w-full items-center">
            <SidebarItem icon={<Home size={22} />} active={false} />
            <SidebarItem icon={<ImageIcon size={22} />} active={false} />
            <SidebarItem icon={<Video size={22} />} active={true} />
            <SidebarItem icon={<Music size={22} />} active={false} />
            <SidebarItem icon={<Shirt size={22} />} active={false} />
            <SidebarItem icon={<Headphones size={22} />} active={false} />
            <SidebarItem icon={<Clock size={22} />} active={false} />
        </nav>
      </div>

      <div className="flex flex-col items-center gap-6 w-full pb-4">
        <button className="text-xs font-medium border border-[#333] px-2 py-1 rounded text-[#888] hover:text-white hover:border-white transition-colors">
          Sign In
        </button>

        <div className="relative group cursor-pointer">
           <div className="bg-[#ccff00] text-black text-[10px] font-bold px-1 py-0.5 rounded absolute -top-3 -right-3 transform rotate-12 shadow-lg">
             SALE
           </div>
           <div className="bg-black border border-[#ccff00] text-[#ccff00] text-[9px] font-bold px-1.5 py-0.5 rounded mt-1">
             50% off
           </div>
        </div>

        <button className="text-[#666] hover:text-white">
          <MoreHorizontal size={24} />
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, active }: { icon: React.ReactNode; active: boolean }) => (
  <button className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${active ? 'bg-[#2a2a2a] text-white' : 'text-[#666] hover:text-white hover:bg-[#1a1a1a]'}`}>
    {icon}
  </button>
);

export default Sidebar;