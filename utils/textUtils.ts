/**
 * Splits long text into chunks based on a maximum character count,
 * trying to respect paragraph breaks and punctuation where possible.
 */
export const paginateText = (text: string, maxChars: number = 120): string[] => {
  if (!text) return [];

  const pages: string[] = [];
  const paragraphs = text.split('\n');
  
  let currentPage = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    
    // If the paragraph itself is huge, we need to split it by sentences or arbitrary chunks
    if (paragraph.length > maxChars) {
      // If we have existing content in currentPage, push it first
      if (currentPage.length > 0) {
        pages.push(currentPage.trim());
        currentPage = '';
      }

      // Split the long paragraph
      let remaining = paragraph;
      while (remaining.length > 0) {
        // Take a chunk
        let chunk = remaining.slice(0, maxChars);
        
        // If not the last chunk, try to back off to the last punctuation or space
        if (remaining.length > maxChars) {
          const lastPunctuation = Math.max(
            chunk.lastIndexOf('.'),
            chunk.lastIndexOf('。'),
            chunk.lastIndexOf('!'),
            chunk.lastIndexOf('！'),
            chunk.lastIndexOf('?'),
            chunk.lastIndexOf('？')
          );

          if (lastPunctuation > maxChars * 0.5) {
             // Split at punctuation if it's in the second half of the chunk
             chunk = remaining.slice(0, lastPunctuation + 1);
          } else {
            const lastSpace = chunk.lastIndexOf(' ');
            if (lastSpace > maxChars * 0.5) {
              chunk = remaining.slice(0, lastSpace + 1);
            }
          }
        }
        
        pages.push(chunk.trim());
        remaining = remaining.slice(chunk.length);
      }
    } else {
      // Normal paragraph logic
      if ((currentPage.length + paragraph.length + 1) <= maxChars) {
        currentPage += (currentPage ? '\n' : '') + paragraph;
      } else {
        pages.push(currentPage.trim());
        currentPage = paragraph;
      }
    }
  }

  if (currentPage.trim().length > 0) {
    pages.push(currentPage.trim());
  }

  return pages;
};