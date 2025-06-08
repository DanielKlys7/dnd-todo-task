import { useState } from "react";

import { Button } from "./Button";
import { DropdownItem } from "./DropdownItem";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export type DropdownOption = {
  value: string;
  label: string;
  onClick: () => void;
};

type DropdownMenuProps = {
  options: DropdownOption[];
  disabled?: boolean;
};

const DropdownMenu = ({ options, disabled = false }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleMenu}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Move selected todos to another column"
        data-testid="main-move-to-button"
      >
        Move To <ChevronDownIcon className="inline-block w-4 h-4 ml-1" />
      </Button>
      {isOpen && !disabled && (
        <div
          className="absolute z-10 mt-2 bg-background border border-primary rounded-md shadow-lg min-w-full w-max max-w-[300px] right-0"
          role="menu"
          aria-label="Select target column"
        >
          <ul className="py-1" role="none">
            {options.map((option) => (
              <DropdownItem
                key={option.value}
                option={option}
                setIsOpen={(isOpen) => setIsOpen(isOpen)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
