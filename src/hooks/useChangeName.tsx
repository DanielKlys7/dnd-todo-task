import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const useChangeName = (
  initTitle: string,
  onSucces: () => void,
  isNew: boolean
) => {
  const inputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isNew) {
      handleChangeClick();
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isNew, handleChangeClick]);

  return {
    isEditing,
    newTitle,
    handleChangeClick,
    handleTitleChange,
    handleTitleSubmit,

    inputRef,
  };
};
