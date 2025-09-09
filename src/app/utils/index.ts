// Platform detection utilities
export { isMac } from "./platform";

// Shape positioning utilities
export {
  getOptimalShapePosition,
  centerCameraOnShape,
  type ShapePositionOptions,
  type Position,
} from "./shapePositioning";

// Shape context utilities
export { extractC1ShapeContext } from "./shapeContext";

// C1 Shape management utilities
export {
  createC1ComponentShape,
  type C1ShapeCreationOptions,
} from "./c1ShapeManager";
