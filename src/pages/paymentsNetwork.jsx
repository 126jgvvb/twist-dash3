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
    }
};
