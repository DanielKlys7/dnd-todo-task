import { useState } from "react";

import { Button } from "./Button";

type DropdownMenuProps = {
  options: { value: string; label: string; onClick: () => void }[];
};

const DropdownMenu = ({ options }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button onClick={toggleMenu}>
        Click to move selected todos to another column
      </Button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-background border border-primary rounded-md shadow-lg">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 text-sm text-text hover:bg-accent cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  option.onClick();
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
