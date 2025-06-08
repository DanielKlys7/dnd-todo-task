import { useDroppable } from "@dnd-kit/core";

export const Container = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({
    id: "page",
  });

  return (
    <main
      className="w-screen h-screen flex flex-col"
      ref={setNodeRef}
      data-testid="page"
    >
      {children}
    </main>
  );
};
