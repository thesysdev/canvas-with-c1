import type { TLBaseShape } from "tldraw";

export type C1ComponentShape = TLBaseShape<
  "c1-component",
  { w: number; h: number; c1Response?: string; isStreaming?: boolean }
>;
