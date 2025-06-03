export const Menu = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-2 xl:items-center p-10 pb-0">
      {children}
    </div>
  );
};
