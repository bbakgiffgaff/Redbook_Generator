import { createRoot } from 'react-dom/client';
import { CONTENT_WIDTH, TYPOGRAPHY, MARKDOWN_STYLES, AUTO_SHRINK } from '../constants';
import { renderMarkdown } from './markdownRenderer';

/**
 * Creates a hidden DOM element to measure the height of text
 * as it would appear in the actual Card component.
 * Singleton pattern: reuses the container to prevent layout thrashing.
 */
let _measurementContainer: HTMLElement | null = null;
let _reactRoot: any = null; // Store root for unmounting/updating

const getMeasurementContainer = (): HTMLElement => {
  if (_measurementContainer) return _measurementContainer;

  const container = document.createElement('div');

  // Apply exact styles from Card.tsx / constants
  container.style.boxSizing = 'border-box';
  container.style.width = `${CONTENT_WIDTH}px`;
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.left = '-9999px';
  container.style.top = '-9999px';

  // Typography Constants
  container.style.fontFamily = TYPOGRAPHY.fontFamily;
  container.style.letterSpacing = TYPOGRAPHY.letterSpacing;

  // CSS Handling for wrapping - CRITICAL match with Card.tsx
  container.style.whiteSpace = 'pre-wrap';
  container.style.wordBreak = 'break-word';
  container.style.overflowWrap = 'break-word';
  container.style.textAlign = 'justify';

  document.body.appendChild(container);
  _measurementContainer = container;
  return container;
};

/**
 * Renders Markdown Content into the hidden container and measures height.
 * Supports dynamic fontSize for Auto-Shrink.
 */
const measureBlockHeight = (text: string, fontSize: number = parseInt(TYPOGRAPHY.fontSize)): number => {
  const container = getMeasurementContainer();

  // Dynamic Styling Update
  container.style.fontSize = `${fontSize}px`;
  container.style.lineHeight = (fontSize * parseFloat(TYPOGRAPHY.lineHeight) / parseInt(TYPOGRAPHY.fontSize)).toString();
  // Ensure we are using the Ratio from constants: 1.8. 
  // Simplified: lineHeight is unitless 1.8, so just set it. 
  // If constants.ts has '1.8', it applies to any font size.
  container.style.lineHeight = TYPOGRAPHY.lineHeight;
  container.style.fontWeight = TYPOGRAPHY.fontWeight.toString();

  // Render using React Root to support parsed nodes
  if (!_reactRoot) {
    _reactRoot = createRoot(container);
  }

  // We need to render synchronously for measurement? 
  // createRoot is async. flushingSync is needed or usage of plain DOM if possible.
  // Limitation: React 18 createRoot is async. 
  // WORKAROUND: For measurement of simple nodes, we can try ReactDOM.flushSync 
  // BUT: flushSync might not work with createRoot easily for "just mount and measure".
  // ALTERNATIVE: Use renderMarkdown to get nodes, but since they are React Nodes, we need React to render them to DOM.
  // OPTIMIZATON: Since our parseMarkdown produces simple structure, we can manually build DOM for measurement 
  // to avoid React async overhead in a loop.
  //
  // Let's implement a "Render to DOM" helper for measurement to be 100% sync

  container.innerHTML = ''; // Clear previous
  const nodes = renderMarkdownToDomNodes(text);
  nodes.forEach(node => container.appendChild(node));

  return container.scrollHeight;
};

/**
 * Helper to render Markdown directly to DOM nodes for sync measurement
 */
import { parseMarkdown } from './markdownRenderer';

const renderMarkdownToDomNodes = (text: string): Node[] => {
  const parsed = parseMarkdown(text);
  return parsed.map(node => {
    if (node.type === 'bold') {
      const span = document.createElement('span');
      span.style.fontWeight = MARKDOWN_STYLES.bold.fontWeight.toString();
      span.innerText = node.content;
      return span;
    }
    if (node.type === 'list') {
      const ul = document.createElement('ul');
      ul.style.listStyleType = MARKDOWN_STYLES.list.listStyleType;
      ul.style.paddingLeft = MARKDOWN_STYLES.list.paddingLeft;
      ul.style.marginBottom = MARKDOWN_STYLES.list.marginBottom;

      node.items.forEach(itemText => {
        const li = document.createElement('li');
        li.style.marginBottom = MARKDOWN_STYLES.listItem.marginBottom;
        li.innerText = itemText;
        ul.appendChild(li);
      });
      return ul;
    }
    return document.createTextNode(node.content);
  });
};


/**
 * Splits text into pages based on visual height.
 * Includes Auto-Shrink Logic.
 */
