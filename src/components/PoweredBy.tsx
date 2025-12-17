import React from 'react';
import { Zap } from 'lucide-react';

export const PoweredBy = () => {
    return (
        <div className="w-full py-6 flex items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Powered by</span>
            <div className="flex items-center gap-1">
                <Zap size={12} className="text-pink-500 fill-pink-500" />
                <span className="text-xs font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    UC FIKIR
                </span>
            </div>
        </div>
    );
};
