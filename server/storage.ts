// Storage interface for the health assessment application
// Currently using in-memory storage since assessments are stateless

export interface IStorage {
  // No persistent storage needed for MVP
  // Assessments are calculated on-the-fly and results are stored client-side
}

export class MemStorage implements IStorage {
  constructor() {
    // No initialization needed for stateless assessment
  }
}

export const storage = new MemStorage();
