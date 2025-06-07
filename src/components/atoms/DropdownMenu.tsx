import { useState } from "react";

import { Button } from "./Button";
import { DropdownItem } from "./DropdownItem";

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
        Move To
      </Button>
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-2 bg-background border border-primary rounded-md shadow-lg">
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
