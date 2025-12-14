import React from 'react';
import { CardConfig, CardType, Theme } from '../types';

interface CardProps {
  config: CardConfig;
  theme: Theme;
}

const Card: React.FC<CardProps> = ({ config, theme }) => {
  return (
    <div
      className="card-node relative flex-shrink-0 overflow-hidden shadow-xl"
      style={{
        width: '600px',
        height: '800px',
        background: theme.gradient,
        color: theme.textColor,
        fontFamily: '"Noto Sans SC", sans-serif',
      }}
    >
      {/* Background Noise/Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Decorative Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none"
        style={{
          transform: 'rotate(-45deg) scale(1.5)',
          color: theme.accentColor
        }}
      >
        <span className="text-[120px] font-black tracking-widest uppercase">
          RED BOOK
        </span>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col p-[60px] z-10 box-border">

        {config.type === CardType.COVER ? (
          // Cover Layout
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div
              className="border-t-4 border-b-4 py-8 mb-8 w-full"
              style={{ borderColor: theme.accentColor, opacity: 0.3 }}
            >
              <span className="block text-sm tracking-[0.5em] font-bold uppercase opacity-80 mb-2">
                INSIGHTS & GUIDE
              </span>
              <h1 className="text-6xl font-black leading-tight drop-shadow-lg">
                {config.title || "UNTITLED"}
              </h1>
            </div>
          </div>
        ) : (
          // Content Layout
          <>
            {/* Header */}
            <div
              className="flex justify-between items-center mb-8 border-b pb-4"
              style={{ borderColor: theme.accentColor, opacity: 0.8 }}
            >
              <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-60">
                THE RED BOOK
              </span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.accentColor, opacity: 0.5 }}
              ></div>
            </div>

            {/* Body Text */}
            <div className="flex-1">
              <p
                className="whitespace-pre-wrap text-justify text-[28px] leading-[1.8] font-medium tracking-wide drop-shadow-md"
                style={{ overflowWrap: 'break-word' }}
              >
                {config.content}
              </p>
            </div>

            {/* Footer / Pagination */}
            <div className="mt-auto pt-6 flex justify-end items-end">
              <div className="flex items-baseline font-mono opacity-80">
                <span className="text-4xl font-bold">{config.pageNumber?.toString().padStart(2, '0')}</span>
                <span className="text-xl mx-1">/</span>
                <span className="text-xl">{config.totalPages?.toString().padStart(2, '0')}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;