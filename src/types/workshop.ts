export interface PlotPoint {
  id: string;
  content: string;
  sectionId: string;
  position?: number; // Add position for ordering
}

export interface Story {
  id: string;
  title: string;
  content: string;
  quadrantId: string;
}

export interface Section {
  id: string;
  title: string;
  color: string;
  guide: string;
}

export interface Quadrant {
  id: string;
  title: string;
}

export interface DragItem {
  id: string;
  type: 'plot-point';
  sectionId: string;
  content: string;
}