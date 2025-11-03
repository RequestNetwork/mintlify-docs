export const DemoContainer = ({ children }) => {
  return (
    <div 
      className="bg-gray-50 dark:bg-gradient-to-b dark:from-[#001912] dark:to-[#00251a] rounded-xl border border-gray-200 dark:border-[#014d3d]"
    >
      {children}
    </div>
  );
};
