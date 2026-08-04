import { createWorker } from 'tesseract.js';

/**
 * Service to extract NPK and pH values from images using OCR.
 */

export interface ExtractedSoilData {
  N?: number;
  P?: number;
  K?: number;
  ph?: number;
}

export const extractSoilDataFromImage = async (imageFile: File): Promise<ExtractedSoilData> => {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();

    console.log('OCR Text Extracted:', text);

    const data: ExtractedSoilData = {};

    // Improved Regex patterns to match common soil report formats
    // Example: "Nitrogen: 80", "N - 80", "N 80", etc.
    const patterns = {
      N: /(?:Nitrogen|N|Nitrogen\(N\))\s*[:=~-]?\s*(\d{1,3}(\.\d+)?)/i,
      P: /(?:Phosphorus|P|Phosphorus\(P\))\s*[:=~-]?\s*(\d{1,3}(\.\d+)?)/i,
      K: /(?:Potassium|K|Potassium\(K\))\s*[:=~-]?\s*(\d{1,3}(\.\d+)?)/i,
      ph: /(?:pH|Soil pH|Potential of Hydrogen)\s*[:=~-]?\s*(\d{1,2}(\.\d+)?)/i,
    };

    if (patterns.N.test(text)) data.N = parseFloat(text.match(patterns.N)![1]);
    if (patterns.P.test(text)) data.P = parseFloat(text.match(patterns.P)![1]);
    if (patterns.K.test(text)) data.K = parseFloat(text.match(patterns.K)![1]);
    if (patterns.ph.test(text)) data.ph = parseFloat(text.match(patterns.ph)![1]);

    return data;
  } catch (error) {
    await worker.terminate();
    console.error('OCR error:', error);
    throw new Error('Failed to scan report. Please ensure the image is clear and contains text like "Nitrogen", "Phosphorus", etc.');
  }
};
