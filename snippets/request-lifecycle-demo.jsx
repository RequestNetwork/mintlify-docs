import { useState } from 'react';

export const RequestLifecycleDemo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [requestData, setRequestData] = useState({
    amount: '500',
    currency: 'USDC',
    recipient: '0x742d35Cc6634C0532925a3b844Bc9e7E7a476dbf',
    note: 'Payment for services',
    requestId: null,
    txHash: null,
    paidAt: null,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  // Icon components
  const SendIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );

  const CopyIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  const CheckIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  const ExternalLinkIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );

  const WalletIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
    </svg>
  );

  const FileTextIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <line x1="12" y1="9" x2="8" y2="9"></line>
    </svg>
  );

  const ClockIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const RefreshIcon = ({ className = "h-4 w-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  );

  const CryptoIcon = ({ currency, className = "w-5 h-5" }) => {
    const iconMap = {
      USDC: "/logo/icons/usdc.png",
      USDT: "/logo/icons/usdt.png",
      DAI: "/logo/icons/dai.png",
    };

    const iconSrc = iconMap[currency];
    if (!iconSrc) return null;

    return <img src={iconSrc} alt={`${currency} icon`} className={className} />;
  };

  // Generate request ID
  const generateRequestId = () => {
    const chars = '0123456789abcdef';
    let id = '01';
    for (let i = 0; i < 62; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  // Generate transaction hash
  const generateTxHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  };

  // Handle create request
  const handleCreateRequest = () => {
    setIsCreating(true);
    setTimeout(() => {
      const newRequestId = generateRequestId();
      setRequestData(prev => ({
        ...prev,
        requestId: newRequestId,
      }));
      setCurrentStep(2);
      setIsCreating(false);
    }, 800);
  };

  // Handle pay request
  const handlePayRequest = () => {
    setIsPaying(true);
    const txHash = generateTxHash();
    setRequestData(prev => ({
      ...prev,
      txHash: txHash,
    }));
    setCurrentStep(3);
    setTimeout(() => {
      setRequestData(prev => ({
        ...prev,
        paidAt: new Date(),
      }));
      setCurrentStep(4);
      setIsPaying(false);
    }, 3000);
  };

  // Handle copy functions
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  // Handle reset
  const handleReset = () => {
    setCurrentStep(1);
    setRequestData({
      amount: '500',
      currency: 'USDC',
      recipient: '0x742d35Cc6634C0532925a3b844Bc9e7E7a476dbf',
      note: 'Payment for services',
      requestId: null,
      txHash: null,
      paidAt: null,
    });
    setCopiedId(false);
    setCopiedLink(false);
    setCopiedTx(false);
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  // Truncate address/hash
  const truncate = (str, start = 6, end = 4) => {
    if (!str) return '';
    return `${str.substring(0, start)}...${str.substring(str.length - end)}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-6 md:mb-8">
        <div className="flex items-center gap-2 md:gap-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-300
                    ${currentStep >= step 
                      ? 'border-2' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600'
                    }
                  `}
                  style={currentStep >= step ? {
                    backgroundColor: '#01B089',
                    borderColor: '#01B089',
                    color: 'white'
                  } : {}}
                >
                  {currentStep > step ? <CheckIcon className="h-4 w-4 md:h-5 md:w-5" /> : step}
                </div>
                <span className={`
                  text-xs md:text-sm mt-1 font-medium hidden md:block
                  ${currentStep >= step 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {step === 1 ? 'Create' : step === 2 ? 'Share' : step === 3 ? 'Pay' : 'Track'}
                </span>
              </div>
              {step < 4 && (
                <div 
                  className={`
                    w-8 md:w-16 h-0.5 transition-all duration-300
                    ${currentStep <= step 
                      ? 'bg-gray-300 dark:bg-gray-600' 
                      : ''
                    }
                  `}
                  style={currentStep > step ? {
                    backgroundColor: '#01B089'
                  } : {}}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main demo area */}
      <div 
        style={{
          background: 'linear-gradient(to bottom, rgba(1, 176, 137, 0.04), rgba(1, 176, 137, 0.08))',
          borderRadius: '0.75rem',
          border: '1px solid rgba(1, 176, 137, 0.2)',
          padding: '2rem',
          marginBottom: '1.5rem',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center'
        }}
        className="dark:bg-gradient-to-b dark:from-[#002419] dark:to-[#003326] dark:border-[rgba(1,176,137,0.4)]"
      >
        
        {/* Step 1: Create */}
        {currentStep === 1 && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary-200 dark:bg-primary-900 rounded-full mb-4">
                <FileTextIcon className="h-6 w-6 md:h-8 md:w-8 text-primary-700 dark:text-primary-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Step 1: Create Request
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Enter payment details to generate your request
              </p>
            </div>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={requestData.amount}
                  onChange={(e) => setRequestData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={requestData.currency}
                  onChange={(e) => setRequestData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                  <option value="DAI">DAI</option>
                </select>
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={requestData.recipient}
                  onChange={(e) => setRequestData(prev => ({ ...prev, recipient: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  placeholder="0x..."
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={requestData.note}
                  onChange={(e) => setRequestData(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Payment for services"
                />
              </div>

              {/* Create button */}
              <button
                onClick={handleCreateRequest}
                disabled={isCreating || !requestData.amount || !requestData.recipient}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white disabled:text-gray-800 dark:disabled:text-gray-400 disabled:cursor-not-allowed font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border-2 border-primary-700 dark:border-primary-500 disabled:border-gray-300 dark:disabled:border-gray-600"
                style={{ backgroundColor: isCreating || !requestData.amount || !requestData.recipient ? undefined : '#01B089' }}
              >
                {isCreating ? (
                  <>
                    <RefreshIcon className="h-5 w-5 animate-spin" />
                    Creating Request...
                  </>
                ) : (
                  <>
                    <SendIcon className="h-5 w-5" />
                    Create Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Share */}
        {currentStep === 2 && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <CheckIcon className="h-6 w-6 md:h-8 md:w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Step 2: Request Created!
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Share this request ID with your payer
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
              {/* Request ID */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  REQUEST ID
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600">
                  <code className="flex-1 text-sm font-mono text-primary-600 dark:text-primary-400 break-all">
                    {requestData.requestId}
                  </code>
                  <button
                    onClick={() => handleCopy(requestData.requestId, 'id')}
                    className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Copy Request ID"
                  >
                    {copiedId ? (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <CopyIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                    <CryptoIcon currency={requestData.currency} className="w-4 h-4" />
                    {requestData.amount} {requestData.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Recipient</span>
                  <code className="font-mono text-xs text-gray-900 dark:text-gray-100">
                    {truncate(requestData.recipient)}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                    <ClockIcon className="h-3 w-3" />
                    Pending Payment
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => handleCopy(`https://pay.request.network/${requestData.requestId}`, 'link')}
                className="w-full px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {copiedLink ? (
                  <>
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    Payment Link Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-5 w-5" />
                    Copy Payment Link
                  </>
                )}
              </button>

              <button
                onClick={handlePayRequest}
                disabled={isPaying}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border-2 border-primary-700 dark:border-primary-500"
                style={{ backgroundColor: isPaying ? undefined : '#01B089' }}
              >
                <WalletIcon className="h-5 w-5" />
                {isPaying ? 'Processing...' : 'Simulate Payment'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pay (Processing) */}
        {currentStep === 3 && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4 animate-pulse">
                <WalletIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Step 3: Processing Payment
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Simulating payment transaction...
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-4">
                  <RefreshIcon className="h-6 w-6 animate-spin" />
                  <span className="font-medium">Confirming transaction...</span>
                </div>
              </div>

              {/* Request ID */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Request ID
                </label>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <code className="flex-1 text-xs font-mono text-gray-900 dark:text-gray-100 truncate">
                    {requestData.requestId}
                  </code>
                  <button
                    onClick={() => handleCopy(requestData.requestId, 'id')}
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Copy Request ID"
                  >
                    {copiedId ? (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <CopyIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    title="View on Request Scan (demo only - link disabled)"
                  >
                    <ExternalLinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Transaction Hash */}
              {requestData.txHash && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Transaction Hash
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <code className="flex-1 text-xs font-mono text-gray-900 dark:text-gray-100 truncate">
                      {requestData.txHash}
                    </code>
                    <button
                      onClick={() => handleCopy(requestData.txHash, 'tx')}
                      className="flex-shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Copy Transaction Hash"
                    >
                      {copiedTx ? (
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <CopyIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="flex-shrink-0 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Block explorer (demo only - link disabled)"
                    >
                      <ExternalLinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Track (Paid) */}
        {currentStep === 4 && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <CheckIcon className="h-6 w-6 md:h-8 md:w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Step 4: Payment Complete! 🎉
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Your request has been paid and recorded on-chain
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
              {/* Request ID */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  REQUEST ID
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600">
                  <code className="flex-1 text-sm font-mono text-primary-600 dark:text-primary-400 break-all">
                    {requestData.requestId}
                  </code>
                  <button
                    onClick={() => handleCopy(requestData.requestId, 'id')}
                    className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Copy Request ID"
                  >
                    {copiedId ? (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <CopyIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  STATUS
                </label>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg font-medium">
                  <CheckIcon className="h-4 w-4" />
                  Paid
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                  <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                    <CryptoIcon currency={requestData.currency} className="w-4 h-4" />
                    {requestData.amount} {requestData.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Paid To</span>
                  <code className="font-mono text-xs text-gray-900 dark:text-gray-100">
                    {truncate(requestData.recipient)}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transaction</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs text-gray-900 dark:text-gray-100">
                      {truncate(requestData.txHash, 6, 4)}
                    </code>
                    <button
                      onClick={() => handleCopy(requestData.txHash, 'tx')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Copy Transaction Hash"
                    >
                      {copiedTx ? (
                        <CheckIcon className="h-3 w-3 text-green-600" />
                      ) : (
                        <CopyIcon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Paid At</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatTimeAgo(requestData.paidAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={(e) => e.preventDefault()}
                className="w-full px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLinkIcon className="h-5 w-5" />
                View on Block Explorer
              </button>

              <button
                onClick={handleReset}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border-2 border-primary-700 dark:border-primary-500"
                style={{ backgroundColor: '#01B089' }}
              >
                <RefreshIcon className="h-5 w-5" />
                Try Another Request
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Key concept callout */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 md:p-6 shadow-lg">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">💡</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              The Power of Request IDs
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Every Request Network payment gets a unique ID stored permanently on-chain. This ID connects the payment to its business context (amount, recipient, reason) with cryptographic certainty—enabling 100% automated reconciliation without manual matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
