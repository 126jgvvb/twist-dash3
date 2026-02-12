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
    const [loading, setLoading] = useState(true);
    const [transferModal, setTransferModal] = useState({
        isOpen: false,
        targetWallet: null,
        amount: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    dashboard,
                    trans,
                    walletData,
                    paymentData,
                    withdrawalData,
                    webhookData
                ] = await Promise.all([
                    paymentsNetworkObject.getDashboardData(),
                    paymentsNetworkObject.getRecentTransactions(),
                    paymentsNetworkObject.getWallets(),
                    paymentsNetworkObject.getRecentPayments(),
                    paymentsNetworkObject.getRecentWithdrawals(),
                    paymentsNetworkObject.getWebhookLogs()
                ]);

                setDashboardData(dashboard);
                setTransactions(trans || []);
                setWallets(walletData || []);
                setPayments(paymentData || []);
                setWithdrawals(withdrawalData || []);
                setWebhookLogs(webhookData || []);
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
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Payments</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.statistics?.totalPayments || 0}
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

                {/* Recent Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/30">
                                        <th className="text-left py-2 px-3 font-semibold">ID</th>
                                        <th className="text-left py-2 px-3 font-semibold">Amount</th>
                                        <th className="text-left py-2 px-3 font-semibold">Status</th>
                                        <th className="text-left py-2 px-3 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 10).map((transaction, key) => (
                                        <tr key={key} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                                            <td className="py-2 px-3 font-medium truncate">{transaction.id}</td>
                                            <td className="py-2 px-3">
                                                {transaction.amount ? 
                                                    `UGX ${(transaction.amount).toLocaleString()}` : 
                                                    'UGX 0'
                                                }
                                            </td>
                                            <td className="py-2 px-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                                    transaction.status === 'COMPLETED' ? 
                                                        'bg-green-500/20 text-green-400' : 
                                                        transaction.status === 'PENDING' ? 
                                                            'bg-yellow-500/20 text-yellow-400' : 
                                                            'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3">
                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Active Wallets */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Active Wallets</h2>
                        <div className="overflow-x-auto">
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
                                        return (
                                            <tr key={key} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                                                <td className="py-2 px-3">{user?.fullName || 'Unknown'}</td>
                                                <td className="py-2 px-3">{user?.phoneNumber || 'Unknown'}</td>
                                                <td className="py-2 px-3">
                                                    {wallet.balance ? 
                                                        `UGX ${(wallet.balance).toLocaleString()}` : 
                                                        'UGX 0'
                                                    }
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                                        wallet.isFrozen ? 
                                                            'bg-red-500/20 text-red-400' : 
                                                            'bg-green-500/20 text-green-400'
                                                    }`}>
                                                        {wallet.isFrozen ? 'Frozen' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3">
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

                {/* Recent Payments and Withdrawals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Recent Payments</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/30">
                                        <th className="text-left py-2 px-3 font-semibold">ID</th>
                                        <th className="text-left py-2 px-3 font-semibold">Amount</th>
                                        <th className="text-left py-2 px-3 font-semibold">Method</th>
                                        <th className="text-left py-2 px-3 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.slice(0, 10).map((payment, key) => (
                                        <tr key={key} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                                            <td className="py-2 px-3 font-medium truncate">{payment.id}</td>
                                            <td className="py-2 px-3">
                                                {payment.amount ? 
                                                    `UGX ${(payment.amount).toLocaleString()}` : 
                                                    'UGX 0'
                                                }
                                            </td>
                                            <td className="py-2 px-3">{payment.paymentMethod || 'Unknown'}</td>
                                            <td className="py-2 px-3">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Recent Withdrawals</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/30">
                                        <th className="text-left py-2 px-3 font-semibold">ID</th>
                                        <th className="text-left py-2 px-3 font-semibold">Amount</th>
                                        <th className="text-left py-2 px-3 font-semibold">Method</th>
                                        <th className="text-left py-2 px-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawals.slice(0, 10).map((withdrawal, key) => (
                                        <tr key={key} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                                            <td className="py-2 px-3 font-medium truncate">{withdrawal.id}</td>
                                            <td className="py-2 px-3">
                                                {withdrawal.amount ? 
                                                    `UGX ${(withdrawal.amount).toLocaleString()}` : 
                                                    'UGX 0'
                                                }
                                            </td>
                                            <td className="py-2 px-3">{withdrawal.paymentMethod || 'Unknown'}</td>
                                            <td className="py-2 px-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                                    withdrawal.status === 'COMPLETED' ? 
                                                        'bg-green-500/20 text-green-400' : 
                                                        withdrawal.status === 'PENDING' ? 
                                                            'bg-yellow-500/20 text-yellow-400' : 
                                                            'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {withdrawal.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Webhook Logs */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4">Webhook Logs</h2>
                    <div className="overflow-x-auto">
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
