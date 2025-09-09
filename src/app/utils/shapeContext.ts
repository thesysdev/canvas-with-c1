import type { Editor, TLShape } from "tldraw";
import type { C1ComponentShapeProps } from "@/app/shapes/C1ComponentShape";

/**
 * Extracts context from selected C1 component shapes
 * This is used to provide additional context to the AI when creating new shapes
 */
export function extractC1ShapeContext(editor: Editor): string {
  const selectedShapes = editor.getSelectedShapes();
  const c1Shapes = selectedShapes.filter(
    (shape): shape is TLShape => shape.type === "c1-component"
  );

  const c1Responses = c1Shapes
    .map(shape => (shape.props as C1ComponentShapeProps).c1Response)
    .filter(response => response) // Filter out undefined/null responses
    .join("\n");

  return JSON.stringify(c1Responses);
}

/**
 * Checks if a shape is a C1 component shape
 */
export function isC1ComponentShape(shape: TLShape): boolean {
  return shape.type === "c1-component";
}

/**
 * Gets all C1 component shapes from the current page
 */
export function getAllC1Shapes(editor: Editor): TLShape[] {
  const allShapes = editor.getCurrentPageShapes();
  return allShapes.filter(isC1ComponentShape);
}

/**
 * Gets the response content from a C1 component shape
 */
export function getC1ShapeResponse(shape: TLShape): string | undefined {
  if (!isC1ComponentShape(shape)) {
    return undefined;
  }
  return (shape.props as C1ComponentShapeProps).c1Response;
}
