"use client";

import { useEffect } from "react";
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
import { GithubButton } from "./components/GithubButton";

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
  useEffect(() => {
    // Handle system color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      // Only apply system preference if no explicit theme is set (auto mode)
      if (!document.documentElement.hasAttribute("data-theme")) {
        // The CSS media query will automatically handle the variable updates
        // We just need to ensure tldraw is notified if needed
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

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
          onMount={(editor) => {
            // Set initial color scheme based on editor settings
            const colorScheme = editor.user.getUserPreferences().colorScheme;
            if (colorScheme === "dark") {
              document.documentElement.setAttribute("data-theme", "dark");
            } else if (colorScheme === "light" || !colorScheme) {
              document.documentElement.setAttribute("data-theme", "light");
            } else if (colorScheme === "system") {
              // Remove data-theme attribute to allow system preference to take effect
              document.documentElement.removeAttribute("data-theme");
            }
          }}
          onUiEvent={(event, eventData) => {
            if (event === "color-scheme") {
              const { value: mode } = eventData as {
                value: "light" | "dark" | "system" | undefined;
              };
              if (mode === "dark") {
                document.documentElement.setAttribute("data-theme", "dark");
              } else if (mode === "light" || !mode) {
                // Default to light theme if mode is undefined
                document.documentElement.setAttribute("data-theme", "light");
              } else if (mode === "system") {
                // Remove data-theme attribute to allow system preference to take effect
                document.documentElement.removeAttribute("data-theme");
              }
            }
          }}
          persistenceKey="c1-canvas"
        >
          <PromptInput focusEventName={FOCUS_PROMPT_EVENT} />
          <C1SelectionUI />
          <GithubButton />
        </Tldraw>
      </div>
    </HotkeysProvider>
  );
};

export default Page;
