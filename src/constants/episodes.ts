export const defaultActStructure = [
  { id: 'coldopen', title: 'COLD OPEN', color: 'bg-blue-500', scenes: [], beats: [] },
  { id: 'act1', title: 'ACT 1', color: 'bg-purple-500', scenes: [], beats: [] },
  { id: 'act2a', title: 'ACT 2A', color: 'bg-green-500', scenes: [], beats: [] },
  { id: 'act2b', title: 'ACT 2B', color: 'bg-emerald-500', scenes: [], beats: [] },
  { id: 'act3', title: 'ACT 3', color: 'bg-yellow-500', scenes: [], beats: [] },
  { id: 'act4', title: 'ACT 4', color: 'bg-orange-500', scenes: [], beats: [] },
  { id: 'cliffhanger', title: 'CLIFFHANGER', color: 'bg-red-500', scenes: [], beats: [] }
] as const;

export const defaultSceneCounts: Record<string, number> = {
  'coldopen': 1,
  'act1': 3,
  'act2a': 2,
  'act2b': 2,
  'act3': 2,
  'act4': 1,
  'cliffhanger': 1
} as const;