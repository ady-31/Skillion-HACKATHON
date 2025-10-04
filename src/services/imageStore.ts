import { ImageRecord, ImageFilters, PaginatedResponse } from '../types';
import { calculateFileHash, detectPPE, calculateDetectionsHash } from './ppeDetection';

class ImageStore {
  private images: Map<string, ImageRecord> = new Map();
  private hashToId: Map<string, string> = new Map();

  async uploadImage(file: File): Promise<ImageRecord> {
    const fileHash = await calculateFileHash(file);

    const existingId = this.hashToId.get(fileHash);
    if (existingId) {
      const existing = this.images.get(existingId);
      if (existing) {
        return existing;
      }
    }

    const fileUrl = URL.createObjectURL(file);
    const detections = detectPPE(fileUrl);
    const detectionsHash = calculateDetectionsHash(detections);

    const imageRecord: ImageRecord = {
      id: crypto.randomUUID(),
      filename: file.name,
      fileHash,
      fileUrl,
      detectionsHash,
      uploadedAt: new Date().toISOString(),
      processed: true,
      detections
    };

    this.images.set(imageRecord.id, imageRecord);
    this.hashToId.set(fileHash, imageRecord.id);

    return imageRecord;
  }

  getImages(filters: ImageFilters = {}): PaginatedResponse<ImageRecord> {
    let filtered = Array.from(this.images.values());

    if (filters.label) {
      filtered = filtered.filter(img =>
        img.detections.some(d => d.label === filters.label)
      );
    }

    if (filters.from) {
      const fromDate = new Date(filters.from);
      filtered = filtered.filter(img => new Date(img.uploadedAt) >= fromDate);
    }

    if (filters.to) {
      const toDate = new Date(filters.to);
      filtered = filtered.filter(img => new Date(img.uploadedAt) <= toDate);
    }

    filtered.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    const total = filtered.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || 20;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      data: paginated,
      total,
      limit,
      offset
    };
  }

  getImageById(id: string): ImageRecord | null {
    return this.images.get(id) || null;
  }

  deleteImage(id: string): boolean {
    const image = this.images.get(id);
    if (!image) return false;

    this.hashToId.delete(image.fileHash);
    URL.revokeObjectURL(image.fileUrl);
    this.images.delete(id);
    return true;
  }

  getStats() {
    const images = Array.from(this.images.values());
    const totalDetections = images.reduce((sum, img) => sum + img.detections.length, 0);

    const labelCounts: Record<string, number> = {};
    images.forEach(img => {
      img.detections.forEach(d => {
        labelCounts[d.label] = (labelCounts[d.label] || 0) + 1;
      });
    });

    return {
      totalImages: images.length,
      totalDetections,
      labelCounts,
      recentImages: images.slice(0, 5)
    };
  }
}

export const imageStore = new ImageStore();
