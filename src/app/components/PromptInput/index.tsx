import { clsx } from "clsx";
import { useState, useRef, useEffect } from "react";
import { track, useEditor } from "tldraw";
import { isMac, createC1ComponentShape } from "@/app/utils";
import { IconButton, ThemeProvider } from "@crayonai/react-ui";
import { ArrowUp } from "lucide-react";

interface PromptInputProps {
  focusEventName: string;
}

export const PromptInput = track(({ focusEventName }: PromptInputProps) => {
  const editor = useEditor();
  const isDarkMode = editor.user.getIsDarkMode();
  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const showMacKeybinds = isMac();
  const inputRef = useRef<HTMLInputElement>(null);
  const isCanvasZeroState = editor.getCurrentPageShapes().length === 0;

  // Listen for the custom focus event from tldraw
  useEffect(() => {
    const handleFocusEvent = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        setIsFocused(true);
      }
    };

    window.addEventListener(focusEventName, handleFocusEvent);
    return () => {
      window.removeEventListener(focusEventName, handleFocusEvent);
    };
  }, [focusEventName]);

  const onInputSubmit = async (prompt: string) => {
    setPrompt("");
    try {
      await createC1ComponentShape(editor, {
        searchQuery: prompt,
        width: 600,
        height: 300,
        centerCamera: true,
        animationDuration: 200,
      });
    } catch (error) {
      console.error("Failed to create C1 component shape:", error);
    }
  };

  return (
    <form
      className={clsx(
        "flex items-center fixed left-1/2 -translate-x-1/2 py-m pl-xl pr-l rounded-2xl border border-interactive-el text-md transition-all duration-300 gap-xs shadow-md min-h-[60px] ease-in-out",
        {
          "bg-neutral-800 border-neutral-700 text-white": isDarkMode,
          "bg-container border-interactive-el text-primary": !isDarkMode,
          "w-[400px]": !isFocused,
          "w-1/2": isFocused,
          // Position based on canvas state
          "top-1/2 -translate-y-1/2": isCanvasZeroState,
          "bottom-4": !isCanvasZeroState,
        }
      )}
      onSubmit={(e) => {
        e.preventDefault();
        onInputSubmit(prompt);
        setIsFocused(false);
        inputRef.current?.blur();
      }}
    >
      <ThemeProvider mode={isDarkMode ? "dark" : "light"}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask anything..."
          className="flex-1"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onBlurCapture={() => setIsFocused(false)}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        {isFocused ? (
          <IconButton
            variant="secondary"
            icon={<ArrowUp />}
            size="medium"
            type="submit"
            onMouseDown={(e) => {
              // Prevent the input from losing focus when clicking the submit button
              e.preventDefault();
            }}
          />
        ) : (
          <span className="text-xs opacity-30">
            {showMacKeybinds ? "⌘ + K" : "Ctrl + K"}
          </span>
        )}
      </ThemeProvider>
    </form>
  );
});
