import type { TLBaseShape } from "tldraw";

export type C1ComponentShapeProps = {
  w: number;
  h: number;
  c1Response?: string;
  isStreaming?: boolean;
  prompt?: string; // optional for backwards compatibility since this was added later
};

export type C1ComponentShape = TLBaseShape<
  "c1-component",
  C1ComponentShapeProps
>;
