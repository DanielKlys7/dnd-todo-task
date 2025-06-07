import React from "react";

interface TitleDisplayProps {
  title: string;
  searchText?: string;
  handleChangeClick: () => void;
  getHighlightedText: (text: string, highlight: string) => React.ReactNode;
  testIdPrefix?: string;
}

export const TitleDisplay = ({
  title,
  searchText,
  handleChangeClick,
  getHighlightedText,
  testIdPrefix,
}: TitleDisplayProps) => {
  return (
    <div
      className="flex items-center cursor-pointer group border-b-2 border-transparent p-1"
      onClick={handleChangeClick}
      data-testid={`${testIdPrefix}-changeTitle`}
    >
      <h2
        className="text-lg font-semibold group-hover:text-blue-600 transition-colors truncate px-1 flex-1 min-w-0"
        title={title}
      >
        {searchText
          ? getHighlightedText(title, searchText)
          : title || "New Title"}
      </h2>
    </div>
  );
};
