import React, { useState, useEffect, useMemo } from 'react';
import Editor from './components/Editor';
import Card from './components/Card';
import { CardConfig, CardType } from './types';
import { paginateText } from './utils/textUtils';
import { generateAndDownloadZip } from './utils/downloadUtils';
import { Image } from 'lucide-react';

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
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [isExporting, setIsExporting] = useState(false);

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
    const pages = paginateText(text, 120);
    
    pages.forEach((pageContent, index) => {
      generatedCards.push({
        id: `page-${index}`,
        type: CardType.CONTENT,
        content: pageContent,
        pageNumber: index + 1,
        totalPages: pages.length
      });
    });

    return generatedCards;
  }, [title, text]);

  const handleDownload = async () => {
    setIsExporting(true);
    // Slight delay to allow UI to update state
    setTimeout(async () => {
      await generateAndDownloadZip('cards-container', `RedBook_Export_${Date.now()}`);
      setIsExporting(false);
    }, 100);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Left Sidebar: Editor */}
      <Editor 
        title={title}
        setTitle={setTitle}
        text={text}
        setText={setText}
        onDownload={handleDownload}
        isExporting={isExporting}
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
                  <Card config={config} />
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