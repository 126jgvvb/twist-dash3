import { SERVER_IP2 } from "../serverIP";
import EncryptData from "../encryption";

export const paymentsNetworkObject = {
    /**
     * Gets all dashboard data from payments server
     * @returns Promise<object>
     */
    getDashboardData: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/dashboard`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting dashboard data:', error);
            return false;
        }
    },

    /**
     * Gets recent transactions
     * @returns Promise<TransactionEntity[]>
     */
    getRecentTransactions: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/dashboard/transactions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting transactions:', error);
            return false;
        }
    },

    /**
     * Gets wallet balances
     * @returns Promise<WalletEntity[]>
     */
    getWallets: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/dashboard/wallets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting wallets:', error);
            return false;
        }
    },

    /**
     * Gets recent payments
     * @returns Promise<PaymentEntity[]>
     */
    getRecentPayments: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/dashboard/payments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting payments:', error);
            return false;
        }
    },

    /**
     * Gets recent withdrawals
     * @returns Promise<WithdrawalEntity[]>
     */
    getRecentWithdrawals: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/dashboard/withdrawals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting withdrawals:', error);
            return false;
        }
    },

    /**
     * Gets webhook logs
     * @returns Promise<WebhookLogEntity[]>
     */
    getWebhookLogs: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/dashboard/webhook-logs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting webhook logs:', error);
            return false;
        }
    },

    /**
     * Gets platform revenue data
     * @returns Promise<object>
     */
    getPlatformRevenue: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/dashboard/platform-revenue`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting platform revenue:', error);
            return false;
        }
    },

    /**
     * Deletes a wallet
     * @param walletId - ID of the wallet to delete
     * @returns Promise<boolean>
     */
    deleteWallet: async (walletId) => {
        try {
            const response = await fetch(`${SERVER_IP2}/wallets/${walletId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting wallet:', error);
            return false;
        }
    },

    /**
     * Freezes a wallet
     * @param walletId - ID of the wallet to freeze
     * @returns Promise<WalletEntity>
     */
    freezeWallet: async (walletId) => {
        try {
            const response = await fetch(`${SERVER_IP2}/wallets/${walletId}/freeze`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error freezing wallet:', error);
            return false;
        }
    },

    /**
     * Unfreezes a wallet
     * @param walletId - ID of the wallet to unfreeze
     * @returns Promise<WalletEntity>
     */
    unfreezeWallet: async (walletId) => {
        try {
            const response = await fetch(`${SERVER_IP2}/wallets/${walletId}/unfreeze`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error unfreezing wallet:', error);
            return false;
        }
    },

    /**
     * Transfers funds between wallets
     * @param fromWalletId - Source wallet ID
     * @param toWalletId - Destination wallet ID
     * @param amount - Amount to transfer
     * @returns Promise<{ fromWallet: WalletEntity; toWallet: WalletEntity }>
     */
    transferFunds: async (fromWalletId, toWalletId, amount) => {
        try {
            const response = await fetch(`${SERVER_IP2}/wallets/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fromWalletId,
                    toWalletId,
                    amount,
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error transferring funds:', error);
            return false;
        }
    },

    // ==================== IOTEC CONTROLLER METHODS ====================

    /**
     * Collect funds from client via IOTEC collections API
     * @param params - { amount, payer, externalId?, payerNote?, payeeNote?, currency?, category?, walletId, transactionChargesCategory? }
     * @returns Promise<object>
     */
    collectFunds: async (params) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/collect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error collecting funds:', error);
            return false;
        }
    },

    /**
     * Mobile money transfer via IOTEC
     * @param params - { amount, phoneNumber, reference?, payee?, currency?, bankId?, bankTransferType?, sendAt? }
     * @returns Promise<object>
     */
    mobileMoneyTransfer: async (params) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/mobile-money`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error with mobile money transfer:', error);
            return false;
        }
    },

    /**
     * Bank transfer via IOTEC
     * @param params - { amount, accountNumber, bankName, reference? }
     * @returns Promise<object>
     */
    bankTransfer: async (params) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/bank-transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error with bank transfer:', error);
            return false;
        }
    },

    /**
     * Approve or reject a disbursement
     * @param params - { disbursementId, decision (boolean), remarks? }
     * @returns Promise<object>
     */
    approveDisbursement: async (params) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/disbursement/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error approving disbursement:', error);
            return false;
        }
    },

    /**
     * Get all disbursements with optional filtering
     * @param params - { limit?, offset?, status?, category?, fromDate?, toDate? }
     * @returns Promise<object[]>
     */
    getDisbursements: async (params = {}) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/disbursements`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting disbursements:', error);
            return false;
        }
    },

    /**
     * Get transaction status by transactionId
     * @param transactionId - Transaction ID to check
     * @returns Promise<object>
     */
    getTransactionStatus: async (transactionId) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/transaction/${transactionId}/status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting transaction status:', error);
            return false;
        }
    },

    /**
     * Get wallet balance (main platform wallet)
     * @returns Promise<object>
     */
    getWalletBalance: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/wallet/balance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            return false;
        }
    },

    /**
     * Get wallet balance by walletId
     * @param walletId - Wallet ID to check balance
     * @returns Promise<object>
     */
    getWalletBalanceById: async (walletId) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/wallet/${walletId}/balance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting wallet balance by ID:', error);
            return false;
        }
    },

    /**
     * Cancel a pending disbursement
     * @param params - { disbursementId, decision (boolean), remarks? }
     * @returns Promise<object>
     */
    cancelDisbursement: async (params) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/disbursement/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error cancelling disbursement:', error);
            return false;
        }
    },

    /**
     * Get paged disbursement request history
     * @param params - { page?, pageSize?, status?, category?, fromDate?, toDate? }
     * @returns Promise<object>
     */
    getDisbursementHistory: async (params = {}) => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/disbursements/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting disbursement history:', error);
            return false;
        }
    },

    /**
     * Get all IOTEC transactions
     * @returns Promise<object[]>
     */
    getIotecTransactions: async () => {
        try {
            const response = await fetch(`${SERVER_IP2}/iotec/transactions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting IOTEC transactions:', error);
            return false;
        }
    }
};
