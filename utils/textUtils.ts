import { CONTENT_WIDTH, TYPOGRAPHY } from '../constants';

/**
 * Creates a hidden DOM element to measure the height of text
 * as it would appear in the actual Card component.
 * Singleton pattern: reuses the container to prevent layout thrashing.
 */
let _measurementContainer: HTMLElement | null = null;

const getMeasurementContainer = (): HTMLElement => {
  if (_measurementContainer) return _measurementContainer;

  const container = document.createElement('div');

  // Apply exact styles from Card.tsx / constants
  container.style.boxSizing = 'border-box';
  container.style.width = `${CONTENT_WIDTH}px`;
  // container.style.height = 'auto'; // Default
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.left = '-9999px';
  container.style.top = '-9999px';

  // Typography
  container.style.fontFamily = TYPOGRAPHY.fontFamily;
  container.style.fontSize = TYPOGRAPHY.fontSize;
  container.style.lineHeight = TYPOGRAPHY.lineHeight;
  container.style.fontWeight = TYPOGRAPHY.fontWeight.toString();
  container.style.letterSpacing = TYPOGRAPHY.letterSpacing;

  // CSS Handling for wrapping - CRITICAL match with Card.tsx
  container.style.whiteSpace = 'pre-wrap';
  container.style.wordBreak = 'break-word'; // Important for long words/URLs
  container.style.overflowWrap = 'break-word';
  container.style.textAlign = 'justify';

  document.body.appendChild(container);
  _measurementContainer = container;
  return container;
};

const measureBlockHeight = (text: string): number => {
  const container = getMeasurementContainer();
  container.innerText = text;
  return container.scrollHeight;
};

/**
 * Splits text into pages based on actual visual height.
 * Priority:
 * 1. Keep Paragraphs together
 * 2. Split by Sentences (if paragraph too long)
 * 3. Split by Characters (last resort)
 * 
 * @param text The full text content
 * @param containerHeight The dynamic safe height (calculated in App.tsx)
 */
export const paginateText = (text: string, containerHeight: number): string[] => {
  if (!text) return [];

  const pages: string[] = [];
  const paragraphs = text.split('\n'); // Split by explicit newlines first

  let currentPageContent = '';

  // Helper to check if adding chunk fits
  const fitsOnPage = (current: string, newChunk: string): boolean => {
    const combined = current ? `${current}\n${newChunk}` : newChunk;
    return measureBlockHeight(combined) <= containerHeight;
  };

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];

    // 1. Try adding the whole paragraph
    if (fitsOnPage(currentPageContent, paragraph)) {
      currentPageContent = currentPageContent ? `${currentPageContent}\n${paragraph}` : paragraph;
      continue;
    }

    // 2. If it doesn't fit, but current page has content, start a new page
    if (currentPageContent.length > 0) {
      pages.push(currentPageContent);
      currentPageContent = '';

      // Try again on fresh page
      if (fitsOnPage('', paragraph)) {
        currentPageContent = paragraph;
        continue;
      }
    }

    // 3. Paragraph is too big for a single empty page -> Split by Sentence
    // Regex splits by punctuations but keeps them attached to the preceding part
    // Note: This regex splits "Hello! World" into ["Hello!", " World"]
    // Improved regex to handle multiple punctuations or no punctuations
    const sentenceParts = paragraph.split(/([。！？.!?]+)/g);
    const sentences: string[] = [];

    // Reassemble split parts back into sentences with punctuation
    for (let j = 0; j < sentenceParts.length; j += 2) {
      const content = sentenceParts[j];
      const punctuation = sentenceParts[j + 1] || '';
      if (content || punctuation) {
        sentences.push(content + punctuation);
      }
    }

    let currentSentenceBuffer = '';

    for (const sentence of sentences) {
      const contentToTest = currentPageContent
        ? `${currentPageContent}\n${currentSentenceBuffer}${sentence}`
        : `${currentSentenceBuffer}${sentence}`;

      if (measureBlockHeight(contentToTest) <= containerHeight) {
        currentSentenceBuffer += sentence;
      } else {
        // Current buffer fits? flush it
        if (currentSentenceBuffer) {
          currentPageContent = currentPageContent
            ? `${currentPageContent}\n${currentSentenceBuffer}`
            : currentSentenceBuffer;

          pages.push(currentPageContent);
          currentPageContent = '';
          currentSentenceBuffer = '';
        }

        // Try single sentence on fresh page
        if (measureBlockHeight(sentence) <= containerHeight) {
          currentSentenceBuffer = sentence;
        } else {
          // 4. Single Sentence too big -> Split by Char
          let chars = sentence;
          let fitCharChunk = '';

          for (const char of chars) {
            const testChunk = fitCharChunk + char;
            if (measureBlockHeight(testChunk) <= containerHeight) {
              fitCharChunk += char;
            } else {
              if (currentPageContent) {
                // Should theoretically not happen if logic is correct (we flushed page before entering char loop if sentence didn't fit)
                // But safe to flush
                pages.push(currentPageContent);
                currentPageContent = '';
              }
              pages.push(fitCharChunk);
              fitCharChunk = char;
            }
          }
          if (fitCharChunk) {
            currentSentenceBuffer = fitCharChunk;
          }
        }
      }
    }

    if (currentSentenceBuffer) {
      currentPageContent = currentPageContent
        ? `${currentPageContent}\n${currentSentenceBuffer}`
        : currentSentenceBuffer;
    }
  }

  if (currentPageContent) {
    pages.push(currentPageContent);
  }

  return pages;
};