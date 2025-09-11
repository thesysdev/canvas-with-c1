import { BaseBoxShapeUtil, HTMLContainer, type TLResizeInfo } from "tldraw";
import type { C1ComponentShape } from "../shapes/C1ComponentShape";
import { ResizableContainer } from "../components/ResizableContainer";
import { C1Component, ThemeProvider } from "@thesysai/genui-sdk";
import { AiIcon } from "../components/AiIcon";
import clsx from "clsx";

export class C1ComponentShapeUtil extends BaseBoxShapeUtil<C1ComponentShape> {
  static override type = "c1-component" as const;

  getDefaultProps(): C1ComponentShape["props"] {
    return { w: 300, h: 150 };
  }

  // Override onResize to allow only width resizing
  override onResize = (
    shape: C1ComponentShape,
    info: TLResizeInfo<C1ComponentShape>
  ) => {
    const { scaleX } = info;

    // Calculate new width based on horizontal scale
    const newWidth = Math.max(400, shape.props.w * scaleX); // Minimum width of 400px

    return {
      props: {
        ...shape.props,
        w: newWidth,
        // Keep height unchanged - don't apply scaleY
        h: shape.props.h,
      },
    };
  };

  component = (shape: C1ComponentShape) => {
    const isDarkMode = this.editor.user.getIsDarkMode();

    if (!shape.props.c1Response) {
      return (
        <HTMLContainer>
          <div
            className={clsx(
              "w-full h-full flex flex-col gap-1 items-center justify-center border border-[#7F56D917] outline-[#0000000F] bg-[#7F56D914] rounded-xl",
              {
                "text-primary": !isDarkMode,
                "text-white": isDarkMode,
              }
            )}
          >
            <AiIcon />
            <p className="text-md">Magic will happen here</p>
          </div>
        </HTMLContainer>
      );
    }

    return (
      <HTMLContainer style={{ overflow: "visible", pointerEvents: "all" }}>
        <ResizableContainer shape={shape} isStreaming={shape.props.isStreaming}>
          <ThemeProvider mode={isDarkMode ? "dark" : "light"}>
            <C1Component
              key={shape.id}
              c1Response={shape.props.c1Response}
              isStreaming={shape.props.isStreaming || false}
            />
          </ThemeProvider>
        </ResizableContainer>
      </HTMLContainer>
    );
  };

  indicator(shape: C1ComponentShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
