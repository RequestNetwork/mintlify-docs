export const ComparisonTable = () => {
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
        return <AlertCircleIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      case "Poor":
        return <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getUXColor = (ux) => {
    switch (ux) {
      case "Good":
        return "text-green-700 dark:text-green-300";
      case "Compromised":
        return "text-orange-700 dark:text-orange-300";
      case "Poor":
        return "text-red-700 dark:text-red-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  const getImplementationIcon = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "Hard":
        return <AlertCircleIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      case "Very Hard":
        return <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getImplementationColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-700 dark:text-green-300";
      case "Hard":
        return "text-orange-700 dark:text-orange-300";
      case "Very Hard":
        return "text-red-700 dark:text-red-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-8">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Blockchain Payment Detection Methods Compared
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          Other methods require manual reconciliation or sacrifice implementation simplicity or user experience
        </p>
      </div>

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
                    ? "bg-green-50/50 dark:bg-green-950/20 border-green-300 dark:border-green-700 hover:bg-green-100/60 dark:hover:bg-green-950/30 hover:shadow-lg dark:hover:shadow-green-900/50 hover:border-green-400 dark:hover:border-green-600"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600"
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
                  <div className={`flex items-center gap-2 ${getImplementationColor(row.implementation)}`}>
                    {getImplementationIcon(row.implementation)}
                    <span className="text-xs md:text-sm font-medium">{row.implementation}</span>
                  </div>
                </div>

                {/* Lines of Code */}
                <div className="flex items-center justify-center">
                  <span
                    className={`font-bold text-sm md:text-base ${
                      row.linesOfCode <= 10
                        ? "text-green-600 dark:text-green-400"
                        : row.linesOfCode <= 50
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ~{row.linesOfCode}
                  </span>
                </div>

                {/* User Experience */}
                <div className="flex items-center justify-center">
                  <div className={`flex items-center gap-2 ${getUXColor(row.userExperience)}`}>
                    {getUXIcon(row.userExperience)}
                    <span className="text-xs md:text-sm font-medium">{row.userExperience}</span>
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
        </div>
      </div>
    </div>
  );
};
