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
    .map((shape) => (shape.props as C1ComponentShapeProps).c1Response)
    .filter((response) => response) // Filter out undefined/null responses
    .join("\n");

  return JSON.stringify(c1Responses);
}
