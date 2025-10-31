// Shared button styles for contract interaction buttons
const ButtonStyles = () => (
  <style jsx>{`
    .contract-button:hover {
      color: var(--primary-color) !important;
    }
    .contract-button:focus {
      color: var(--primary-color) !important;
      box-shadow: 0 0 0 2px var(--primary-color) !important;
    }
    .contract-button:active {
      color: var(--primary-color) !important;
    }
  `}</style>
);

export const CopyButton = ({ text, title = "Copy Address" }) => {
  const copyToClipboard = (e) => {
    const button = e.currentTarget;
    const svgElement = button.querySelector('svg');
    const originalSVG = svgElement.outerHTML;
    const originalTitle = button.title;
    
    navigator.clipboard.writeText(text).then(() => {
      // Show success feedback with checkmark icon
      svgElement.outerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      button.title = "Copied!";
      
      // Reset after 2 seconds
      setTimeout(() => {
        const checkmark = button.querySelector('svg');
        checkmark.outerHTML = originalSVG;
        button.title = originalTitle;
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy: ", err);
      // Show error feedback
      button.title = "Failed to copy";
      setTimeout(() => {
        button.title = originalTitle;
      }, 2000);
    });
  };

  return (
    <button 
      onClick={copyToClipboard}
      title={title}
      className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 transition-all duration-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50 no-underline contract-button"
      style={{
        '--primary-color': '#01B089'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <ButtonStyles />
    </button>
  );
};

export const ExternalLinkButton = ({ href, title = "View on Block Explorer" }) => {
  return (
    <button 
      onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
      title={title}
      className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 transition-all duration-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50 no-underline contract-button"
      style={{
        '--primary-color': '#01B089'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15,3 21,3 21,9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
      <ButtonStyles />
    </button>
  );
};