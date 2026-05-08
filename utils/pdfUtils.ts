import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface ProcessedPDF {
  text: string;
  pageCount: number;
  title: string;
  metadata?: {
    author?: string;
    creationDate?: string;
    subject?: string;
  };
}

/**
 * Extract text content from a PDF file
 * @param file - File object from input
 * @param maxPages - Maximum pages to process (default 10 for performance)
 * @returns ProcessedPDF with extracted text
 */
export async function extractPDFText(file: File, maxPages: number = 10): Promise<ProcessedPDF> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const numPages = Math.min(pdf.numPages, maxPages);
  let fullText = '';
  let title = file.name.replace(/\.pdf$/i, '');
  let metadata: ProcessedPDF['metadata'] = {};

  try {
    const info = await pdf.getMetadata();
    if (info.info) {
      const infoObj = info.info as Record<string, unknown>;
      if (infoObj.Title) title = String(infoObj.Title) || title;
      if (infoObj.Author) metadata.author = String(infoObj.Author);
      if (infoObj.CreationDate) metadata.creationDate = String(infoObj.CreationDate);
      if (infoObj.Subject) metadata.subject = String(infoObj.Subject);
    }
  } catch {
    // Metadata extraction failed, use filename
  }

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: unknown) => {
        const textItem = item as { str?: string };
        return textItem.str || '';
      })
      .filter((str: string) => str.trim())
      .join(' ');
    
    fullText += pageText + '\n\n';
  }

  // Clean up extracted text
  const cleanedText = fullText
    .replace(/\s+/g, ' ')
    .replace(/•/g, '-')
    .trim();

  return {
    text: cleanedText,
    pageCount: numPages,
    title,
    metadata,
  };
}

/**
 * Extract text from a PDF and chunk it for processing
 * @param file - PDF file
 * @param chunkSize - Approximate characters per chunk
 * @returns Array of text chunks
 */
export async function extractPDFChunks(file: File, chunkSize: number = 1000): Promise<string[]> {
  const processed = await extractPDFText(file, 15); // Process up to 15 pages
  const text = processed.text;
  
  // Split into chunks by paragraphs
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 50);
  
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const para of paragraphs) {
    if (currentChunk.length + para.length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += para + '\n\n';
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Check if a file is a valid PDF
 * @param file - File to check
 * @returns true if valid PDF
 */
export function isValidPDF(file: File): boolean {
  return file.type === 'application/pdf' || 
         file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Get formatted file size
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}