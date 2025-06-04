import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { toast } from 'sonner';
import { getPackageId, getPlatformWallet, getFullNodeUrl } from '../config/networks.ts';

// Initialize Sui client
const client = new SuiClient({ url: getFullNodeUrl() });

// Subscription tiers with their respective prices in MIST (1 SUI = 1_000_000_000 MIST)
export const SUBSCRIPTION_TIERS = {
  1: {
    id: 1,
    name: 'Basic',
    price: 5_000_000_000, // 5 SUI
    features: [
      'Access to basic content',
      'SD quality streaming',
      'Watch on 1 device',
    ],
  },
  2: {
    id: 2,
    name: 'Premium',
    price: 10_000_000_000, // 10 SUI
    features: [
      'Access to all basic content',
      'HD quality streaming',
      'Watch on 2 devices',
      'Download content',
    ],
  },
  3: {
    id: 3,
    name: 'Ultimate',
    price: 15_000_000_000, // 15 SUI
    features: [
      'Access to all content',
      '4K + HDR quality',
      'Watch on 4 devices',
      'Download content',
      'Early access to new releases',
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  userAddress: string;
  startDate: number; // Unix timestamp in seconds
  expiresAt: number; // Unix timestamp in seconds
  isActive: boolean;
  autoRenew: boolean;
}

interface SubscriptionResponse {
  data: {
    id: string;
    tier: number;
    user_address: string;
    start_date: string;
    expiry_date: string;
    is_active: boolean;
    auto_renew: boolean;
  } | null;
}

export const useSubscription = () => {
  const currentAccount = useCurrentAccount();
  const currentAddress = currentAccount?.address;
  const { mutateAsync: actualSignAndExecuteTransaction } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();
  const packageId = getPackageId();
  const platformWallet = getPlatformWallet();

  // Get the current user's subscription
  const useSubscriptionStatus = () => {
    return useQuery<Subscription | null>({
      queryKey: ['subscription', currentAddress],
      queryFn: async () => {
        if (!currentAddress) return null;
        
        try {
          // Fetch the user's subscription from the blockchain
          const txbInspect = new Transaction();
          txbInspect.moveCall({
            target: `${packageId}::suistream::get_subscription`,
            arguments: [
              txbInspect.pure.address(currentAddress!), // user_address: address
            ],
          });
          const result = await client.devInspectTransactionBlock({
            transactionBlock: txbInspect,
            sender: currentAddress!,
          });

          // Parse the subscription data
          if (result.effects.status.status === 'success' && result.events) {
            const subscriptionEvent = result.events.find(
              (event) => event.type.endsWith('::SubscriptionEvent')
            );

            if (subscriptionEvent) {
              const subscriptionData = subscriptionEvent.parsedJson as SubscriptionResponse['data'];
              
              if (!subscriptionData) return null;
              
              return {
                id: subscriptionData.id,
                tier: subscriptionData.tier as SubscriptionTier,
                userAddress: subscriptionData.user_address,
                startDate: Math.floor(new Date(subscriptionData.start_date).getTime() / 1000),
                expiresAt: Math.floor(new Date(subscriptionData.expiry_date).getTime() / 1000),
                isActive: subscriptionData.is_active,
                autoRenew: subscriptionData.auto_renew,
              };
            }
          }
          
          return null;
        } catch (error) {
          console.error('Error fetching subscription:', error);
          return null;
        }
      },
      enabled: !!currentAddress,
      refetchInterval: 60000, // Refetch every minute
    });
  };

  // Subscribe to a plan
  const subscribe = useMutation({
    mutationFn: async ({ tier, months = 1 }: { tier: SubscriptionTier; months?: number }) => {
      if (!currentAddress) throw new Error('Wallet not connected');
      
      const txb = new Transaction();
      const tierPrice = SUBSCRIPTION_TIERS[tier].price * months;
      
      // Transfer SUI to the platform wallet
      const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(tierPrice)]);
      txb.transferObjects([coin], txb.pure.address(platformWallet));
      
      // Call the subscribe function in the smart contract
      txb.moveCall({
        target: `${packageId}::suistream::subscribe`,
        arguments: [
          txb.object(platformWallet), // platform: &mut SuiStream
          txb.pure.u64(months), // months: u64
          txb.pure.u8(tier), // tier: u8
        ],
      });
      
      // Sign and execute the transaction
      const result = await actualSignAndExecuteTransaction({
        transaction: txb as any,
      });
      
      return result;
    },
    onSuccess: () => {
      toast.success('Subscription successful!');
      queryClient.invalidateQueries({ queryKey: ['subscription', currentAddress] });
    },
    onError: (error: Error) => {
      toast.error('Subscription failed', {
        description: error.message,
      });
    },
  });

  // Cancel subscription
  const cancelSubscription = useMutation({
    mutationFn: async (subscriptionId: string) => {
      if (!currentAddress) throw new Error('Wallet not connected');
      
      const txb = new Transaction();
      
      // Call the cancel_subscription function in the smart contract
      txb.moveCall({
        target: `${packageId}::suistream::cancel_subscription`,
        arguments: [
          txb.object(subscriptionId), // subscription: &mut Subscription
        ],
      });
      
      // Sign and execute the transaction
      const result = await actualSignAndExecuteTransaction({
        transaction: txb as any,
      });
      
      return result;
    },
    onSuccess: () => {
      toast.success('Subscription cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['subscription', currentAddress] });
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel subscription', {
        description: error.message,
      });
    },
  });

  // Renew subscription
  const renewSubscription = useMutation({
    mutationFn: async ({ subscriptionId, months = 1 }: { subscriptionId: string; months?: number }) => {
      if (!currentAddress) throw new Error('Wallet not connected');
      
      const txb = new Transaction();
      const tier = 1; // Default tier, adjust based on your logic
      const tierPrice = SUBSCRIPTION_TIERS[tier].price * months;
      
      // Transfer SUI to the platform wallet
      const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(tierPrice)]);
      txb.transferObjects([coin], txb.pure.address(platformWallet));
      
      // Call the renew_subscription function in the smart contract
      txb.moveCall({
        target: `${packageId}::suistream::renew_subscription`,
        arguments: [
          txb.object(subscriptionId), // subscription: &mut Subscription
          txb.pure.u64(months), // months: u64
        ],
      });
      
      // Sign and execute the transaction
      const result = await actualSignAndExecuteTransaction({
        transaction: txb as any,
      });
      
      return result;
    },
    onSuccess: () => {
      toast.success('Subscription renewed successfully');
      queryClient.invalidateQueries({ queryKey: ['subscription', currentAddress] });
    },
    onError: (error: Error) => {
      toast.error('Failed to renew subscription', {
        description: error.message,
      });
    },
  });

  // Toggle auto-renewal
  const toggleAutoRenewal = useMutation({
    mutationFn: async ({ subscriptionId, autoRenew }: { subscriptionId: string; autoRenew: boolean }) => {
      if (!currentAddress) throw new Error('Wallet not connected');
      
      const txb = new Transaction();
      
      // Call the set_auto_renew function in the smart contract
      txb.moveCall({
        target: `${packageId}::suistream::set_auto_renew`,
        arguments: [
          txb.object(subscriptionId), // subscription: &mut Subscription
          txb.pure.bool(autoRenew), // auto_renew: bool
        ],
      });
      
      // Sign and execute the transaction
      const result = await actualSignAndExecuteTransaction({
        transaction: txb as any,
      });
      
      return result;
    },
    onSuccess: () => {
      toast.success('Auto-renewal settings updated');
      queryClient.invalidateQueries({ queryKey: ['subscription', currentAddress] });
    },
    onError: (error: Error) => {
      toast.error('Failed to update auto-renewal settings', {
        description: error.message,
      });
    },
  });

  // Check if user has access to content
  const hasAccess = (contentTier: SubscriptionTier, userTier?: SubscriptionTier) => {
    if (!userTier) return false;
    return userTier >= contentTier;
  };

  return {
    useSubscriptionStatus,
    subscribe,
    cancelSubscription,
    renewSubscription,
    toggleAutoRenewal,
    hasAccess,
    tiers: SUBSCRIPTION_TIERS,
  };
};
