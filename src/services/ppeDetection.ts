import { Detection } from '../types';

const PPE_LABELS = ['helmet', 'vest', 'gloves', 'boots', 'mask'];

function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const hash = generateHash(content);
      resolve(hash);
    };
    reader.readAsDataURL(file);
  });
}

export function detectPPE(imageUrl: string): Detection[] {
  const numDetections = Math.floor(Math.random() * 4) + 1;
  const detections: Detection[] = [];

  for (let i = 0; i < numDetections; i++) {
    const label = PPE_LABELS[Math.floor(Math.random() * PPE_LABELS.length)];
    const x = Math.random() * 0.6;
    const y = Math.random() * 0.6;
    const width = Math.random() * 0.3 + 0.1;
    const height = Math.random() * 0.3 + 0.1;

    detections.push({
      id: crypto.randomUUID(),
      label,
      confidence: Math.random() * 0.3 + 0.7,
      bbox: {
        x: Math.min(x, 1 - width),
        y: Math.min(y, 1 - height),
        width,
        height
      }
    });
  }

  return detections;
}

export function calculateDetectionsHash(detections: Detection[]): string {
  const detectionsString = JSON.stringify(
    detections.map(d => ({
      label: d.label,
      bbox: d.bbox,
      confidence: d.confidence
    }))
  );
  return generateHash(detectionsString);
}

export function getAllLabels(): string[] {
  return [...PPE_LABELS];
}
