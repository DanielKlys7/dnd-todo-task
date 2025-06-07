export const Menu = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between p-6">{children}</div>
  );
};
