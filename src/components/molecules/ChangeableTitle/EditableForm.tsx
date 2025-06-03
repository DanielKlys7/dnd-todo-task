import React, { useRef } from "react";

import { Button } from "components/atoms/Button";

interface EditableFormProps {
  newTitle: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  testIdPrefix?: string;
}

export const EditableForm: React.FC<EditableFormProps> = ({
  newTitle,
  handleTitleChange,
  handleTitleSubmit,
  testIdPrefix,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form onSubmit={handleTitleSubmit} ref={formRef} className="flex gap-4">
      <label
        htmlFor={`${testIdPrefix}-title`}
        className="sr-only"
      >{`${testIdPrefix} title`}</label>
      <input
        id={`${testIdPrefix}-title`}
        type="text"
        value={newTitle}
        onChange={handleTitleChange}
        className="bg-transparent flex-shrink w-[70%] px-2"
      />
      <Button type="submit" className="!bg-transparent !border-text !py-1">
        Accept
      </Button>
    </form>
  );
};
