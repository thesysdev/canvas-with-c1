import { IconButton } from "@crayonai/react-ui";
import clsx from "clsx";
import { ArrowUp, X } from "lucide-react";
import { useState } from "react";
import { useEditor } from "tldraw";

interface InputFieldProps {
  x: number;
  y: number;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export const InputField = ({ x, y, onSubmit, onCancel }: InputFieldProps) => {
  const editor = useEditor();
  const isDarkMode = editor.user.getIsDarkMode();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 1000,
        pointerEvents: "all",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={clsx(
          "flex items-center py-m pl-xl pr-l rounded-2xl border border-interactive-el text-md transition-all duration-300 gap-xs shadow-md min-h-[60px] w-[400px] bg-container text-primary"
        )}
        data-c1-input-area
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter prompt..."
          autoFocus
          className="flex-1"
        />
        <IconButton
          variant="secondary"
          icon={<ArrowUp />}
          size="medium"
          type="submit"
          disabled={!value.trim()}
          onMouseDown={(e) => {
            // Prevent the input from losing focus when clicking the submit button
            e.preventDefault();
          }}
        />
        <IconButton
          variant="secondary"
          icon={<X />}
          size="medium"
          type="button"
          onClick={onCancel}
          onMouseDown={(e) => {
            // Prevent the input from losing focus when clicking the cancel button
            e.preventDefault();
          }}
        />
      </form>
    </div>
  );
};
