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

  const UserIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const WalletIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
    </svg>
  );

  const TxIcon = ({ className = "h-3 w-3" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
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

  // Tooltip component
  const Tooltip = ({ children, content }) => {
    const [show, setShow] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0, placement: 'top' });
    const tooltipRef = React.useRef(null);
    const triggerRef = React.useRef(null);
    
    React.useEffect(() => {
      if (show && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;
        
        const placement = (spaceAbove < 100 && spaceBelow > spaceAbove) ? 'bottom' : 'top';
        
        const left = rect.left + rect.width / 2;
        const top = placement === 'top' 
          ? rect.top - 8  // Position above trigger with gap
          : rect.bottom + 8;  // Position below trigger with gap
        
        setPosition({ top, left, placement });
      }
    }, [show]);
    
    return (
      <div className="relative inline-block">
        <div 
          ref={triggerRef}
          onMouseEnter={() => setShow(true)} 
          onMouseLeave={() => setShow(false)}
        >
          {children}
        </div>
        {show && (
          <div 
            ref={tooltipRef}
            className={`fixed transform -translate-x-1/2 px-3 py-2 bg-gray-500 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-[100] shadow-lg ${
              position.placement === 'top' ? '-translate-y-full' : ''
            }`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`
            }}
          >
            {content}
            <div className={`absolute left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
              position.placement === 'top' 
                ? 'top-full border-t-gray-500 dark:border-t-gray-700' 
                : 'bottom-full border-b-gray-500 dark:border-b-gray-700'
            }`} />
          </div>
        )}
      </div>
    );
  };

  // Simple Button component
  const Button = ({ children, onClick, disabled, variant = "default", size = "md", className = "", pulse = false }) => {
    const variantClasses = {
      default: "bg-primary-600 hover:bg-primary-700 text-white",
      outline: "bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    };

    const sizeClasses = {
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };
    
    const pulseAnimation = variant === 'outline' ? 'animate-ring-pulse-outline' : 'animate-ring-pulse';

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${pulse ? pulseAnimation : ''} ${className}`}
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
          @keyframes ringPulse {
            0%, 100% { 
              box-shadow: 0 0 0 0 rgba(1, 176, 137, 0.6); 
            }
            50% { 
              box-shadow: 0 0 0 12px rgba(1, 176, 137, 0); 
            }
          }
          @keyframes ringPulseOutline {
            0%, 100% { 
              box-shadow: 0 0 0 0 rgba(107, 114, 128, 0.4); 
            }
            50% { 
              box-shadow: 0 0 0 12px rgba(107, 114, 128, 0); 
            }
          }
          .animate-ring-pulse {
            animation: ringPulse 1.5s ease-out infinite;
          }
          .animate-ring-pulse-outline {
            animation: ringPulseOutline 1.5s ease-out infinite;
          }
        `}</style>
      </button>
    );
  };

  // Component state
  const rightCardRef = useRef(null);
  const leftCardRef = useRef(null);
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
  const [isShaking, setIsShaking] = useState(false);
  const [hasPrePopulated, setHasPrePopulated] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(0);

  // Auto-scroll to top when needed
  useEffect(() => {
    if (shouldScrollToTop > 0 && leftScrollRef.current && rightScrollRef.current) {
      // Use instant scroll to ensure it works
      setTimeout(() => {
        if (leftScrollRef.current && rightScrollRef.current) {
          leftScrollRef.current.scrollTop = 0;
          rightScrollRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [shouldScrollToTop]);

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
    
    // Only pre-populate on first start
    if (!hasPrePopulated) {
      setHasPrePopulated(true);
      
      // For initial auto-play: collision always happens on 3rd payment (indices 1 and 2)
      const collisionPair = [1, 2];
      
      // Generate collision amount that will be shared by 2nd and 3rd requests
      const collisionAmountData = generateAmount();
      const collisionAmount = collisionAmountData.amount;
      const collisionCurrency = collisionAmountData.currency;
      
      // Get 3 different customers for the 3 requests
      const shuffledCustomers = [...CUSTOMER_DATA].sort(() => Math.random() - 0.5);
      
      // Create 3 requests
      const newRequests = [];
      const newPlaceholders = [];
      
      for (let i = 0; i < 3; i++) {
        const timestamp = new Date(Date.now() + i); // Slight offset for unique timestamps
        // Generate a realistic Request ID (64 character hex string like the example)
        const id = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        
        // Determine if this request should be part of the collision pair
        const isCollisionRequest = collisionPair.includes(i);
        
        // Use collision amount for collision pair, random amount for the first request
        let amount, currency;
        if (isCollisionRequest) {
          amount = collisionAmount;
          currency = collisionCurrency;
        } else {
          const uniqueAmount = generateAmount();
          amount = uniqueAmount.amount;
          currency = uniqueAmount.currency;
        }
        
        const newRequest = {
          id,
          amount,
          currency,
          customer: shuffledCustomers[i].name,
          customerAddress: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
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
        
        newRequests.push(newRequest);
        newPlaceholders.push(placeholder);
      }
      
      setRightRequests(newRequests);
      setLeftPayments(newPlaceholders);
      setRequestCount(3);
      
      // Set auto-playing state and start auto-simulation
      setIsAutoPlaying(true);
      setTimeout(() => {
        autoSimulatePayments(newRequests);
      }, 1500); // 1.5s delay before first payment
    }
  };

  const autoSimulatePayments = async (requests) => {
    // Simulate payments for all three requests with delays between each
    for (let i = 0; i < requests.length; i++) {
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay between payments
      }
      await simulatePaymentForRequest(requests[i]);
    }
  };

  const simulatePaymentForRequest = async (selectedRequest) => {
    return new Promise((resolve) => {
      const paymentAmount = selectedRequest.amount;
      const paymentCurrency = selectedRequest.currency;

      // Use the customer's address from the request (for consistency between left and right)
      const randomAddress = selectedRequest.customerAddress;
      // Generate valid 64-character tx hash (32 bytes in hex)
      const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      setLeftPayments((prev) => {
        const matchingPayments = prev.filter(
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

        const placeholderIndex = prev.findIndex((p) => p.isPlaceholder && p.requestId === selectedRequest.id);

        if (placeholderIndex !== -1) {
          const updated = [...prev];
          updated[placeholderIndex] = newPayment;

          if (hasCollision) {
            const collisionUpdated = updated.map((p) =>
              !p.isPlaceholder && p.amount === paymentAmount && p.currency === paymentCurrency
                ? { ...p, status: "payment_collision" }
                : p,
            );
            
            // Trigger collision effects
            setTimeout(() => {
              setIsShaking(true);
              setTimeout(() => setIsShaking(false), 500);
              
              if (!hasSeenCollisionExplainer) {
                setTimeout(() => {
                  setShowCollisionExplainer(true);
                  setHasSeenCollisionExplainer(true);
                  setIsAutoPlaying(false); // Re-enable buttons when dialog appears
                }, 1500); // Increased delay to 1.5s after shake
              }
            }, 100);
            
            return collisionUpdated;
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

      // Trigger scroll to top via useEffect
      setShouldScrollToTop(prev => prev + 1);

      setTimeout(() => {
        triggerConfetti();
        resolve();
      }, 100);
    });
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
      // Generate a realistic Request ID (64 character hex string)
      const id = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const newRequest = {
        id,
        amount,
        currency,
        customer: randomCustomer.name,
        customerAddress: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
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

    // Trigger scroll to top via useEffect
    setShouldScrollToTop(prev => prev + 1);
  };

  const calculateLeftAccuracy = () => {
    const nonPlaceholderPayments = leftPayments.filter((p) => !p.isPlaceholder);
    if (nonPlaceholderPayments.length === 0) return "N/A";

    const reconciledCount = nonPlaceholderPayments.filter((p) => p.status === "possibly_reconciled").length;
    const percentage = Math.round((reconciledCount / nonPlaceholderPayments.length) * 100);
    return `${percentage}%`;
  };

  // Helper function to count left-side payment matches (excluding placeholders)
  const getLeftSideMatchCount = (amount, currency) => {
    return leftPayments.filter(p => 
      !p.isPlaceholder && 
      p.amount === amount && 
      p.currency === currency
    ).length;
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

    // Trigger scroll to top via useEffect
    setShouldScrollToTop(prev => prev + 1);

    setTimeout(() => {
      triggerConfetti();
    }, 100);

    if (hasCollision) {
      // Trigger shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      // Show collision explainer dialog only on first collision (after shake completes)
      if (!hasSeenCollisionExplainer) {
        setTimeout(() => {
          setShowCollisionExplainer(true);
          setHasSeenCollisionExplainer(true);
        }, 600); // After shake animation (500ms + 100ms buffer)
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
    setHasPrePopulated(false);
    setIsAutoPlaying(false);

    setRightRequests([]);
    setLeftPayments([]);
    setHasSeenCollisionExplainer(false);
    setShowCollisionExplainer(false);
  };

  const awaitingCount = rightRequests.filter((r) => r.status === "awaiting_payment").length;
  const canSimulatePayment = awaitingCount > 0 && !isAutoPlaying;
  const canCreateRequest = awaitingCount < 3 && !isAutoPlaying;
  const hasContent = leftPayments.length > 0 || rightRequests.length > 0;
  const shouldCreateRequestPulse = rightRequests.length === 0 || rightRequests.every(r => r.status === 'paid_reconciled');

  return (
    <div className="relative" ref={demoContainerRef}>
      <div className="relative w-full bg-gray-50 dark:bg-[#002920] rounded-xl border border-gray-200 dark:border-[#014d3d] shadow-lg p-4 md:p-8">
        {showDialog && !hasStarted && (
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl z-10 flex items-start justify-center p-4"
            onClick={handleStartDemo}
          >
            <div
              className="bg-white dark:bg-[#002920] border-2 border-gray-200 dark:border-[#014d3d] shadow-2xl rounded-lg p-4 md:p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'sticky',
                top: '150px'
              }}
            >
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                  Identify Every Payment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default">
                    <div className="flex items-start gap-3">
                      <XIcon className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm md:text-base text-red-700 dark:text-red-300 mb-2">Anonymous Transactions</h3>
                        <p className="text-xs md:text-sm text-red-600 dark:text-red-400">
                          Traditional blockchain payments lack business context or payment identifiers.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default">
                    <div className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm md:text-base text-green-700 dark:text-green-300 mb-2">Unique Identifiers</h3>
                        <p className="text-xs md:text-sm text-green-600 dark:text-green-400">
                          Request Network adds unique identifiers to every payment, enabling instant, automatic, and 100% automated reconciliation.
                        </p>
                      </div>
                    </div>
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
              className="bg-white dark:bg-[#002920] border-2 border-gray-200 dark:border-[#014d3d] shadow-2xl rounded-lg p-4 md:p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'sticky',
                top: '150px'
              }}
            >
                  <div className="mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                      Payment Collision Detected
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                      <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default">
                        <div className="flex items-start gap-3">
                          <XIcon className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-sm md:text-base text-red-700 dark:text-red-300 mb-2">The Problem</h4>
                            <p className="text-xs md:text-sm text-red-600 dark:text-red-400">
                              Two payments have the same amount and currency. Which payment belongs to which customer?
                              Manual review required.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default">
                        <div className="flex items-start gap-3">
                          <CheckIcon className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-sm md:text-base text-green-700 dark:text-green-300 mb-2">Request Network Solution</h4>
                            <p className="text-xs md:text-sm text-green-600 dark:text-green-400">
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

        <div className="hidden lg:flex justify-center items-center gap-2 md:gap-4 mb-6 flex-wrap">
          <Button
            onClick={handleCreateRequest}
            size="lg"
            variant="outline"
            disabled={isProcessing || !canCreateRequest}
            pulse={shouldCreateRequestPulse && canCreateRequest && !isProcessing}
          >
            <SendIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Create Request
          </Button>

          <Button
            onClick={handleSimulatePayment}
            size="lg"
            disabled={isProcessing || !canSimulatePayment}
            pulse={canSimulatePayment && !isProcessing}
          >
            <SendIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            {isProcessing ? "Processing..." : "Simulate Payment"}
          </Button>

          <Button
            onClick={handleClearTables}
            variant="outline"
            size="lg"
            disabled={!hasContent || isAutoPlaying}
          >
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Left side - Traditional Payments */}
          <div ref={leftCardRef} className="space-y-4">
            <div className="lg:hidden flex justify-center items-center gap-2 flex-wrap">
              <Button
                onClick={handleCreateRequest}
                size="lg"
                variant="outline"
                disabled={isProcessing || !canCreateRequest}
                pulse={shouldCreateRequestPulse && canCreateRequest && !isProcessing}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                Create Request
              </Button>

              <Button
                onClick={handleSimulatePayment}
                size="lg"
                disabled={isProcessing || !canSimulatePayment}
                pulse={canSimulatePayment && !isProcessing}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Simulate Payment"}
              </Button>

              <Button
                onClick={handleClearTables}
                variant="outline"
                size="lg"
                disabled={!hasContent || isAutoPlaying}
              >
                Clear
              </Button>
            </div>

            <div className={`border-2 border-red-300/60 dark:border-red-800/60 bg-red-50/20 dark:bg-red-950/10 rounded-lg ${isShaking ? 'animate-shake' : ''}`}>
              <div className="p-4 pb-3 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-red-700 dark:text-red-400 sm:min-h-[64px]">
                    Traditional Blockchain Payments
                  </h3>
                  <Tooltip content="Manual reconciliation required - payments lack identifiers to link them to specific customers">
                    <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700 rounded-full px-3 py-1 w-fit shrink-0 cursor-help">
                      <AlertCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                      <span className="text-xs md:text-sm font-semibold text-red-700 dark:text-red-300 whitespace-nowrap">
                        Reconciled: {calculateLeftAccuracy()}
                      </span>
                    </div>
                  </Tooltip>
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Anonymous transactions without business context
                </p>
              </div>
              <div className="px-4 pb-4">
                <div ref={leftScrollRef} className="space-y-3 h-[300px] md:h-[388px] overflow-y-auto no-scrollbar">
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
                      const matchCount = getLeftSideMatchCount(payment.amount, payment.currency);
                      const showWarning = matchCount >= 2;

                      return (
                        <div
                          key={payment.id}
                          className={`p-3 rounded border text-xs min-h-[88px] flex flex-col transition-all duration-200 ${
                            payment.isNew ? "animate-in fade-in slide-in-from-top-2" : ""
                          } ${
                            isCollision
                              ? "border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-950/50"
                              : "border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-auto gap-2">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100">
                                {getCurrencyDisplay(payment.amount, payment.currency)}
                              </div>
                              {showWarning && (
                                <span className="text-yellow-600 dark:text-yellow-500 text-[10px] md:text-xs flex items-center gap-0.5 whitespace-nowrap">
                                  ⚠️ {matchCount} matches
                                </span>
                              )}
                            </div>
                            {isCollision ? (
                              <Tooltip content="Multiple payments with same amount and currency detected - manual review required">
                                <Badge className="text-[10px] md:text-xs shrink-0 bg-red-600 text-white dark:bg-red-700 dark:text-white border-0">
                                  Needs Review
                                </Badge>
                              </Tooltip>
                            ) : (
                              <Tooltip content="Payment likely matches an invoice or receipt, but requires manual verification">
                                <Badge variant="secondary" className="text-[10px] md:text-xs shrink-0">
                                  Possibly Reconciled
                                </Badge>
                              </Tooltip>
                            )}
                          </div>
                          <div className="flex items-end justify-between mt-2 gap-2 md:gap-4">
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1 mb-0.5">
                                <WalletIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">From</span>
                              </div>
                              <Tooltip content={payment.from}>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate cursor-help">
                                  {payment.from.slice(0, 10)}...{payment.from.slice(-8)}
                                </p>
                              </Tooltip>
                            </div>
                            <div className="flex flex-col items-start shrink-0">
                              <div className="flex items-center gap-1 mb-0.5">
                                <TxIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Tx ID</span>
                              </div>
                              <Tooltip content={payment.txHash}>
                                <a
                                  href="#"
                                  className="text-xs text-gray-600 dark:text-gray-300 font-mono hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1 cursor-help"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  {payment.txHash.slice(0, 8)}...{payment.txHash.slice(-6)}
                                  <ExternalLinkIcon />
                                </a>
                              </Tooltip>
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
                pulse={shouldCreateRequestPulse && canCreateRequest && !isProcessing}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                Create Request
              </Button>

              <Button
                onClick={handleSimulatePayment}
                size="lg"
                disabled={isProcessing || !canSimulatePayment}
                pulse={canSimulatePayment && !isProcessing}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Simulate Payment"}
              </Button>

              <Button
                onClick={handleClearTables}
                variant="outline"
                size="lg"
                disabled={!hasContent || isAutoPlaying}
              >
                Clear
              </Button>
            </div>

            <div
              ref={rightCardRef}
              className="border-2 border-green-400 dark:border-green-600 bg-green-50/40 dark:bg-green-900/30 rounded-lg"
            >
              <div className="p-4 pb-3 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-green-700 dark:text-green-300 sm:min-h-[64px]">
                    Request Network Payments
                  </h3>
                  <Tooltip content="100% automated reconciliation - Request IDs uniquely identify every payment">
                    <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-700 rounded-full px-3 py-1 w-fit shrink-0 cursor-help">
                      <CheckCircle2Icon className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                      <span className="text-xs md:text-sm font-semibold text-green-700 dark:text-green-300 whitespace-nowrap">
                        Reconciled: 100%
                      </span>
                    </div>
                  </Tooltip>
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Payments with unique IDs for instant reconciliation
                </p>
              </div>
              <div className="px-4 pb-4">
                <div ref={rightScrollRef} className="space-y-3 h-[300px] md:h-[388px] overflow-y-auto no-scrollbar">
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
                          className={`p-3 rounded border text-xs min-h-[88px] flex flex-col transition-all duration-200 ${
                            request.isNew ? "animate-in fade-in slide-in-from-top-2" : ""
                          } ${
                            isPaid
                              ? "border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-950/50"
                              : "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100">
                              {getCurrencyDisplay(request.amount, request.currency)}
                            </div>
                            {isPaid ? (
                              <Tooltip content="Payment received and automatically reconciled with a request">
                                <Badge variant="success" className="text-[10px] md:text-xs shrink-0">
                                  Reconciled
                                </Badge>
                              </Tooltip>
                            ) : (
                              <Badge variant="default" className="text-[10px] md:text-xs shrink-0">
                                Awaiting Payment
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-end justify-between mt-auto gap-1 md:gap-2 lg:gap-4">
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-1 mb-0.5">
                                <UserIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Customer</span>
                              </div>
                              <Tooltip content={request.customerAddress}>
                                <p className="text-xs text-gray-600 dark:text-gray-300 truncate cursor-help">{request.customer}</p>
                              </Tooltip>
                            </div>
                            <div className="hidden md:flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-1 mb-0.5">
                                <svg className="h-3 w-3 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Request ID</span>
                              </div>
                              <Tooltip content={request.id}>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate cursor-help">
                                  {request.id.slice(0, 10)}...{request.id.slice(-6)}
                                </p>
                              </Tooltip>
                            </div>
                            <div className="flex flex-col items-start shrink-0">
                              {isPaid && request.txHash ? (
                                <>
                                  <div className="flex items-center gap-1 mb-0.5">
                                    <TxIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Tx ID</span>
                                  </div>
                                  <Tooltip content={request.txHash}>
                                    <a
                                      href="#"
                                      className="text-xs text-gray-600 dark:text-gray-300 font-mono hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1 cursor-help"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      {request.txHash.slice(0, 8)}...{request.txHash.slice(-6)}
                                      <ExternalLinkIcon />
                                    </a>
                                  </Tooltip>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-1 mb-0.5 opacity-0">
                                    <TxIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Tx ID</span>
                                  </div>
                                  <span className="text-xs text-gray-600 dark:text-gray-300 font-mono opacity-0 flex items-center gap-1">
                                    0x000000...000000
                                    <ExternalLinkIcon />
                                  </span>
                                </>
                              )}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        /* Hide scrollbar but keep functionality */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari, Brave, and other WebKit browsers */
        }
      `}</style>
    </div>
  );
};
