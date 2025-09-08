import { clsx } from "clsx";
import { useState, useRef, useEffect } from "react";
import { track, useEditor, createShapeId } from "tldraw";
import { isMac } from "@/app/utils";
import { makeApiCall } from "@/app/helpers/api";

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
    const shapeId = createShapeId();
    editor.createShape({
      id: shapeId,
      type: "c1-component",
      props: {
        w: 600,
        h: 300,
      },
    });
    await makeApiCall({
      searchQuery: prompt,
      onResponseStreamStart: () => {
        console.log('calling update shape')
        editor.updateShape({
          id: shapeId,
          type: "c1-component",
          props: { isStreaming: true },
        });
      },
      onResponseUpdate: (response) => {
        console.log('calling update shape')
        editor.updateShape({
          id: shapeId,
          type: "c1-component",
          props: { c1Response: response, isStreaming: true },
        });
      },
      onResponseStreamEnd: () => {
        editor.updateShape({
          id: shapeId,
          type: "c1-component",
          props: { isStreaming: false },
        });
      },
      abortController: null,
      setAbortController: () => {},
    });
  };

  return (
    <div
      className={clsx(
        "flex items-center fixed bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-xl text-md transition-all duration-300 gap-2",
        {
          "bg-neutral-800 border-neutral-700 text-white": isDarkMode,
          "bg-white border-neutral-400 text-black": !isDarkMode,
          "w-[200px]": !isFocused,
          "w-1/2": isFocused,
        }
      )}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask C1 anything"
        className="flex-1"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onBlurCapture={() => setIsFocused(false)}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onInputSubmit(prompt);
            setPrompt("");
          }
        }}
      />
      <span className="text-xs opacity-30">
        {showMacKeybinds ? "⌘ + K" : "Ctrl + K"}
      </span>
    </div>
  );
});
