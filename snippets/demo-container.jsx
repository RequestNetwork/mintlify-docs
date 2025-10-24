export const DemoContainer = ({ children }) => {
  return (
    <div 
      style={{ 
        background: 'linear-gradient(to bottom, rgba(1, 176, 137, 0.03), rgba(1, 176, 137, 0.05))',
        borderRadius: '1rem',
        padding: '2rem',
        border: '1px solid rgba(1, 176, 137, 0.15)'
      }}
      className="dark:bg-gradient-to-b dark:from-[#001912] dark:to-[#00251a] dark:border-[rgba(1,176,137,0.3)]"
    >
      {children}
    </div>
  );
};
