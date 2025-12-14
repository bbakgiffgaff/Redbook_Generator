import React, { useState, useEffect } from 'react';
import { Theme, THEMES } from '../types';
import { Check, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { generateCustomTheme } from '../utils/themeUtils';

interface ThemeSelectorProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
    const [isCustomExpanded, setIsCustomExpanded] = useState(false);

    // Custom theme local state
    const [c1, setC1] = useState('ff0000');
    const [c2, setC2] = useState('0000ff');
    const [angle, setAngle] = useState(135);

    // Initialize custom state from current theme if it is custom
    useEffect(() => {
        if (currentTheme.id === 'custom' && currentTheme.customConfig) {
            setIsCustomExpanded(true);
            setC1(currentTheme.customConfig.c1);
            setC2(currentTheme.customConfig.c2);
            setAngle(currentTheme.customConfig.angle);
        }
    }, [currentTheme]);

    const handleCustomChange = (newC1: string, newC2: string, newAngle: number) => {
        // Strip # if present (though color input returns hex with # usually)
        const cleanC1 = newC1.replace('#', '');
        const cleanC2 = newC2.replace('#', '');

        setC1(cleanC1);
        setC2(cleanC2);
        setAngle(newAngle);

        const newTheme = generateCustomTheme(cleanC1, cleanC2, newAngle);
        onThemeChange(newTheme);
    };

    return (
        <div className="space-y-3">
            {/* Preset Grid */}
            <div className="grid grid-cols-5 gap-2">
                {THEMES.map((theme) => {
                    const isSelected = currentTheme.id === theme.id;
                    return (
                        <button
                            key={theme.id}
                            onClick={() => {
                                setIsCustomExpanded(false);
                                onThemeChange(theme);
                            }}
                            aria-label={`Select ${theme.label} theme`}
                            className={`
                relative w-full aspect-square rounded-full transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                ${isSelected ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-105'}
              `}
                            style={{ background: theme.gradient }}
                        >
                            {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                            )}
                            <span className="sr-only">{theme.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Custom Theme Toggle */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                    onClick={() => setIsCustomExpanded(!isCustomExpanded)}
                    className={`
            w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700
            hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400
            ${currentTheme.id === 'custom' ? 'bg-red-50 text-red-700' : ''}
          `}
                    aria-expanded={isCustomExpanded}
                    aria-controls="custom-theme-panel"
                >
                    <div className="flex items-center gap-2">
                        <Sliders size={16} />
                        <span>Custom Theme</span>
                    </div>
                    {isCustomExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Custom Panel */}
                {isCustomExpanded && (
                    <div id="custom-theme-panel" className="p-4 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                                <label htmlFor="color-1" className="block text-xs text-gray-500 font-medium">Start Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="color-1"
                                        type="color"
                                        value={`#${c1}`}
                                        onChange={(e) => handleCustomChange(e.target.value, `#${c2}`, angle)}
                                        className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <label htmlFor="color-2" className="block text-xs text-gray-500 font-medium">End Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="color-2"
                                        type="color"
                                        value={`#${c2}`}
                                        onChange={(e) => handleCustomChange(`#${c1}`, e.target.value, angle)}
                                        className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <label htmlFor="angle-slider" className="block text-xs text-gray-500 font-medium">Gradient Angle</label>
                                <span className="text-xs text-gray-400">{angle}°</span>
                            </div>
                            <input
                                id="angle-slider"
                                type="range"
                                min="0"
                                max="360"
                                value={angle}
                                onChange={(e) => handleCustomChange(`#${c1}`, `#${c2}`, parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                            />
                        </div>

                        <div className="pt-2">
                            <div
                                className="w-full h-12 rounded-lg shadow-inner flex items-center justify-center text-sm font-bold text-white/90"
                                style={{ background: `linear-gradient(${angle}deg, #${c1} 0%, #${c2} 100%)` }}
                            >
                                PREVIEW
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThemeSelector;
