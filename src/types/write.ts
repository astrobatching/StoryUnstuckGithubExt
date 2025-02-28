import type { Note } from './shared';

export interface Character {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SceneBeat {
  id: string;
  title: string;
  notes: string;
  color: string;
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  notes: Note[];
  characters: Character[];
  emotionalStart: string;
  emotionalEnd: string;
  emotionalProgress: number;
  isPositiveArc: boolean;
  beats: SceneBeat[];
}

export interface Note {
  id: string;
  user: string;
  content: string;
  time: string;
}