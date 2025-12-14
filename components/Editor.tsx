import React from 'react';
import { Theme } from '../types';
import ThemeSelector from './ThemeSelector';
import { LayoutTemplate, AlignLeft, Palette } from 'lucide-react';
import { OVERLAY_DEFAULTS } from '../constants';

interface EditorProps {
  title: string;
  setTitle: (val: string) => void;
  text: string;
  setText: (val: string) => void;
  onDownload: () => void;
  isExporting: boolean;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  backgroundImage: string | null;
  overlayOpacity: number;
  onOverlayChange: (val: number) => void;
  onBackgroundUpload: (file: File) => void;
  onResetBackground: () => void;
  backgroundError: string | null;
}

const Editor: React.FC<EditorProps> = ({
  title,
  setTitle,
  text,
  setText,
  onDownload,
  isExporting,
  currentTheme,
  onThemeChange,
  backgroundImage,
  overlayOpacity,
  onOverlayChange,
  onBackgroundUpload,
  onResetBackground,
  backgroundError
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onBackgroundUpload(file);
    }
    // Reset input to allow re-upload same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full md:w-[400px] bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col shadow-xl z-20">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-red-600 text-white p-1 rounded">RB</span> Generator
        </h2>
        <p className="text-gray-500 text-sm mt-1">Create viral Red Book cards instantly.</p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Theme Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Palette size={16} />
            Color Theme
          </label>
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <LayoutTemplate size={16} />
            Cover Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your main headline..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Content Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <AlignLeft size={16} />
            Main Content
          </label>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your long text here. The AI logic will automatically split it into multiple cards..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all h-[400px] resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
              {text.length} chars
            </div>
          </div>
          <p className="text-xs text-gray-400">
            * Content automatically paginated at ~120 characters per card.
          </p>
        </div>

        {/* Background Controls */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Palette size={16} />
            Background
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg shadow hover:bg-gray-900 transition-colors"
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={onResetBackground}
              className="px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
          {backgroundError && (
            <p className="text-xs text-red-600">{backgroundError}</p>
          )}
          {backgroundImage && (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 bg-gray-100">
                <img src={backgroundImage} alt="Background preview" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-gray-500">Preview</span>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Overlay</span>
              <span>{Math.round(overlayOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={OVERLAY_DEFAULTS.min}
              max={OVERLAY_DEFAULTS.max}
              step={OVERLAY_DEFAULTS.step}
              value={overlayOpacity}
              onChange={(e) => onOverlayChange(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-gray-400">调整遮罩深浅，默认约 40%。</p>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onDownload}
          disabled={isExporting}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2
            ${isExporting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white ring-4 ring-red-100'
            }`}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Download All Images'
          )}
        </button>
      </div>
    </div>
  );
};

export default Editor;
