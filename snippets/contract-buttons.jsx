export const CopyButton = ({ text, title = "Copy Address" }) => {
  return (
    <button 
      onClick={() => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        }
      }}
      title={title}
      aria-label={title}
      className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 transition-all duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>
  );
};

export const ExternalLinkButton = ({ href, title = "View on Block Explorer" }) => {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 transition-all duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none no-underline"
      style={{
        textDecoration: 'none',
        borderBottom: 'none'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15,3 21,3 21,9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  );
};