export const IntegratedDemo = () => {
  // Constants - moved inside component
  const CUSTOMER_DATA = [
    { name: "Johnson Corp" },
    { name: "Martinez LLC" },
    { name: "Chen Industries" },
    { name: "Patel Enterprises" },
    { name: "Kim Solutions" },
  ];

  const CURRENCIES = ["USDC", "USDT", "DAI"];

  // Helper functions
  const generateAmount = () => {
    const amount = Math.floor(Math.random() * 900) + 100;
    const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];
    return { amount, currency };
  };

  // Icon components
  const SendIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );

  const ExternalLinkIcon = ({ className = "h-3 w-3" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );

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

  const CheckCircle2Icon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  const CryptoIcon = ({ currency, className = "w-4 h-4" }) => {
    const iconMap = {
      USDC: "/logo/icons/usdc.png",
      USDT: "/logo/icons/usdt.png",
      DAI: "/logo/icons/dai.png",
    };

    const iconSrc = iconMap[currency];
    if (!iconSrc) return null;

    return <img src={iconSrc} alt={`${currency} icon`} className={className} />;
  };

  const getCurrencyDisplay = (amount, currency) => {
    return (
      <span className="flex items-center gap-1.5">
        <CryptoIcon currency={currency} className="w-4 h-4" />
        <span>
          {amount} {currency}
        </span>
      </span>
    );
  };

  // Simple Badge component
  const Badge = ({ children, variant = "default", className = "" }) => {
    const variantClasses = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      secondary: "bg-gray-600 text-white dark:bg-gray-500 dark:text-white",
      success: "bg-green-600 text-white dark:bg-green-700 dark:text-white",
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${variantClasses[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  // Simple Button component
  const Button = ({ children, onClick, disabled, variant = "default", size = "md", className = "" }) => {
    const variantClasses = {
      default: "bg-primary-600 hover:bg-primary-700 text-white",
      outline: "bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    };

    const sizeClasses = {
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: variant === 'default' ? '#01B089' : undefined }}
      >
        {children}
        <style jsx>{`
          button:hover:not(:disabled) {
            opacity: 0.9;
          }
          button:focus {
            ring-color: #01B089;
          }
        `}</style>
      </button>
    );
  };

  // Component state
  const rightCardRef = useRef(null);
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);
  const demoContainerRef = useRef(null);

  const [leftPayments, setLeftPayments] = useState([]);
  const [rightRequests, setRightRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const [hasSeenCollisionExplainer, setHasSeenCollisionExplainer] = useState(false);
  const [showCollisionExplainer, setShowCollisionExplainer] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Sync scrolling
  useEffect(() => {
    const leftScroll = leftScrollRef.current;
    const rightScroll = rightScrollRef.current;

    if (!leftScroll || !rightScroll) return;

    const handleLeftScroll = () => {
      if (rightScroll) {
        rightScroll.scrollTop = leftScroll.scrollTop;
      }
    };

    const handleRightScroll = () => {
      if (leftScroll) {
        leftScroll.scrollTop = rightScroll.scrollTop;
      }
    };

    leftScroll.addEventListener("scroll", handleLeftScroll);
    rightScroll.addEventListener("scroll", handleRightScroll);

    return () => {
      leftScroll.removeEventListener("scroll", handleLeftScroll);
      rightScroll.removeEventListener("scroll", handleRightScroll);
    };
  }, []);

  // Clear isNew flags after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeftPayments((prev) => prev.map((p) => ({ ...p, isNew: false })));
      setRightRequests((prev) => prev.map((r) => ({ ...r, isNew: false })));
    }, 500);

    return () => clearTimeout(timer);
  }, [leftPayments.length, rightRequests.length]);

  

  const handleStartDemo = () => {
    setHasStarted(true);
    setShowDialog(false);
  };

  const handleCreateRequest = () => {
    const randomCustomer = CUSTOMER_DATA[Math.floor(Math.random() * CUSTOMER_DATA.length)];
    let amount;
    let currency;

    setRequestCount(prev => {
      const newCount = prev + 1;
      
      if (newCount % 3 === 0 && rightRequests.length > 0) {
        const existingRequest = rightRequests[Math.floor(Math.random() * rightRequests.length)];
        amount = existingRequest.amount;
        currency = existingRequest.currency;
      } else {
        const generated = generateAmount();
        amount = generated.amount;
        currency = generated.currency;
      }

      const timestamp = new Date();
      const id = `request-${Date.now()}`;

      const newRequest = {
        id,
        amount,
        currency,
        customer: randomCustomer.name,
        status: "awaiting_payment",
        timestamp,
        isNew: true,
      };

      const placeholder = {
        id: `placeholder-${id}`,
        amount,
        currency,
        from: "",
        timestamp,
        status: "possibly_reconciled",
        requestId: id,
        txHash: "",
        isNew: true,
        isPlaceholder: true,
      };

      setRightRequests((prev) => [newRequest, ...prev]);
      setLeftPayments((prev) => [placeholder, ...prev]);
      
      return newCount;
    });
  };

  const calculateLeftAccuracy = () => {
    const nonPlaceholderPayments = leftPayments.filter((p) => !p.isPlaceholder);
    if (nonPlaceholderPayments.length === 0) return "N/A";

    const reconciledCount = nonPlaceholderPayments.filter((p) => p.status === "possibly_reconciled").length;
    const percentage = Math.round((reconciledCount / nonPlaceholderPayments.length) * 100);
    return `${percentage}%`;
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);

    const awaitingRequests = rightRequests.filter((r) => r.status === "awaiting_payment");

    if (awaitingRequests.length === 0) {
      setIsProcessing(false);
      return;
    }

    setPaymentCount(prev => prev + 1);

    const randomIndex = Math.floor(Math.random() * awaitingRequests.length);
    const selectedRequest = awaitingRequests[randomIndex];

    const paymentAmount = selectedRequest.amount;
    const paymentCurrency = selectedRequest.currency;

    const randomAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const txHash = `0x${Math.random().toString(16).substr(2, 16)}`;

    const matchingPayments = leftPayments.filter(
      (p) => !p.isPlaceholder && p.amount === paymentAmount && p.currency === paymentCurrency,
    );

    const hasCollision = matchingPayments.length > 0;

    const newPayment = {
      id: `payment-${Date.now()}`,
      amount: paymentAmount,
      currency: paymentCurrency,
      from: randomAddress,
      timestamp: new Date(),
      status: hasCollision ? "payment_collision" : "possibly_reconciled",
      requestId: selectedRequest.id,
      txHash,
      isNew: true,
    };

    setLeftPayments((prev) => {
      const placeholderIndex = prev.findIndex((p) => p.isPlaceholder && p.requestId === selectedRequest.id);

      if (placeholderIndex !== -1) {
        const updated = [...prev];
        updated[placeholderIndex] = newPayment;

        if (hasCollision) {
          return updated.map((p) =>
            !p.isPlaceholder && p.amount === paymentAmount && p.currency === paymentCurrency
              ? { ...p, status: "payment_collision" }
              : p,
          );
        }

        return updated;
      }

      return [newPayment, ...prev];
    });

    setRightRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: "paid_reconciled", txHash, isNew: true } : r,
      ),
    );

    setTimeout(() => {
      triggerConfetti();
    }, 100);

    if (hasCollision) {
      if (!hasSeenCollisionExplainer) {
        setTimeout(() => {
          setShowCollisionExplainer(true);
          setHasSeenCollisionExplainer(true);
        }, 1000);
      }
    }

    setIsProcessing(false);
  };

  const triggerConfetti = () => {
    if (typeof window !== 'undefined' && window.confetti) {
      if (rightCardRef.current) {
        const rect = rightCardRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        window.confetti({
          particleCount: 50,
          spread: 60,
          origin: { x, y },
          colors: ["#10b981", "#059669", "#047857"],
        });
      }
    } else if (typeof window !== 'undefined' && !window.confetti) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
      script.onload = () => {
        if (window.confetti && rightCardRef.current) {
          const rect = rightCardRef.current.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;

          window.confetti({
            particleCount: 50,
            spread: 60,
            origin: { x, y },
            colors: ["#10b981", "#059669", "#047857"],
          });
        }
      };
      document.head.appendChild(script);
    }
  };

  const handleClearTables = () => {
    setHasStarted(false);
    setPaymentCount(0);
    setRequestCount(0);

    setRightRequests([]);
    setLeftPayments([]);
    setHasSeenCollisionExplainer(false);
    setShowCollisionExplainer(false);
  };

  const awaitingCount = rightRequests.filter((r) => r.status === "awaiting_payment").length;
  const canSimulatePayment = awaitingCount > 0;
  const canCreateRequest = awaitingCount < 3;
  const hasContent = leftPayments.length > 0 || rightRequests.length > 0;

  return (
    <div className="relative" ref={demoContainerRef}>
      <div className="relative w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-8">
        {showDialog && !hasStarted && (
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl z-10 flex items-start justify-center p-4"
            onClick={handleStartDemo}
          >
            <div
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg p-4 md:p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'sticky',
                top: '135px'
              }}
            >
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Request Network: Identify Every Payment
                </h2>
                <div className="text-sm md:text-base lg:text-lg space-y-3">
                  <div className="flex items-start gap-3 text-left">
                    <XIcon className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-600 dark:text-red-400">
                      Traditional blockchain payments are anonymous and hard to reconcile.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <p className="text-green-600 dark:text-green-400">
                      Request Network adds identifiers that uniquely tie every payment to a request, making
                      reconciliation <strong>instant, automatic, and 100% accurate</strong>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={handleStartDemo} size="lg">
                  Start Demo
                </Button>
              </div>
            </div>
          </div>
        )}

        {showCollisionExplainer && (
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl z-20 flex items-start justify-center p-4"
            onClick={() => setShowCollisionExplainer(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg p-4 md:p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'sticky',
                top: '135px'
              }}
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <AlertCircleIcon className="h-6 w-6 md:h-8 md:w-8 text-red-600 dark:text-red-400" />
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Payment Collision Detected
                  </h2>
                </div>
                <div className="text-sm md:text-base lg:text-lg space-y-4 text-left">
                  <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <XIcon className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-700 dark:text-red-300 mb-1">On the Left:</p>
                        <p className="text-red-600 dark:text-red-400">
                          Two payments have the same amount and currency. Which payment belongs to which customer?
                          Manual review required.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-700 dark:text-green-300 mb-1">On the Right:</p>
                        <p className="text-green-600 dark:text-green-400">
                          Each payment is automatically matched to its correct request using onchain identifiers. No
                          ambiguity, no manual work.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={() => setShowCollisionExplainer(false)} size="lg">
                  Got it
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Identify Every Payment</h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            See the difference between anonymous payments and identified payments
          </p>
        </div>

        <div className="hidden lg:flex justify-center items-center gap-2 md:gap-4 mb-6 flex-wrap">
          <Button
            onClick={handleCreateRequest}
            size="lg"
            variant="outline"
            disabled={isProcessing || !canCreateRequest}
          >
            <SendIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Create Request
          </Button>

          <Button
            onClick={handleSimulatePayment}
            size="lg"
            disabled={isProcessing || !canSimulatePayment}
          >
            <SendIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            {isProcessing ? "Processing..." : "Simulate Payment"}
          </Button>

          <Button
            onClick={handleClearTables}
            variant="outline"
            size="lg"
            disabled={!hasContent}
          >
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Left side - Traditional Payments */}
          <div className="space-y-4">
            <div className="lg:hidden flex justify-center items-center gap-2 flex-wrap">
              <Button
                onClick={handleCreateRequest}
                size="lg"
                variant="outline"
                disabled={isProcessing || !canCreateRequest}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                Create Request
              </Button>

              <Button
                onClick={handleSimulatePayment}
                size="lg"
                disabled={isProcessing || !canSimulatePayment}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Simulate Payment"}
              </Button>

              <Button
                onClick={handleClearTables}
                variant="outline"
                size="lg"
                disabled={!hasContent}
              >
                Clear
              </Button>
            </div>

            <div className="border-2 border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/20 rounded-lg">
              <div className="p-4 pb-3 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-red-700 dark:text-red-300">
                    Traditional Blockchain Payments
                  </h3>
                  <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700 rounded-full px-3 py-1 w-fit">
                    <AlertCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-xs md:text-sm font-semibold text-red-700 dark:text-red-300">
                      Reconciled: {calculateLeftAccuracy()}
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Anonymous transactions without business context
                </p>
              </div>
              <div className="px-4 pb-4">
                <div ref={leftScrollRef} className="space-y-3 h-[300px] md:h-[388px] overflow-y-auto">
                  {leftPayments.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Click "Create Request" to begin</p>
                    </div>
                  ) : (
                    leftPayments.map((payment) => {
                      if (payment.isPlaceholder) {
                        return (
                          <div
                            key={payment.id}
                            className={`p-3 rounded border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs min-h-[88px] flex flex-col justify-center items-center transition-all duration-500 ${
                              payment.isNew ? "animate-in fade-in slide-in-from-top-2" : ""
                            }`}
                          >
                            <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Awaiting Payment</span>
                          </div>
                        );
                      }

                      const isCollision = payment.status === "payment_collision";

                      return (
                        <div
                          key={payment.id}
                          className={`p-3 rounded border text-xs min-h-[88px] flex flex-col transition-all duration-500 ${
                            payment.isNew ? "animate-in fade-in slide-in-from-top-2" : ""
                          } ${
                            isCollision
                              ? "border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-950/50"
                              : "border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-auto gap-2">
                            <div className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              {getCurrencyDisplay(payment.amount, payment.currency)}
                            </div>
                            {isCollision ? (
                              <Badge variant="destructive" className="text-[10px] md:text-xs shrink-0">
                                Needs Review
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] md:text-xs shrink-0">
                                Possibly Reconciled
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-end justify-between mt-2 gap-2 md:gap-4">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-0.5">From</span>
                              <p className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate">
                                {payment.from.slice(0, 10)}...{payment.from.slice(-8)}
                              </p>
                            </div>
                            <div className="flex flex-col items-start shrink-0">
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-0.5">Tx</span>
                              <a
                                href="#"
                                className="text-xs text-gray-600 dark:text-gray-300 font-mono hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1"
                                onClick={(e) => e.preventDefault()}
                              >
                                {payment.txHash.slice(0, 8)}...{payment.txHash.slice(-6)}
                                <ExternalLinkIcon />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Request Network Payments */}
          <div className="space-y-4">
            <div className="lg:hidden flex justify-center items-center gap-2 flex-wrap">
              <Button
                onClick={handleCreateRequest}
                size="lg"
                variant="outline"
                disabled={isProcessing || !canCreateRequest}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                Create Request
              </Button>

              <Button
                onClick={handleSimulatePayment}
                size="lg"
                disabled={isProcessing || !canSimulatePayment}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Simulate Payment"}
              </Button>

              <Button
                onClick={handleClearTables}
                variant="outline"
                size="lg"
                disabled={!hasContent}
              >
                Clear
              </Button>
            </div>

            <div
              ref={rightCardRef}
              className="border-2 border-green-300 dark:border-green-700 bg-green-50/30 dark:bg-green-950/20 rounded-lg"
            >
              <div className="p-4 pb-3 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-green-700 dark:text-green-300">
                    Request Network Payments
                  </h3>
                  <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-700 rounded-full px-3 py-1 w-fit">
                    <CheckCircle2Icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs md:text-sm font-semibold text-green-700 dark:text-green-300">
                      Reconciled: 100%
                    </span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Payments with unique IDs for instant reconciliation
                </p>
              </div>
              <div className="px-4 pb-4">
                <div ref={rightScrollRef} className="space-y-3 h-[300px] md:h-[388px] overflow-y-auto">
                  {rightRequests.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Click "Create Request" to begin</p>
                    </div>
                  ) : (
                    rightRequests.map((request) => {
                      const isPaid = request.status === "paid_reconciled";

                      return (
                        <div
                          key={request.id}
                          className={`p-3 rounded border text-xs min-h-[88px] flex flex-col transition-all duration-500 ${
                            request.isNew ? "animate-in fade-in slide-in-from-top-2" : ""
                          } ${
                            isPaid
                              ? "border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-950/50"
                              : "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-auto gap-2">
                            <div className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              {getCurrencyDisplay(request.amount, request.currency)}
                            </div>
                            {isPaid ? (
                              <Badge variant="success" className="text-[10px] md:text-xs shrink-0">
                                Paid, Reconciled
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-[10px] md:text-xs shrink-0">
                                Awaiting Payment
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-end justify-between mt-2 gap-2 md:gap-4">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-0.5">Customer</span>
                              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{request.customer}</p>
                            </div>
                            {isPaid && request.txHash && (
                              <div className="flex flex-col items-start shrink-0">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase mb-0.5">Tx</span>
                                <a
                                  href="#"
                                  className="text-xs text-gray-600 dark:text-gray-300 font-mono hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  {request.txHash.slice(0, 8)}...{request.txHash.slice(-6)}
                                  <ExternalLinkIcon />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }
        /* Hide scrollbar but keep functionality */
        .overflow-y-auto::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};
