type CreateColumnProps = { onAddColumnClick: () => void };

export const CreateColumn = ({ onAddColumnClick }: CreateColumnProps) => {
  return (
    <button
      onClick={onAddColumnClick}
      className="h-full flex-col rounded-xl bg-secondary box-border border-2
       border-primary border-dashed bg-opacity-30 py-6 px-8 shrink-0 w-full md:w-[400px]
       flex justify-center items-center text-3xl text-center hover:bg-opacity-40 transition-colors"
    >
      Need a column? Click here to create one!
    </button>
  );
};
