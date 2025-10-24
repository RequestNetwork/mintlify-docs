export const DemoContainer = ({ children }) => {
  return (
    <div 
      style={{ 
        background: 'linear-gradient(to bottom, rgba(1, 176, 137, 0.02), rgba(1, 176, 137, 0.04))',
        borderRadius: '1rem',
        padding: '2rem',
        border: '1px solid rgba(1, 176, 137, 0.1)'
      }}
      className="dark:bg-gradient-to-b dark:from-[rgba(1,176,137,0.06)] dark:to-[rgba(1,176,137,0.10)] dark:border-[rgba(1,176,137,0.2)]"
    >
      {children}
    </div>
  );
};
