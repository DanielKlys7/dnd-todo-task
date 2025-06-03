import { useEffect, useRef } from "react";

import { useChangeName } from "hooks/useChangeName";
import { useGetHighlightedText } from "hooks/useGetHighlightedText";

import { EditableForm } from "./EditableForm";
import { TitleDisplay } from "./TitleDisplay";

interface TitleProps {
  searchText?: string;
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  testIdPrefix?: string;
}

export const ChangeableTitle = ({
  searchText,
  title,
  onUpdateTitle,
  testIdPrefix,
}: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { getHighlightedText } = useGetHighlightedText();
  const {
    isEditing,
    handleTitleChange,
    handleTitleSubmit,
    newTitle,
    handleChangeClick,
  } = useChangeName(title, () => {
    onUpdateTitle(newTitle);
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="mt-6 max-w-[100%]">
      {isEditing ? (
        <EditableForm
          newTitle={newTitle}
          handleTitleChange={handleTitleChange}
          handleTitleSubmit={handleTitleSubmit}
          testIdPrefix={testIdPrefix}
        />
      ) : (
        <TitleDisplay
          title={title}
          searchText={searchText}
          handleChangeClick={handleChangeClick}
          getHighlightedText={getHighlightedText}
          testIdPrefix={testIdPrefix}
        />
      )}
    </div>
  );
};
