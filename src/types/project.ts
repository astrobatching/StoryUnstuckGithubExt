export interface Project {
  id: string;
  name: string;
  type: 'tv-30' | 'tv-60' | 'film';
  status: 'active' | 'draft' | 'completed';
  lastModified: Date;
  template: 'enhanced' | 'classic';
}