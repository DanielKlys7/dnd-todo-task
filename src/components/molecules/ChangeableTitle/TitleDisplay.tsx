import React from "react";

import { Pen } from "../../atoms/icons/Pen";

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
    <p className="flex items-center">
      <span
        className="mr-2 cursor-pointer"
        onClick={handleChangeClick}
        data-testid={`${testIdPrefix}-changeTitle`}
      >
        <Pen />
      </span>
      {searchText ? getHighlightedText(title, searchText) : title}
    </p>
  );
};
