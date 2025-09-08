import { useEffect, useRef, type PropsWithChildren } from "react";
import { C1ComponentShape } from "@/app/shapes/C1ComponentShape";
import { track, useEditor } from "tldraw";

interface ResizableContainerProps {
  shape: C1ComponentShape;
}

export const ResizableContainer = track(
  ({ shape, children }: PropsWithChildren<ResizableContainerProps>) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const editor = useEditor();

    useEffect(() => {
      if (!contentRef.current) return;

      const updateShapeHeight = () => {
        if (!contentRef.current) return;

        // Use scrollHeight for accurate content height measurement
        const contentHeight = contentRef.current.scrollHeight;
        const padding = 0; // Add padding for better visual appearance
        const minHeight = 300; // Minimum height to maintain
        const newHeight = Math.max(minHeight, contentHeight + padding);

        // Update the shape dimensions if they differ significantly (avoid constant updates)
        if (Math.abs(newHeight - shape.props.h) > 10) {
          // editor.updateShape({
          //   id: shape.id,
          //   type: shape.type,
          //   props: {
          //     ...shape.props,
          //     h: newHeight,
          //   },
          // });
        }
      };

      // Initial height calculation
      setTimeout(updateShapeHeight, 100);

      const resizeObserver = new ResizeObserver(() => {
        updateShapeHeight();
      });

      // Also use MutationObserver to detect content changes
      const mutationObserver = new MutationObserver(() => {
        updateShapeHeight();
      });

      resizeObserver.observe(contentRef.current);
      mutationObserver.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }, [editor, shape.id, shape.props, shape.type]);

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
