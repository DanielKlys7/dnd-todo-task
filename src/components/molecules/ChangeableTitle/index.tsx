import {
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
} from "react"; // Added missing types

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
}

export const ChangeableTitle = ({
  searchText,
  title,
  onUpdateTitle,
  testIdPrefix,
  onClickTitle,
  isInline = false,
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
          handleTitleChange={
            handleTitleChange as (event: ChangeEvent<HTMLInputElement>) => void
          } // Added type assertion
          handleTitleSubmit={
            handleTitleSubmit as (event: FormEvent<HTMLFormElement>) => void
          } // Added type assertion
          testIdPrefix={testIdPrefix}
          inputRef={inputRef as RefObject<HTMLInputElement>} // Added type assertion
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
