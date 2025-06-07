import type { DropdownOption } from "./DropdownMenu";

export const DropdownItem = ({
  option,
  setIsOpen,
}: {
  option: DropdownOption;
  setIsOpen: (value: boolean) => void;
}) => {
  return (
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
  );
};
