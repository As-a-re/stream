import { Transaction } from '@mysten/sui/transactions';
import { toast } from 'sonner';

// Type for transaction result
interface TransactionResult {
  effects: {
    status: {
      status: 'success' | 'failure';
      error?: string;
    };
  };
  events?: any[];
}

// Helper to get package ID from environment
const getPackageId = (): string => {
  return import.meta.env.VITE_NEXT_PUBLIC_SUISTREAM_PACKAGE_ID || '';
};

// Helper to get platform wallet address
const getPlatformWallet = (): string => {
  return '0xdedef1d507c9be500c5702be259a1dea45ccbbd7ca58c86ab8e31d169cf07a2e';
};

interface TransactionOptions {
  showLoading?: boolean;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

type SignAndExecuteTransaction = (input: {
  transaction: Uint8Array | string | Transaction;
  options?: {
    showEffects?: boolean;
    showEvents?: boolean;
    showObjectChanges?: boolean;
    showInput?: boolean;
  };
}) => Promise<TransactionResult>;

export const createTransactionBlock = (): Transaction => {
  return new Transaction();
};

export const executeTransaction = async (
  tx: Transaction,
  signAndExecuteTransaction: SignAndExecuteTransaction,
  options: TransactionOptions = {}
): Promise<{ success: boolean; result?: any; error?: string }> => {
  const {
    showLoading = true,
    loadingMessage = 'Processing transaction...',
    successMessage = 'Transaction successful!',
    errorMessage = 'Transaction failed',
  } = options;

  let toastId: string | number | undefined;
  if (showLoading) {
    toastId = toast.loading(loadingMessage);
  }

  try {
    // Set the gas budget
    tx.setGasBudget(100000000); // 0.1 SUI
    
    // Execute the transaction
    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });

    // Check if the transaction was successful
    const status = result.effects?.status?.status;
    
    if (status === 'success') {
      if (showLoading && successMessage) {
        toast.success(successMessage, { id: toastId });
      }
      return { success: true, result };
    } else {
      const error = result.effects?.status?.error || 'Transaction execution failed';
      throw new Error(error);
    }
  } catch (error) {
    console.error('Transaction error:', error);
    const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error(`${errorMessage}: ${errorMsg}`, { id: toastId });
    return { success: false, error: errorMsg };
  }
};

// Helper function to create a subscription transaction
export const createSubscriptionTx = (
  txb: Transaction,
  tier: number,
  payment: any // Payment coin object from splitCoins
): Transaction => {
  const packageId = getPackageId();
  const platformWallet = getPlatformWallet();
  
  // Transfer payment to platform wallet
  txb.transferObjects([payment], txb.pure.address(platformWallet));
  
  // Call the subscribe function in the smart contract
  txb.moveCall({
    target: `${packageId}::suistream::subscribe`,
    arguments: [
      txb.pure.u8(tier), // tier: u8
    ],
  });
  
  // Set gas budget
  txb.setGasBudget(100000000); // 0.1 SUI
  
  return txb;
};

// Helper function to cancel a subscription
export const createCancelSubscriptionTx = (
  txb: Transaction,
  subscriptionId: string
): Transaction => {
  const packageId = getPackageId();
  
  // Call the cancel_subscription function in the smart contract
  txb.moveCall({
    target: `${packageId}::suistream::cancel_subscription`,
    arguments: [
      txb.object(subscriptionId), // subscription: &mut Subscription
    ],
  });
  
  // Set gas budget
  txb.setGasBudget(100000000); // 0.1 SUI
  
  return txb;
};

// Helper function to renew a subscription
export const createRenewSubscriptionTx = (
  txb: Transaction,
  subscriptionId: string,
  payment: any, // Payment coin object from splitCoins
  months = 1
): Transaction => {
  const packageId = getPackageId();
  const platformWallet = getPlatformWallet();
  
  // Transfer payment to platform wallet
  txb.transferObjects([payment], txb.pure.address(platformWallet));
  
  // Call the renew_subscription function in the smart contract
  txb.moveCall({
    target: `${packageId}::suistream::renew_subscription`,
    arguments: [
      txb.object(subscriptionId), // subscription: &mut Subscription
      txb.pure.u64(months), // months: u64
    ],
  });
  
  // Set gas budget
  txb.setGasBudget(100000000); // 0.1 SUI
  
  return txb;
};
