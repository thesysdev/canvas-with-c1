"use client";

import "@crayonai/react-ui/styles/index.css";
import "tldraw/tldraw.css";
import {
  DefaultToolbar,
  Tldraw,
  type TLUiComponents,
  type TLUiOverrides,
} from "tldraw";
import { shapeUtils } from "./shapeUtils";
import { PromptInput } from "./components/PromptInput";
import { C1SelectionUI } from "./components/C1SelectionUI";
import { HotkeysProvider } from "react-hotkeys-hook";
import { FOCUS_PROMPT_EVENT } from "./events";

const components: Partial<TLUiComponents> = {
  Toolbar: () => {
    return (
      <div style={{ position: "fixed", top: 8 }}>
        <DefaultToolbar />
      </div>
    );
  },
};

const overrides: TLUiOverrides = {
  actions: (_editor, actions) => {
    return {
      ...actions,
      "focus-prompt-input": {
        id: "focus-prompt-input",
        label: "Focus Prompt Input",
        kbd: "$k",
        onSelect: () => {
          // Dispatch custom event to focus the prompt input
          window.dispatchEvent(new CustomEvent(FOCUS_PROMPT_EVENT));
        },
      },
    };
  },
};

const Page = () => {
  return (
    <HotkeysProvider>
      <div
        className="min-h-screen w-full bg-gray-50"
        style={{ position: "fixed", inset: 0 }}
      >
        <Tldraw
          shapeUtils={shapeUtils}
          components={components}
          overrides={overrides}
          persistenceKey="c1-canvas"
        >
          <PromptInput focusEventName={FOCUS_PROMPT_EVENT} />
          <C1SelectionUI />
        </Tldraw>
      </div>
    </HotkeysProvider>
  );
};

export default Page;
