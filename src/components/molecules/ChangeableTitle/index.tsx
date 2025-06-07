import { type RefObject } from "react";

import { useChangeName } from "hooks/useChangeName";
import { useGetHighlightedText } from "hooks/useGetHighlightedText";

import { EditableForm } from "./EditableForm";
import { TitleDisplay } from "./TitleDisplay";
import classNames from "classnames";

interface TitleProps {
  searchText?: string;
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  testIdPrefix?: string;
  onClickTitle?: () => void;
  isInline?: boolean;
  isNew?: boolean;
}

export const ChangeableTitle = ({
  searchText,
  title,
  onUpdateTitle,
  testIdPrefix,
  onClickTitle,
  isInline = false,
  isNew = false,
}: TitleProps) => {
  const { getHighlightedText } = useGetHighlightedText();
  const {
    isEditing,
    handleTitleChange,
    handleTitleSubmit,
    newTitle,
    handleChangeClick,
    inputRef,
  } = useChangeName(
    title,
    () => {
      onUpdateTitle(newTitle);
    },
    isNew
  );

  return (
    <div
      className={classNames("max-w-full", {
        "flex-1 min-w-0": isInline,
        "mt-6": !isInline,
      })}
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
          className="cursor-pointer"
        />
      )}
    </div>
  );
};
