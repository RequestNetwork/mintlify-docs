import { useEffect, useState } from 'react';

export const ComparisonTable = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const comparisonData = [
    {
      method: "Request Network",
      accuracy: 100,
      implementation: "Easy",
      linesOfCode: 10,
      userExperience: "Good",
      notes: "Built-in payment metadata",
      isHighlighted: true,
    },
    {
      method: "Transfers API Webhook",
      accuracy: 60,
      accuracyDisplay: "< 100%",
      implementation: "Hard",
      linesOfCode: 50,
      userExperience: "Compromised",
      notes: "Requires amount and currency matching",
    },
    {
      method: "Blockchain Node RPC Polling",
      accuracy: 60,
      accuracyDisplay: "< 100%",
      implementation: "Very Hard",
      linesOfCode: 150,
      userExperience: "Compromised",
      notes: "Poor performance, requires polling",
    },
    {
      method: "New wallet address per payment",
      accuracy: 100,
      implementation: "Very Hard",
      linesOfCode: 100,
      userExperience: "Poor",
      notes: "Requires gas, many addresses, often custodial",
    },
  ];

  // Icon components using inline SVG
  const CheckIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  const XIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const AlertCircleIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  const Badge = ({ children, className = "" }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );

  const getUXIcon = (ux) => {
    switch (ux) {
      case "Good":
        return <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "Compromised":
        return <AlertCircleIcon className="h-4 w-4 text-orange-600 dark:text-orange-300" />;
      case "Poor":
        return <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getUXColor = (ux) => {
    switch (ux) {
      case "Good":
        return { color: isDark ? "#4ade80" : "#15803d" }; // dark: green-400, light: green-700
      case "Compromised":
        return { color: isDark ? "#fb923c" : "#c2410c" }; // dark: orange-400, light: orange-700
      case "Poor":
        return { color: isDark ? "#f87171" : "#b91c1c" }; // dark: red-400, light: red-700
      default:
        return { color: isDark ? "#9ca3af" : "#4b5563" }; // dark: gray-400, light: gray-600
    }
  };

  const getImplementationIcon = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "Hard":
        return <AlertCircleIcon className="h-4 w-4 text-orange-600 dark:text-orange-300" />;
      case "Very Hard":
        return <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getImplementationColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return { color: isDark ? "#4ade80" : "#15803d" }; // dark: green-400, light: green-700
      case "Hard":
        return { color: isDark ? "#fb923c" : "#c2410c" }; // dark: orange-400, light: orange-700
      case "Very Hard":
        return { color: isDark ? "#f87171" : "#b91c1c" }; // dark: red-400, light: red-700
      default:
        return { color: isDark ? "#9ca3af" : "#4b5563" }; // dark: gray-400, light: gray-600
    }
  };

  const getLinesOfCodeIcon = (linesOfCode) => {
    if (linesOfCode <= 10) {
      return <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
    } else if (linesOfCode <= 50) {
      return <AlertCircleIcon className="h-4 w-4 text-orange-600 dark:text-orange-300" />;
    } else {
      return <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />;
    }
  };

  const getLinesOfCodeColor = (linesOfCode) => {
    if (linesOfCode <= 10) {
      return { color: isDark ? "#4ade80" : "#15803d" }; // dark: green-400, light: green-700
    } else if (linesOfCode <= 50) {
      return { color: isDark ? "#fb923c" : "#c2410c" }; // dark: orange-400, light: orange-700
    } else {
      return { color: isDark ? "#f87171" : "#b91c1c" }; // dark: red-400, light: red-700
    }
  };

  return (
    <div className="w-full p-4 md:p-8">
      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <div className="min-w-[800px]">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-3 mb-3 px-4">
            <div className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400">Method</div>
            <div className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
              Automated Reconciliation
            </div>
            <div className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">Implementation</div>
            <div className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">Lines of Code</div>
            <div className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">User Experience</div>
            <div className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400">Notes</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2 pb-4">
            {comparisonData.map((row, index) => (
              <div
                key={row.method}
                className={`grid grid-cols-6 gap-3 p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${
                  row.isHighlighted
                    ? "bg-green-50/50 dark:bg-green-900/40 border-green-300 dark:border-green-600 hover:bg-green-100/60 dark:hover:bg-green-900/50 hover:shadow-lg dark:hover:shadow-green-900/50 hover:border-green-400 dark:hover:border-green-500"
                    : "bg-white dark:bg-[#001410]/50 border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-[#001410]/70 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {/* Method Name */}
                <div className="flex items-center">
                  <span
                    className={`font-semibold text-xs md:text-sm ${
                      row.isHighlighted ? "text-green-700 dark:text-green-300" : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {row.method}
                  </span>
                </div>

                {/* Accuracy */}
                <div className="flex items-center justify-center">
                  <span
                    className={`text-xl md:text-2xl font-bold ${
                      row.accuracy === 100 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {row.accuracyDisplay || `${row.accuracy}%`}
                  </span>
                </div>

                {/* Implementation Difficulty */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    {getImplementationIcon(row.implementation)}
                    <span 
                      className="text-xs md:text-sm font-medium"
                      style={row.isHighlighted && row.implementation === "Easy" 
                        ? { color: isDark ? "#4ade80" : "#15803d" } 
                        : getImplementationColor(row.implementation)}
                    >
                      {row.implementation}
                    </span>
                  </div>
                </div>

                {/* Lines of Code */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    {getLinesOfCodeIcon(row.linesOfCode)}
                    <span 
                      className="text-xs md:text-sm font-medium"
                      style={row.isHighlighted && row.linesOfCode <= 10 
                        ? { color: isDark ? "#4ade80" : "#15803d" } 
                        : getLinesOfCodeColor(row.linesOfCode)}
                    >
                      ~{row.linesOfCode}
                    </span>
                  </div>
                </div>

                {/* User Experience */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    {getUXIcon(row.userExperience)}
                    <span 
                      className="text-xs md:text-sm font-medium"
                      style={row.isHighlighted && row.userExperience === "Good" 
                        ? { color: isDark ? "#4ade80" : "#15803d" } 
                        : getUXColor(row.userExperience)}
                    >
                      {row.userExperience}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex items-center">
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{row.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default">
            <div className="flex items-start gap-3 mb-3">
              <XIcon className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm md:text-base text-red-700 dark:text-red-300 mb-2">
                  Alternative Trade-offs
                </h3>
                <p className="text-xs md:text-sm text-red-600 dark:text-red-400">
                  Other methods sacrifice automated reconciliation (requiring manual review), burden users with poor UX, or require complex implementations.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default">
            <div className="flex items-start gap-3 mb-3">
              <CheckIcon className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm md:text-base text-green-700 dark:text-green-300 mb-2">
                  Request Network Advantage
                </h3>
                <p className="text-xs md:text-sm text-green-600 dark:text-green-400">
                  The only solution that combines 100% automated reconciliation with easy implementation and great user
                  experience. Built-in payment metadata eliminates guesswork entirely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
