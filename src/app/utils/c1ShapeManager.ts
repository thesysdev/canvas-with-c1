import type { Editor, TLShapeId } from "tldraw";
import { createShapeId } from "tldraw";
import {
  getOptimalShapePosition,
  centerCameraOnShape,
} from "./shapePositioning";
import { extractC1ShapeContext } from "./shapeContext";
import { makeApiCall } from "@/app/helpers/api";

export interface C1ShapeCreationOptions {
  /** The search query/prompt for the shape */
  searchQuery: string;
  /** Custom width for the shape (default: 600) */
  width?: number;
  /** Custom height for the shape (default: 300) */
  height?: number;
  /** Whether to center camera on the new shape (default: true) */
  centerCamera?: boolean;
  /** Animation duration for camera centering (default: 200ms) */
  animationDuration?: number;
}

/**
 * Creates a new C1 component shape with optimal positioning and context awareness
 * Handles the entire lifecycle: positioning, creation, API call, and updates
 */
export async function createC1ComponentShape(
  editor: Editor,
  options: C1ShapeCreationOptions
): Promise<TLShapeId> {
  const {
    searchQuery,
    width = 600,
    height = 300,
    centerCamera = true,
    animationDuration = 200,
  } = options;

  // Generate unique shape ID
  const shapeId = createShapeId();

  // Extract context from selected C1 shapes
  const additionalContext = extractC1ShapeContext(editor);

  // Calculate optimal position for the new shape
  const position = getOptimalShapePosition(editor, {
    width,
    height,
    padding: 50,
  });

  // Create the shape
  editor.createShape({
    id: shapeId,
    type: "c1-component",
    x: position.x,
    y: position.y,
    props: {
      w: width,
      h: height,
      prompt: searchQuery,
    },
  });

  // Center camera on the new shape if requested
  if (centerCamera) {
    centerCameraOnShape(editor, shapeId, { duration: animationDuration });
  }

  // Make API call to populate the shape with content
  await makeApiCall({
    searchQuery,
    additionalContext,
    onResponseStreamStart: () => {
      editor.updateShape({
        id: shapeId,
        type: "c1-component",
        props: { isStreaming: true },
      });
    },
    onResponseUpdate: (response) => {
      editor.updateShape({
        id: shapeId,
        type: "c1-component",
        props: { c1Response: response, isStreaming: true },
      });
    },
    onResponseStreamEnd: () => {
      const currentShape = editor.getShape(shapeId);
      if (!currentShape) return;

      editor.updateShape({
        id: shapeId,
        type: "c1-component",
        props: { ...currentShape.props, isStreaming: false },
      });
    },
  });

  return shapeId;
}
