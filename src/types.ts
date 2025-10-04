export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id: string;
  label: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface ImageRecord {
  id: string;
  filename: string;
  fileHash: string;
  fileUrl: string;
  detectionsHash: string;
  uploadedAt: string;
  processed: boolean;
  detections: Detection[];
}

export interface ImageFilters {
  limit?: number;
  offset?: number;
  label?: string;
  from?: string;
  to?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
