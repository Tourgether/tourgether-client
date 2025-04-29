export interface GraphPos {
  x: number;
  y: number;
}

export interface ColoredPolylineSection {
  graphPos: GraphPos[];
  color: string;
  dashed?: boolean;
}