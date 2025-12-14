import React, { useState, useEffect, useMemo } from 'react';
import Editor from './components/Editor';
import Card from './components/Card';
import { CardConfig, CardType, Theme, DEFAULT_THEME_ID } from './types';
import { paginateText } from './utils/textUtils';
import { generateAndDownloadZip } from './utils/downloadUtils';
import { getThemeById, generateCustomTheme } from './utils/themeUtils';
import { Image } from 'lucide-react';
import { DEFAULT_SAFE_HEIGHT, CARD_DIMENSIONS, TYPOGRAPHY } from './constants';

// Hook for debouncing value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Default content for demo purposes
const DEFAULT_TITLE = "Role Settings: Full Stack & UI Designer";
const DEFAULT_TEXT = `**Role Definition**:
You are a full-stack engineer and senior UI designer, specializing in dynamic content layout.

**Task Goal**:
Create an HTML+CSS+JS single-page application that automatically converts long text into multiple "XiaoHongShu" (Red Book) style image cards.

**Core Pain Point Solved (Long Text Handling)**:
- **Auto-Pagination Logic**: Write a JavaScript function to avoid cramming text into one card. Limit single cards to ~120 chars.
- If content exceeds limits, automatically generate Card 2, Card 3...
- **Page Markers**: Add '01/04' style markers to the bottom right.`;

const App: React.FC = () => {
  // Theme State Initialization
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlThemeId = params.get('theme');

    if (urlThemeId === 'custom') {
      const c1 = params.get('c1');
      const c2 = params.get('c2');
      const angle = parseInt(params.get('angle') || '135', 10);
      if (c1 && c2 && !isNaN(angle)) {
        return generateCustomTheme(c1, c2, angle);
      }
    } else if (urlThemeId) {
      const preset = getThemeById(urlThemeId);
      if (preset.id !== DEFAULT_THEME_ID || urlThemeId === DEFAULT_THEME_ID) {
        return preset;
      }
    }

    try {
      const stored = localStorage.getItem('rb-generator-theme-v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id === 'custom' && parsed.customConfig) {
          return generateCustomTheme(parsed.customConfig.c1, parsed.customConfig.c2, parsed.customConfig.angle);
        }
        return getThemeById(parsed.id);
      }
    } catch (e) {
      console.warn("Failed to parse stored theme", e);
    }

    return getThemeById(DEFAULT_THEME_ID);
  });

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [isExporting, setIsExporting] = useState(false);

  // Dynamic Measurement State
  const [safeHeight, setSafeHeight] = useState<number>(DEFAULT_SAFE_HEIGHT);
  const contentMeasureRef = React.useRef<HTMLDivElement>(null);
  const debouncedText = useDebounce(text, 300);

  // Persistence Effect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (currentTheme.id === 'custom' && currentTheme.customConfig) {
      params.set('theme', 'custom');
      params.set('c1', currentTheme.customConfig.c1);
      params.set('c2', currentTheme.customConfig.c2);
      params.set('angle', currentTheme.customConfig.angle.toString());
    } else if (currentTheme.id !== DEFAULT_THEME_ID) {
      params.set('theme', currentTheme.id);
      params.delete('c1');
      params.delete('c2');
      params.delete('angle');
    } else {
      params.delete('theme');
      params.delete('c1');
      params.delete('c2');
      params.delete('angle');
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);

    localStorage.setItem('rb-generator-theme-v2', JSON.stringify({
      id: currentTheme.id,
      customConfig: currentTheme.customConfig
    }));
  }, [currentTheme]);

  // Layout Measurement Effect
  useEffect(() => {
    const measureLayout = async () => {
      await document.fonts.ready;
      if (contentMeasureRef.current) {
        const measuredHeight = contentMeasureRef.current.clientHeight;
        if (measuredHeight > 0) {
          setSafeHeight(measuredHeight);
        } else {
          setSafeHeight(DEFAULT_SAFE_HEIGHT);
        }
      }
    };

    measureLayout();
    window.addEventListener('resize', measureLayout);
    return () => window.removeEventListener('resize', measureLayout);
  }, []);

  // Memoize the card generation logic to prevent flicker
  const cards: CardConfig[] = useMemo(() => {
    const generatedCards: CardConfig[] = [];

    // 1. Add Cover Card
    generatedCards.push({
      id: 'cover',
      type: CardType.COVER,
      title: title || 'UNTITLED',
    });

    // 2. Process Content
    // Use debounced text and dynamic height
    // Returns { content: string, fontSize: number }[]
    const pages = paginateText(debouncedText, safeHeight);

    pages.forEach((pageData, index) => {
      generatedCards.push({
        id: `page-${index}`,
        type: CardType.CONTENT,
        content: pageData, // Now an object
        pageNumber: index + 1,
        totalPages: pages.length
      });
    });

    return generatedCards;
  }, [title, debouncedText, safeHeight]);

  const handleDownload = async () => {
    setIsExporting(true);
    // Slight delay to allow UI to update state
    setTimeout(async () => {
      try {
        await generateAndDownloadZip('cards-container', `RedBook_Export_${Date.now()}`);
      } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to export images. Please try again.");
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 relative">

      {/* 
        Hidden Skeleton Card for Measurement 
        Absolute position, hidden visibility, same structure as real Card 
      */}
      <div
        id="layout-reference"
        className="absolute top-0 left-0 -z-50 invisible pointer-events-none"
        style={{
          width: `${CARD_DIMENSIONS.width}px`,
          height: `${CARD_DIMENSIONS.height}px`,
          padding: `${CARD_DIMENSIONS.padding}px`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8 border-b pb-4 opacity-80" style={{ borderColor: 'transparent' }}>
          <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-60">THE RED BOOK</span>
          <div className="w-2 h-2 rounded-full"></div>
        </div>

        {/* Content Area to Measure */}
        <div ref={contentMeasureRef} className="flex-1"></div>

        {/* Footer Skeleton */}
        <div className="mt-auto pt-6 flex justify-end items-end">
          <div className="flex items-baseline font-mono opacity-80">
            <span className="text-4xl font-bold">00</span>
            <span className="text-xl mx-1">/</span>
            <span className="text-xl">00</span>
          </div>
        </div>
      </div>

      {/* Left Sidebar: Editor */}
      <Editor
        title={title}
        setTitle={setTitle}
        text={text}
        setText={setText}
        onDownload={handleDownload}
        isExporting={isExporting}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />

      {/* Right Area: Preview */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-[#e6e6e6] relative">
        <div className="p-8 min-h-full">

          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-3 mb-6 text-gray-500">
              <Image className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Live Preview ({cards.length} cards)</span>
            </div>

            {/*
              Cards Container
              We use flex-wrap to show them nicely on screen.
              The id 'cards-container' is targeted by html2canvas.
            */}
            <div
              id="cards-container"
              className="flex flex-wrap gap-8 items-start justify-center pb-20"
            >
              {cards.map((config) => (
                <div key={config.id} className="transform transition-transform hover:scale-[1.02] duration-300">
                  <Card config={config} theme={currentTheme} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;