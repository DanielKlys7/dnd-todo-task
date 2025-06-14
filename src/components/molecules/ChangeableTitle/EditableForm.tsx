import React, { useRef } from "react";
import { CheckIcon as CheckSolidIcon } from "@heroicons/react/24/solid"; // Changed to solid CheckIcon

interface EditableFormProps {
  newTitle: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  testIdPrefix?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const EditableForm: React.FC<EditableFormProps> = ({
  newTitle,
  handleTitleChange,
  handleTitleSubmit,
  testIdPrefix,
  inputRef,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      onSubmit={handleTitleSubmit}
      ref={formRef}
      className="flex gap-2 items-center border-b-2 border-primary p-1"
    >
      <label
        htmlFor={`${testIdPrefix}-title`}
        className="sr-only"
      >{`${testIdPrefix} title`}</label>
      <input
        id={`${testIdPrefix}-title`}
        ref={inputRef}
        type="text"
        value={newTitle}
        onChange={handleTitleChange}
        onBlur={() => formRef.current?.requestSubmit()}
        className="bg-transparent flex-1 min-w-0 outline-none px-1 text-lg font-semibold"
        placeholder="Enter title"
      />
      <button
        type="submit"
        className="p-1 text-primary hover:bg-green-100 rounded-md transition-colors flex-shrink-0"
        title="Save"
        data-testid={`${testIdPrefix}-save-title`}
      >
        <CheckSolidIcon className="w-5 h-5" />
      </button>
    </form>
  );
};
