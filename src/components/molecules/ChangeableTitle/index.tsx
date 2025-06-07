import { useEffect, useRef, type RefObject } from "react";

import { useChangeName } from "hooks/useChangeName";
import { useGetHighlightedText } from "hooks/useGetHighlightedText";

import { EditableForm } from "./EditableForm";
import { TitleDisplay } from "./TitleDisplay";

interface TitleProps {
  searchText?: string;
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  testIdPrefix?: string;
  onClickTitle?: () => void;
  isInline?: boolean;
  isNewColumn?: boolean;
}

export const ChangeableTitle = ({
  searchText,
  title,
  onUpdateTitle,
  testIdPrefix,
  onClickTitle,
  isInline = false,
  isNewColumn = false,
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
      inputRef.current.select();
    }
  }, [isEditing]);

  const commonContainerClass = "max-w-[100%]";
  const inlineContainerClass = "flex-1 min-w-0";
  const blockContainerClass = "mt-6";

  useEffect(() => {
    if (isNewColumn) {
      handleChangeClick();
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isNewColumn, handleChangeClick]);

  return (
    <div
      className={`${commonContainerClass} ${
        isInline ? inlineContainerClass : blockContainerClass
      }`}
      onClick={!isEditing ? onClickTitle : undefined}
      data-no-select
    >
      {isEditing ? (
        <EditableForm
          newTitle={newTitle}
          handleTitleChange={handleTitleChange}
          handleTitleSubmit={handleTitleSubmit}
          testIdPrefix={testIdPrefix}
          inputRef={inputRef as RefObject<HTMLInputElement>}
        />
      ) : (
        <TitleDisplay
          title={title}
          searchText={searchText}
          getHighlightedText={getHighlightedText}
          handleChangeClick={handleChangeClick}
          testIdPrefix={testIdPrefix}
        />
      )}
    </div>
  );
};
