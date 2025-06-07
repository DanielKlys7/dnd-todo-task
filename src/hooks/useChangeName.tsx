import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";

export const useChangeName = (initTitle: string, onSucces: () => void) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(initTitle);

  const handleChangeClick = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleTitleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSucces();
    setIsEditing(false);
  };

  return {
    isEditing,
    newTitle,
    handleChangeClick,
    handleTitleChange,
    handleTitleSubmit,
    ref,
  };
};
