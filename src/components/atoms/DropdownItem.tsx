import type { DropdownOption } from "./DropdownMenu";

export const DropdownItem = ({
  option,
  setIsOpen,
}: {
  option: DropdownOption;
  setIsOpen: (value: boolean) => void;
}) => {
  return (
    <li key={option.value} role="none">
      <button
        type="button"
        role="menuitem"
        className="w-full text-left px-4 py-2 text-sm text-text hover:bg-accent cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap focus:outline-none focus:bg-accent"
        onClick={() => {
          setIsOpen(false);
          option.onClick();
        }}
        data-testid={`dropdown-option-${option.value}`}
        aria-label={`Move selected todos to ${option.label}`}
      >
        {option.label}
      </button>
    </li>
  );
};
