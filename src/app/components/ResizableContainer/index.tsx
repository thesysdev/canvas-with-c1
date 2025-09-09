import { useLayoutEffect, useRef, type PropsWithChildren } from "react";
import { C1ComponentShape } from "@/app/shapes/C1ComponentShape";
import { track, useEditor } from "tldraw";

interface ResizableContainerProps {
  shape: C1ComponentShape;
  isStreaming?: boolean;
}

export const ResizableContainer = track(
  ({
    shape,
    isStreaming,
    children,
  }: PropsWithChildren<ResizableContainerProps>) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const editor = useEditor();

    const calculateShapeHeight = (contentContainer: HTMLDivElement) => {
      return contentContainer.scrollHeight;
    };

    useLayoutEffect(() => {
      const contentContainer = contentRef.current;
      if (!contentContainer) return;

      // The timeout exists because charts resize after first render
      setTimeout(() => {
        const shapeHeight = calculateShapeHeight(contentContainer);

        editor.updateShape({
          id: shape.id,
          type: shape.type,
          props: { ...shape.props, h: shapeHeight },
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, shape.id, shape.type]);

    useLayoutEffect(() => {
      if (!contentRef.current || !isStreaming) return;

      const updateShapeHeight = () => {
        if (!contentRef.current) return;

        const shapeHeight = calculateShapeHeight(contentRef.current);

        editor.run(() => {
          editor.updateShape({
            id: shape.id,
            type: shape.type,
            props: {
              ...shape.props,
              h: shapeHeight,
            },
          });
          editor.select(shape.id);
          editor.zoomToSelection({ animation: { duration: 200 } });
          editor.deselect(shape.id);
        });
      };

      const resizeObserver = new ResizeObserver(() => {
        updateShapeHeight();
      });

      resizeObserver.observe(contentRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, [editor, isStreaming, shape.id, shape.props, shape.type]);

    return (
      <div
        ref={contentRef}
        style={{
          width: "100%",
          minHeight: "fit-content",
          overflow: "visible",
        }}
      >
        {children}
      </div>
    );
  }
);
