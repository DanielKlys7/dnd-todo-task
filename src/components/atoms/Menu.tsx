export const Menu = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between p-6">
      {children}
    </div>
  );
};
