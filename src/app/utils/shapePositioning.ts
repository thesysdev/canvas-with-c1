import type { Editor, TLShapeId } from "tldraw";

export interface ShapePositionOptions {
  /** Width of the shape to be positioned */
  width: number;
  /** Height of the shape to be positioned */
  height: number;
  /** Padding between shapes */
  padding?: number;
  /** Maximum grid search attempts */
  maxAttempts?: number;
}

export interface Position {
  x: number;
  y: number;
}

/**
 * Calculates the optimal position for a new shape without overlapping existing shapes
 * Uses intelligent placement strategies including viewport awareness and collision detection
 */
export function getOptimalShapePosition(
  editor: Editor,
  options: ShapePositionOptions
): Position {
  const {
    width: shapeWidth,
    height: shapeHeight,
    padding = 50,
    maxAttempts = 20,
  } = options;

  // Get viewport bounds to ensure shape is visible
  const viewportBounds = editor.getViewportPageBounds();

  // Get all existing shapes on current page
  const existingShapes = editor.getCurrentPageShapes();
  const existingBounds = existingShapes
    .map((shape) => editor.getShapePageBounds(shape))
    .filter((bounds) => bounds !== undefined);

  // If no existing shapes, place at viewport center
  if (existingBounds.length === 0) {
    return {
      x: viewportBounds.center.x - shapeWidth / 2,
      y: viewportBounds.center.y - shapeHeight / 2,
    };
  }

  // Find available space without overlapping existing shapes
  const findNonOverlappingPosition = (
    startX: number,
    startY: number
  ): Position => {
    let x = startX;
    let y = startY;

    // Check if position overlaps with any existing shape
    const wouldOverlap = (testX: number, testY: number): boolean => {
      const testBounds = {
        x: testX,
        y: testY,
        w: shapeWidth,
        h: shapeHeight,
      };

      return existingBounds.some((bounds) => {
        return !(
          testBounds.x >= bounds.maxX + padding ||
          testBounds.x + testBounds.w <= bounds.minX - padding ||
          testBounds.y >= bounds.maxY + padding ||
          testBounds.y + testBounds.h <= bounds.minY - padding
        );
      });
    };

    // Try positions to the right of existing shapes first
    const rightmostBound = Math.max(...existingBounds.map((b) => b.maxX));
    x = rightmostBound + padding;
    y = startY;

    if (!wouldOverlap(x, y)) {
      return { x, y };
    }

    // If right placement overlaps, try below existing shapes
    const bottommostBound = Math.max(...existingBounds.map((b) => b.maxY));
    x = startX;
    y = bottommostBound + padding;

    if (!wouldOverlap(x, y)) {
      return { x, y };
    }

    // If still overlapping, use a grid-based approach
    const gridSize = Math.max(shapeWidth, shapeHeight) + padding;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const row = Math.floor(attempts / 4);
      const col = attempts % 4;

      x = viewportBounds.minX + col * gridSize;
      y = viewportBounds.minY + row * gridSize;

      if (!wouldOverlap(x, y)) {
        return { x, y };
      }

      attempts++;
    }

    // Fallback: place at viewport center (might overlap but visible)
    return {
      x: viewportBounds.center.x - shapeWidth / 2,
      y: viewportBounds.center.y - shapeHeight / 2,
    };
  };

  // Start from viewport center and find non-overlapping position
  return findNonOverlappingPosition(
    viewportBounds.center.x - shapeWidth / 2,
    viewportBounds.center.y - shapeHeight / 2
  );
}

/**
 * Centers the camera on a specific shape with animation
 */
export function centerCameraOnShape(
  editor: Editor,
  shapeId: TLShapeId,
  options?: { duration?: number }
): void {
  const { duration = 200 } = options ?? {};

  editor.run(() => {
    const shape = editor.getShape(shapeId);
    if (shape) {
      editor.select(shape);
      editor.zoomToSelection({ animation: { duration } });
      editor.deselect(shape);
    }
  });
}
