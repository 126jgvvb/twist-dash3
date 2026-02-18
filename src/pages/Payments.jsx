import { useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import { ThemeToggle } from '../components/ThemeToggle';
import { Footer } from '../components/footer';
import { paymentsNetworkObject } from './paymentsNetwork';

export const Payments = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [payments, setPayments] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [webhookLogs, setWebhookLogs] = useState([]);
    const [iotecTransactions, setIotecTransactions] = useState([]);
    const [platformWalletBalance, setPlatformWalletBalance] = useState(null);
    const [platformRevenue, setPlatformRevenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transferModal, setTransferModal] = useState({
        isOpen: false,
        targetWallet: null,
        amount: '',
    });
    // IOTEC Modals
    const [collectModal, setCollectModal] = useState({
        isOpen: false,
        amount: '',
        payer: '',
        walletId: '',
        payerNote: '',
    });
    const [mobileMoneyModal, setMobileMoneyModal] = useState({
        isOpen: false,
        amount: '',
        phoneNumber: '',
        reference: '',
    });
    const [bankTransferModal, setBankTransferModal] = useState({
        isOpen: false,
        amount: '',
        accountNumber: '',
        bankName: '',
        reference: '',
    });
    const [processingAction, setProcessingAction] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [searchPhone, setSearchPhone] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    dashboard,
                    trans,
                    walletData,
                    paymentData,
                    withdrawalData,
                    webhookData,
                    iotecTrans,
                    walletBalance,
                    revenueData
                ] = await Promise.all([
                    paymentsNetworkObject.getDashboardData(),
                    paymentsNetworkObject.getRecentTransactions(),
                    paymentsNetworkObject.getWallets(),
                    paymentsNetworkObject.getRecentPayments(),
                    paymentsNetworkObject.getRecentWithdrawals(),
                    paymentsNetworkObject.getWebhookLogs(),
                    paymentsNetworkObject.getIotecTransactions(),
                    paymentsNetworkObject.getWalletBalance(),
                    paymentsNetworkObject.getPlatformRevenue()
                ]);

                setDashboardData(dashboard);
                setTransactions(trans || []);
                setWallets(walletData || []);
                setPayments(paymentData || []);
                setWithdrawals(withdrawalData || []);
                setWebhookLogs(webhookData || []);
                setIotecTransactions(iotecTrans || []);
                setPlatformWalletBalance(walletBalance);
                setPlatformRevenue(revenueData);
            } catch (error) {
                console.error('Error fetching payments data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteWallet = async (walletId) => {
        if (window.confirm('Are you sure you want to delete this wallet?')) {
            const success = await paymentsNetworkObject.deleteWallet(walletId);
            if (success) {
                setWallets(wallets.filter(item => item.wallet.id !== walletId));
            }
        }
    };

    const handleFreezeWallet = async (walletId) => {
        const updatedWallet = await paymentsNetworkObject.freezeWallet(walletId);
        if (updatedWallet) {
            setWallets(wallets.map(item => 
                item.wallet.id === walletId ? { ...item, wallet: updatedWallet } : item
            ));
        }
    };

    const handleUnfreezeWallet = async (walletId) => {
        const updatedWallet = await paymentsNetworkObject.unfreezeWallet(walletId);
        if (updatedWallet) {
            setWallets(wallets.map(item => 
                item.wallet.id === walletId ? { ...item, wallet: updatedWallet } : item
            ));
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!transferModal.targetWallet) return;

        const amount = parseFloat(transferModal.amount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid positive amount');
            return;
        }

        const success = await paymentsNetworkObject.transferFunds(
            'main-wallet-id', // Replace with actual main wallet ID
            transferModal.targetWallet.id,
            amount
        );

        if (success) {
            setWallets(wallets.map(item => {
                if (item.wallet.id === transferModal.targetWallet.id) {
                    return {
                        ...item,
                        wallet: {
                            ...item.wallet,
                            balance: parseFloat(item.wallet.balance) + amount
                        }
                    };
                }
                return item;
            }));

            setTransferModal({
                isOpen: false,
                targetWallet: null,
                amount: '',
            });
        }
    };

    // IOTEC Handlers
    const handleCollectFunds = async (e) => {
        e.preventDefault();
        setProcessingAction(true);
        try {
            const result = await paymentsNetworkObject.collectFunds({
                amount: parseFloat(collectModal.amount),
                payer: collectModal.payer,
                walletId: collectModal.walletId,
                payerNote: collectModal.payerNote,
            });
            
            if (result) {
                alert(`Collection initiated successfully! Transaction ID: ${result.transactionId || 'N/A'}`);
                setCollectModal({ isOpen: false, amount: '', payer: '', walletId: '', payerNote: '' });
                // Refresh transactions
                const newTrans = await paymentsNetworkObject.getIotecTransactions();
                setIotecTransactions(newTrans || []);
            } else {
                alert('Failed to initiate collection');
            }
        } catch (error) {
            console.error('Error collecting funds:', error);
            alert('Error initiating collection');
        } finally {
            setProcessingAction(false);
        }
    };

    const handleMobileMoneyTransfer = async (e) => {
        e.preventDefault();
        setProcessingAction(true);
        try {
            const result = await paymentsNetworkObject.mobileMoneyTransfer({
                amount: parseFloat(mobileMoneyModal.amount),
                phoneNumber: mobileMoneyModal.phoneNumber,
                reference: mobileMoneyModal.reference || `momo-${Date.now()}`,
            });
            
            if (result) {
                alert(`Mobile money transfer initiated! Status: ${result.status || 'Pending'}`);
                setMobileMoneyModal({ isOpen: false, amount: '', phoneNumber: '', reference: '' });
                // Refresh transactions
                const newTrans = await paymentsNetworkObject.getIotecTransactions();
                setIotecTransactions(newTrans || []);
            } else {
                alert('Failed to initiate mobile money transfer');
            }
        } catch (error) {
            console.error('Error with mobile money transfer:', error);
            alert('Error initiating mobile money transfer');
        } finally {
            setProcessingAction(false);
        }
    };

    const handleBankTransfer = async (e) => {
        e.preventDefault();
        setProcessingAction(true);
        try {
            const result = await paymentsNetworkObject.bankTransfer({
                amount: parseFloat(bankTransferModal.amount),
                accountNumber: bankTransferModal.accountNumber,
                bankName: bankTransferModal.bankName,
                reference: bankTransferModal.reference || `bank-${Date.now()}`,
            });
            
            if (result) {
                alert(`Bank transfer initiated! Status: ${result.status || 'Pending'}`);
                setBankTransferModal({ isOpen: false, amount: '', accountNumber: '', bankName: '', reference: '' });
                // Refresh transactions
                const newTrans = await paymentsNetworkObject.getIotecTransactions();
                setIotecTransactions(newTrans || []);
            } else {
                alert('Failed to initiate bank transfer');
            }
        } catch (error) {
            console.error('Error with bank transfer:', error);
            alert('Error initiating bank transfer');
        } finally {
            setProcessingAction(false);
        }
    };

    const handleCheckTransactionStatus = async (transactionId) => {
        try {
            const result = await paymentsNetworkObject.getTransactionStatus(transactionId);
            if (result) {
                alert(`Transaction Status: ${result.status || 'Unknown'}\nAmount: ${result.amount || 'N/A'}`);
            } else {
                alert('Could not retrieve transaction status');
            }
        } catch (error) {
            console.error('Error checking transaction status:', error);
            alert('Error checking transaction status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
                <NavBar />
                <ThemeToggle />
                  <main className="p-4 md:p-8 max-w-7xl mx-auto pt-20 md:pt-0 md:ml-64">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-lg font-medium">Loading payments data...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <NavBar />
            <ThemeToggle />
            
                  <main className="p-4 md:p-8 max-w-7xl mx-auto pt-20 md:pt-0 md:ml-64">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Payments Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Manage your payment system and financial operations</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Balance</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.statistics?.totalBalance ? 
                                `UGX ${(dashboardData.statistics.totalBalance).toLocaleString()}` : 
                                'UGX 0'
                            }
                        </p>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Transactions</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.statistics?.totalTransactions || 0}
                        </p>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Platform Income</h3>
                        <p className="text-2xl font-bold">
                            {platformRevenue?.currentRevenue ? 
                                `UGX ${(platformRevenue.currentRevenue).toLocaleString()}` : 
                                'UGX 0'
                            }
                        </p>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Withdrawals</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.statistics?.totalWithdrawals || 0}
                        </p>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Webhooks</h3>
                        <p className="text-2xl font-bold text-accent">
                            {dashboardData?.statistics?.pendingWebhooks || 0}
                        </p>
                    </div>
                </div>

                {/* Platform Wallet Balance & IOTEC Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Platform Wallet</h2>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Available Balance</p>
                                <p className="text-3xl font-bold text-primary">
                                    {platformWalletBalance?.actualBalance ? 
                                        `${platformWalletBalance?.currency || 'UGX'} ${(platformWalletBalance.actualBalance).toLocaleString()}` : 
                                        'UGX 0'
                                    }
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    const balance = await paymentsNetworkObject.getWalletBalance();
                                    setPlatformWalletBalance(balance);
                                }}
                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                title="Refresh Balance"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                        {platformWalletBalance && (
                            <div className="text-sm text-muted-foreground space-y-1">
                                {platformWalletBalance.name && (
                                    <p>Wallet Name: <span className="text-foreground">{platformWalletBalance.name}</span></p>
                                )}
                                {platformWalletBalance.id && (
                                    <p>Wallet ID: <span className="text-foreground font-mono text-xs">{platformWalletBalance.id}</span></p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Payment Actions</h2>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setCollectModal({ ...collectModal, isOpen: true })}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Collect Funds
                            </button>
                            <button
                                onClick={() => setMobileMoneyModal({ ...mobileMoneyModal, isOpen: true })}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Mobile Money
                            </button>
                            <button
                                onClick={() => setBankTransferModal({ ...bankTransferModal, isOpen: true })}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Bank Transfer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                {/* Recent Transactions (Full Width with Enhanced Styling) */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <div className="glass-card p-6 rounded-2xl bg-background/80 backdrop-blur-lg shadow-xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-6 text-foreground/90 flex items-center gap-3">
                            <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
                            Recent Transactions
                        </h2>
                        
                        {/* Filter and Search Section */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            {/* Filter Widget */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-foreground/80">Filter:</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 bg-background/50 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                                >
                                    <option value="all">All Transactions</option>
                                    <option value="payment">Payments</option>
                                    <option value="withdrawal">Withdrawals</option>
                                    <option value="collection">Collections</option>
                                </select>
                            </div>
                            
                            {/* Search Component */}
                            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-foreground/80">Search by Phone:</label>
                                <input
                                    type="text"
                                    value={searchPhone}
                                    onChange={(e) => setSearchPhone(e.target.value)}
                                    placeholder="Enter phone number"
                                    className="flex-1 px-3 py-2 bg-background/50 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                                />
                                {searchPhone && (
                                    <button
                                        onClick={() => setSearchPhone('')}
                                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto custom-scrollbar" style={{ maxHeight: '500px' }}>
                            <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-white/5 p-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-foreground/5 rounded-lg">
                                            <th className="text-left py-4 px-4 font-semibold text-foreground/80 border-b border-white/10">
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    ID
                                                </span>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-foreground/80 border-b border-white/10">
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Amount
                                                </span>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-foreground/80 border-b border-white/10">
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Status
                                                </span>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-foreground/80 border-b border-white/10">
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Type
                                                </span>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-foreground/80 border-b border-white/10">
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    Payee Phone
                                                </span>
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-foreground/80 border-b border-white/10">
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Date
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.filter(transaction => {
                                            // Filter by status
                                            const statusMatch = transaction.status === 'COMPLETED' || 
                                                transaction.status === 'Success' || 
                                                transaction.status === 'SUCCESS' ||
                                                transaction.status === 'FAILED' ||
                                                transaction.status === 'Failed';
                                            
                                            // Filter by type
                                            let typeMatch = true;
                                            if (filterType === 'payment') {
                                                typeMatch = transaction.paymentMethod && 
                                                    (transaction.paymentMethod.toLowerCase().includes('iotec') || 
                                                    transaction.paymentMethod.toLowerCase().includes('mobile') ||
                                                    transaction.paymentMethod.toLowerCase().includes('card'));
                                            } else if (filterType === 'withdrawal') {
                                                typeMatch = transaction.paymentMethod && 
                                                    (transaction.paymentMethod.toLowerCase().includes('withdrawal') || 
                                                    transaction.paymentMethod.toLowerCase().includes('disbursement') ||
                                                    transaction.paymentMethod.toLowerCase().includes('bank'));
                                            } else if (filterType === 'collection') {
                                                typeMatch = !transaction.paymentMethod || 
                                                    (!transaction.paymentMethod.toLowerCase().includes('iotec') && 
                                                    !transaction.paymentMethod.toLowerCase().includes('mobile') &&
                                                    !transaction.paymentMethod.toLowerCase().includes('card') &&
                                                    !transaction.paymentMethod.toLowerCase().includes('withdrawal') && 
                                                    !transaction.paymentMethod.toLowerCase().includes('disbursement') &&
                                                    !transaction.paymentMethod.toLowerCase().includes('bank'));
                                            }
                                            
                                            // Filter by phone number
                                            const phoneMatch = !searchPhone || 
                                                (transaction.phone && transaction.phone.includes(searchPhone)) ||
                                                (transaction.payer && transaction.payer.includes(searchPhone)) ||
                                                (transaction.clientPhoneNumber && transaction.clientPhoneNumber.includes(searchPhone));
                                            
                                            return statusMatch && typeMatch && phoneMatch;
                                        }).slice(0, 10).map((transaction, key) => {
                                            // Determine transaction type
                                            const isWithdrawal = transaction.paymentMethod && 
                                                (transaction.paymentMethod.toLowerCase().includes('withdrawal') || 
                                                 transaction.paymentMethod.toLowerCase().includes('disbursement') ||
                                                 transaction.paymentMethod.toLowerCase().includes('bank'));
                                            const isPayment = transaction.paymentMethod && 
                                                (transaction.paymentMethod.toLowerCase().includes('iotec') || 
                                                 transaction.paymentMethod.toLowerCase().includes('mobile') ||
                                                 transaction.paymentMethod.toLowerCase().includes('card'));
                                            
                                            const transactionType = isWithdrawal ? 'Withdrawal' : isPayment ? 'Payment' : 'Collection';
                                            
                                             // Glowing background classes with more elegant effects
                                            const glowingBackground = isWithdrawal ? 'bg-blue-500/10 ring-2 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 
                                                                          isPayment ? 'bg-green-500/10 ring-2 ring-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 
                                                                          'bg-purple-500/10 ring-2 ring-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]';
                                            
                                            return (
                                            <tr key={key} className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 group ${glowingBackground}`}>
                                                <td className="py-4 px-4 font-medium truncate text-foreground/80 group-hover:text-foreground">
                                                    <span className="inline-block px-2 py-1 bg-foreground/5 rounded-lg text-xs font-mono">
                                                        {transaction.id}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-foreground/80 group-hover:text-foreground">
                                                    <span className="font-semibold">
                                                        {transaction.amount ?
                                                            `UGX ${(transaction.amount).toLocaleString()}` :
                                                            'UGX 0'
                                                        }
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                                        transaction.status === 'COMPLETED' || transaction.status === 'Success' || transaction.status === 'SUCCESS' ?
                                                            'bg-green-500/20 text-green-400 ring-1 ring-green-500/30 hover:bg-green-500/30' :
                                                            transaction.status === 'PENDING' || transaction.status === 'Pending' ?
                                                                'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30 hover:bg-yellow-500/30' :
                                                                'bg-red-500/20 text-red-400 ring-1 ring-red-500/30 hover:bg-red-500/30'
                                                    }`}>
                                                        {transaction.status === 'COMPLETED' || transaction.status === 'Success' || transaction.status === 'SUCCESS' ? (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : transaction.status === 'PENDING' || transaction.status === 'Pending' ? (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        )}
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                                        isWithdrawal ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30 hover:bg-blue-500/30' :
                                                        isPayment ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30 hover:bg-green-500/30' :
                                                        'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30 hover:bg-purple-500/30'
                                                    }`}>
                                                        {isWithdrawal ? (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                            </svg>
                                                        ) : isPayment ? (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                            </svg>
                                                        )}
                                                        {transactionType}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-foreground/80 group-hover:text-foreground">
                                                    {transaction.phone || transaction.payer || transaction.clientPhoneNumber || 'N/A'}
                                                </td>
                                                <td className="py-4 px-4 text-foreground/80 group-hover:text-foreground">
                                                    {new Date(transaction.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Wallets */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Active Wallets</h2>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/30">
                                        <th className="text-left py-2 px-3 font-semibold">Full Name</th>
                                        <th className="text-left py-2 px-3 font-semibold">Phone Number</th>
                                        <th className="text-left py-2 px-3 font-semibold">Balance</th>
                                        <th className="text-left py-2 px-3 font-semibold">Status</th>
                                        <th className="text-left py-2 px-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wallets.slice(0, 10).map((item, key) => {
                                        const { wallet, user } = item;
                                        // Glowing background based on wallet status
                                        const glowingBackground = wallet.isFrozen ? 
                                            'bg-red-500/10 ring-2 ring-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
                                            'bg-green-500/10 ring-2 ring-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]';
                                        return (
                                            <tr key={key} className={`border-b border-white/5 hover:bg-white/5 transition-all duration-300 group ${glowingBackground}`}>
                                                <td className="py-4 px-4 text-foreground/80 group-hover:text-foreground">
                                                    {user?.fullName || 'Unknown'}
                                                </td>
                                                <td className="py-4 px-4 text-foreground/80 group-hover:text-foreground">
                                                    {user?.phoneNumber || 'Unknown'}
                                                </td>
                                                <td className="py-4 px-4 text-foreground/80 group-hover:text-foreground">
                                                    <span className="font-semibold">
                                                        {wallet.balance ? 
                                                            `UGX ${(wallet.balance).toLocaleString()}` : 
                                                            'UGX 0'
                                                        }
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                                        wallet.isFrozen ? 
                                                            'bg-red-500/20 text-red-400 ring-1 ring-red-500/30 hover:bg-red-500/30' : 
                                                            'bg-green-500/20 text-green-400 ring-1 ring-green-500/30 hover:bg-green-500/30'
                                                    }`}>
                                                        {wallet.isFrozen ? 'Frozen' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => setTransferModal({
                                                                isOpen: true,
                                                                targetWallet: wallet,
                                                                amount: '',
                                                            })}
                                                            className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Transfer Funds"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </button>
                                                        {wallet.isFrozen ? (
                                                            <button
                                                                onClick={() => handleUnfreezeWallet(wallet.id)}
                                                                className="p-1.5 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                                                title="Unfreeze Wallet"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                                </svg>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleFreezeWallet(wallet.id)}
                                                                className="p-1.5 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                                                title="Freeze Wallet"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteWallet(wallet.id)}
                                                            className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete Wallet"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Transfer Funds Modal */}
                {transferModal.isOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-background rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Transfer Funds</h3>
                            <p className="text-muted-foreground mb-4">
                                Transferring to wallet belonging to user: <span className="text-foreground font-medium">{wallets.find(item => item.wallet.id === transferModal.targetWallet.id)?.user?.fullName || 'Unknown'}</span>
                            </p>
                            <form onSubmit={handleTransfer}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Amount (UGX)
                                    </label>
                                    <input
                                        type="number"
                                        value={transferModal.amount}
                                        onChange={(e) => setTransferModal({
                                            ...transferModal,
                                            amount: e.target.value,
                                        })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter amount"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setTransferModal({
                                            isOpen: false,
                                            targetWallet: null,
                                            amount: '',
                                        })}
                                        className="flex-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Transfer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Collect Funds Modal */}
                {collectModal.isOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-background rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Collect Funds</h3>
                            <p className="text-muted-foreground mb-4">Initiate a collection from a client via IOTEC</p>
                            <form onSubmit={handleCollectFunds}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Amount (UGX)
                                    </label>
                                    <input
                                        type="number"
                                        value={collectModal.amount}
                                        onChange={(e) => setCollectModal({ ...collectModal, amount: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Payer Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={collectModal.payer}
                                        onChange={(e) => setCollectModal({ ...collectModal, payer: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g., 2567XXXXXXXXX"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Wallet ID (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={collectModal.walletId}
                                        onChange={(e) => setCollectModal({ ...collectModal, walletId: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Target wallet ID"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Payer Note (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={collectModal.payerNote}
                                        onChange={(e) => setCollectModal({ ...collectModal, payerNote: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Note for the payer"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setCollectModal({ isOpen: false, amount: '', payer: '', walletId: '', payerNote: '' })}
                                        className="flex-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                        disabled={processingAction}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                                        disabled={processingAction}
                                    >
                                        {processingAction ? 'Processing...' : 'Collect'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Mobile Money Transfer Modal */}
                {mobileMoneyModal.isOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-background rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Mobile Money Transfer</h3>
                            <p className="text-muted-foreground mb-4">Send money to a mobile money account</p>
                            <form onSubmit={handleMobileMoneyTransfer}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Amount (UGX)
                                    </label>
                                    <input
                                        type="number"
                                        value={mobileMoneyModal.amount}
                                        onChange={(e) => setMobileMoneyModal({ ...mobileMoneyModal, amount: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={mobileMoneyModal.phoneNumber}
                                        onChange={(e) => setMobileMoneyModal({ ...mobileMoneyModal, phoneNumber: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g., 2567XXXXXXXXX"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Reference (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={mobileMoneyModal.reference}
                                        onChange={(e) => setMobileMoneyModal({ ...mobileMoneyModal, reference: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Transaction reference"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setMobileMoneyModal({ isOpen: false, amount: '', phoneNumber: '', reference: '' })}
                                        className="flex-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                        disabled={processingAction}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        disabled={processingAction}
                                    >
                                        {processingAction ? 'Processing...' : 'Send'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Bank Transfer Modal */}
                {bankTransferModal.isOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-background rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Bank Transfer</h3>
                            <p className="text-muted-foreground mb-4">Transfer funds to a bank account</p>
                            <form onSubmit={handleBankTransfer}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Amount (UGX)
                                    </label>
                                    <input
                                        type="number"
                                        value={bankTransferModal.amount}
                                        onChange={(e) => setBankTransferModal({ ...bankTransferModal, amount: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={bankTransferModal.accountNumber}
                                        onChange={(e) => setBankTransferModal({ ...bankTransferModal, accountNumber: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Bank account number"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        value={bankTransferModal.bankName}
                                        onChange={(e) => setBankTransferModal({ ...bankTransferModal, bankName: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g., Stanbic Bank"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Reference (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={bankTransferModal.reference}
                                        onChange={(e) => setBankTransferModal({ ...bankTransferModal, reference: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Transaction reference"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setBankTransferModal({ isOpen: false, amount: '', accountNumber: '', bankName: '', reference: '' })}
                                        className="flex-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                        disabled={processingAction}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        disabled={processingAction}
                                    >
                                        {processingAction ? 'Processing...' : 'Transfer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Payment Transactions Table */}
                {iotecTransactions.length > 0 && (
                    <div className="glass-card p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Payment Transactions</h2>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/30">
                                        <th className="text-left py-2 px-3 font-semibold">Reference</th>
                                        <th className="text-left py-2 px-3 font-semibold">Amount</th>
                                        <th className="text-left py-2 px-3 font-semibold">Method</th>
                                        <th className="text-left py-2 px-3 font-semibold">Status</th>
                                        <th className="text-left py-2 px-3 font-semibold">Date</th>
                                        <th className="text-left py-2 px-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {iotecTransactions.slice(0, 10).map((transaction, key) => (
                                        <tr key={key} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                                            <td className="py-2 px-3 font-medium truncate">{transaction.reference || transaction.id}</td>
                                            <td className="py-2 px-3">
                                                {transaction.amount ? 
                                                    `UGX ${(transaction.amount).toLocaleString()}` : 
                                                    'UGX 0'
                                                }
                                            </td>
                                            <td className="py-2 px-3">{transaction.paymentMethod || 'IOTEC'}</td>
                                            <td className="py-2 px-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                                    transaction.status === 'Success' || transaction.status === 'COMPLETED' ? 
                                                        'bg-green-500/20 text-green-400' : 
                                                        transaction.status === 'Pending' || transaction.status === 'PENDING' ? 
                                                            'bg-yellow-500/20 text-yellow-400' : 
                                                            'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3">
                                                {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-2 px-3">
                                                <button
                                                    onClick={() => handleCheckTransactionStatus(transaction.reference || transaction.id)}
                                                    className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Check Status"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}



                {/* Webhook Logs */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4">Webhook Logs</h2>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/30">
                                    <th className="text-left py-2 px-3 font-semibold">ID</th>
                                    <th className="text-left py-2 px-3 font-semibold">Event</th>
                                    <th className="text-left py-2 px-3 font-semibold">Processed</th>
                                    <th className="text-left py-2 px-3 font-semibold">Attempts</th>
                                    <th className="text-left py-2 px-3 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {webhookLogs.slice(0, 10).map((log, key) => (
                                    <tr key={key} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                                        <td className="py-2 px-3 font-medium truncate">{log.id}</td>
                                        <td className="py-2 px-3">{log.eventType || 'Unknown'}</td>
                                        <td className="py-2 px-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                                log.processed ? 
                                                    'bg-green-500/20 text-green-400' : 
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                                {log.processed ? 'Processed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3">{log.attempts || 0}</td>
                                        <td className="py-2 px-3">
                                            {new Date(log.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