export const paginateText = (text: string, containerHeight: number): { content: string, fontSize: number }[] => {
  if (!text) return [];

  const pages: { content: string, fontSize: number }[] = [];
  const paragraphs = text.split('\n');

  let currentPageContent = '';
  // Default Font Size
  let currentFontSize = AUTO_SHRINK.defaultFontSize;

  // Helper: check fit with specific font size
  const measure = (txt: string, fs: number) => measureBlockHeight(txt, fs);

  // We process accumulation normally at Default Font Size.
  // IF a chunk overflows, we then try the "Shrink Strategy" for the *current page*.

  /*
     Revised Logic for Auto-Shrink matching Design:
     1. Build page at Default Size.
     2. When adding a chunk causes overflow:
        a. Calculate overflow amount.
        b. If < 10%, try shrinking font of (Current + NewChunk).
        c. If shrink fits, use it and finalize page.
        d. If not, use standard split (at Default Size).
   */

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];

    // Tentative combine
    const tentativeContent = currentPageContent ? `${currentPageContent}\n${paragraph}` : paragraph;

    // Check fit at Default Size
    if (measure(tentativeContent, AUTO_SHRINK.defaultFontSize) <= containerHeight) {
      currentPageContent = tentativeContent;
      continue;
    }

    // Overflow detected! Try Auto-Shrink
    const heightAtDefault = measure(tentativeContent, AUTO_SHRINK.defaultFontSize);
    const overflowRatio = (heightAtDefault - containerHeight) / containerHeight;

    let shrinkSuccess = false;
    let shrinkFontSize = AUTO_SHRINK.defaultFontSize;

    if (overflowRatio <= AUTO_SHRINK.maxOverflowTolerance) {
      // Attempt Shrink Loop
      for (let size = AUTO_SHRINK.defaultFontSize - AUTO_SHRINK.step; size >= AUTO_SHRINK.minFontSize; size -= AUTO_SHRINK.step) {
        if (measure(tentativeContent, size) <= containerHeight) {
          shrinkSuccess = true;
          shrinkFontSize = size;
          break;
        }
      }
    }

    if (shrinkSuccess) {
      // Accepted at smaller font
      pages.push({ content: tentativeContent, fontSize: shrinkFontSize });
      currentPageContent = '';
      continue; // process next paragraph
    }

    // Shrink failed or too big overflow -> Standard Split Logic (Paragraph > Sentence > Char)
    // We already know Paragraph doesn't fit at default size.

    // If we have content, flush it first (at default size)
    if (currentPageContent) {
      pages.push({ content: currentPageContent, fontSize: AUTO_SHRINK.defaultFontSize });
      currentPageContent = '';
    }

    // Now handle the overflowing paragraph alone
    // It might fit alone at default size?
    if (measure(paragraph, AUTO_SHRINK.defaultFontSize) <= containerHeight) {
      currentPageContent = paragraph;
    } else {
      // Split functionality (Sentences/Chars) - reused from V1 logic but simplified/integrated
      // To be robust, we implement the sub-splitting here.

      const sentenceParts = paragraph.split(/([。！？.!?]+)/g);
      let sentenceBuffer = '';

      // Reassemble sentences
      const sentences: string[] = [];
      for (let j = 0; j < sentenceParts.length; j += 2) {
        sentences.push(sentenceParts[j] + (sentenceParts[j + 1] || ''));
      }

      for (const sentence of sentences) {
        const tentativeS = sentenceBuffer ? `${sentenceBuffer}${sentence}` : sentence;
        if (measure(tentativeS, AUTO_SHRINK.defaultFontSize) <= containerHeight) {
          sentenceBuffer = tentativeS;
        } else {
          if (sentenceBuffer) {
            pages.push({ content: sentenceBuffer, fontSize: AUTO_SHRINK.defaultFontSize });
            sentenceBuffer = '';
          }
          // Single sentence too big?
          if (measure(sentence, AUTO_SHRINK.defaultFontSize) <= containerHeight) {
            sentenceBuffer = sentence;
          } else {
            // Char split
            for (const char of sentence) {
              if (measure(sentenceBuffer + char, AUTO_SHRINK.defaultFontSize) <= containerHeight) {
                sentenceBuffer += char;
              } else {
                pages.push({ content: sentenceBuffer, fontSize: AUTO_SHRINK.defaultFontSize });
                sentenceBuffer = char;
              }
            }
          }
        }
      }
      if (sentenceBuffer) {
        currentPageContent = sentenceBuffer;
      }
    }
  }

  if (currentPageContent) {
    pages.push({ content: currentPageContent, fontSize: AUTO_SHRINK.defaultFontSize });
  }

  return pages;
};