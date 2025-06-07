import React from "react";

interface TitleDisplayProps {
  title: string;
  searchText?: string;
  handleChangeClick: () => void;
  getHighlightedText: (text: string, highlight: string) => React.ReactNode;
  testIdPrefix?: string;
  className?: string;
}

export const TitleDisplay = ({
  title,
  searchText,
  handleChangeClick,
  getHighlightedText,
  testIdPrefix,
  className,
}: TitleDisplayProps) => {
  return (
    <div
      className={`flex items-center cursor-pointer border-b-2 border-transparent p-1 ${
        className || ""
      }`}
      onClick={handleChangeClick}
      data-testid={`${testIdPrefix}-changeTitle`}
    >
      <h2
        className="text-lg text-text font-semibold hover:text-primary transition-colors px-1 flex-1 min-w-0 select-none truncate"
        title={title}
      >
        {searchText ? getHighlightedText(title, searchText) : title}
      </h2>
    </div>
  );
};
