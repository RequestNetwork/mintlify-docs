export const CopyButton = ({ text, title = "Copy Address" }) => {
  const handleCopy = (e) => {
    const button = e.currentTarget;
    const svg = button.querySelector('svg');
    
    if (!navigator.clipboard || !svg) return;
    
    // Store original SVG
    const originalSVG = svg.outerHTML;
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      // Show checkmark
      svg.outerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      button.setAttribute('data-copied', 'true');
      
      // Reset after 2 seconds
      setTimeout(() => {
        const checkmark = button.querySelector('svg');
        if (checkmark) {
          checkmark.outerHTML = originalSVG;
        }
        button.removeAttribute('data-copied');
      }, 2000);
    }).catch(() => {
      // Silent fail
    });
  };

  return (
    <button 
      onClick={handleCopy}
      title={title}
      aria-label={title}
      className="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 transition-all duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
      style={{
        '--primary-color': '#01B089'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <style jsx>{`
        button[data-copied="true"] {
          color: #10b981 !important;
        }
        button:hover {
          color: var(--primary-color) !important;
        }
        button:focus {
          color: var(--primary-color) !important;
          box-shadow: 0 0 0 2px var(--primary-color) !important;
        }
      `}</style>
    </button>
  );
};

export const ExternalLinkButton = ({ href, title = "View on Block Explorer" }) => {
  // Validate URL to prevent XSS/open redirects
  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  if (!isValidUrl(href)) {
    console.error('Invalid URL provided to ExternalLinkButton:', href);
    return null;
  }

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
        borderBottom: 'none',
        '--primary-color': '#01B089'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15,3 21,3 21,9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
      <style jsx>{`
        a:hover {
          color: var(--primary-color) !important;
        }
        a:focus {
          color: var(--primary-color) !important;
          box-shadow: 0 0 0 2px var(--primary-color) !important;
        }
      `}</style>
    </a>
  );
};