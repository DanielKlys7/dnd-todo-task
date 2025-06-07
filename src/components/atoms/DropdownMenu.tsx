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
      <Button onClick={toggleMenu} disabled={disabled}>
        Move To <ChevronDownIcon className="inline-block w-4 h-4 ml-1" />
      </Button>
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-2 bg-background border border-primary rounded-md shadow-lg min-w-full w-max max-w-[300px] right-0">
          <ul className="py-1">
            {options.map((option) => (
              <DropdownItem
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
