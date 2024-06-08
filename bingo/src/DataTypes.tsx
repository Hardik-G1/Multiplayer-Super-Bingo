export type GridSize = 5 | 6 | 7 | 8 | 9 | 10;
export const allowedSizes=[5,6,7,8,9,10];
export const wordsMapping: Record<number, string> = {
  5: "Bingo",
  6: "Bingo!",
  7: "Go Bingo",
  8: "Big Bingo",
  9: "Mega Bingo",
  10: "Super Bingo",
};

export interface ConnectionsData {
  id: string,
  ready: boolean
}

export interface GameData {
  id: string,
  content: any
}

export interface GridData {
  number: string,
  struck: boolean
}
