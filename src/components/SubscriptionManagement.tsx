import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useSubscription } from '@/services/subscriptionService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { createCancelSubscriptionTx, createRenewSubscriptionTx } from '@/lib/transactions';
import { Transaction } from '@mysten/sui/transactions';
import { toast } from 'sonner';

// Utility function for formatting dates
const formatDate = (date: Date) => date.toLocaleDateString();
const formatRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = timestamp * 1000 - now;
  if (diff <= 0) return 'expired';
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days} day${days !== 1 ? 's' : ''} left`;
};

export const SubscriptionManagement = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { mutateAsync: signAndExecuteDappKit } = useSignAndExecuteTransaction();
  const { data: subscription, isLoading, refetch } = useSubscription().useSubscriptionStatus();
  const [isProcessing, setIsProcessing] = useState(false);
  const [renewMonths, setRenewMonths] = useState(1);

  const handleCancel = async () => {
    if (!address || !subscription?.id) return;
    
    const confirmed = window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium content at the end of your billing period.');
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const txb = createCancelSubscriptionTx(new Transaction(), String(subscription.id));
      // TODO: Consolidate wallet providers to @mysten/dapp-kit to properly fix TransactionBlock type issues.
      
      await signAndExecuteDappKit({
        transaction: txb,
      });
      
      toast.success('Subscription cancelled successfully');
      await refetch();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast.error('Failed to cancel subscription', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRenew = async () => {
    if (!address || !subscription?.id) return;
    
    setIsProcessing(true);
    try {
      const txb = createRenewSubscriptionTx(new Transaction(), String(subscription.id), renewMonths);
      // TODO: Consolidate wallet providers to @mysten/dapp-kit to properly fix TransactionBlock type issues.
      
      await signAndExecuteDappKit({
        transaction: txb,
      });
      
      toast.success(`Subscription renewed for ${renewMonths} month${renewMonths > 1 ? 's' : ''}!`);
      await refetch();
    } catch (error) {
      console.error('Renew subscription error:', error);
      toast.error('Failed to renew subscription', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Loading your subscription details...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner size={32} />
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription?.isActive && subscription.expiresAt * 1000 > Date.now();
  const expiryDate = subscription?.expiresAt ? new Date(subscription.expiresAt * 1000) : null;

  return (
    <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        {subscription?.tier ? (
          <CardDescription>
            You're currently on the <span className="font-medium">
              {subscription.tier === 1 ? 'Basic' : subscription.tier === 2 ? 'Premium' : 'Ultimate'}
            </span> plan.
          </CardDescription>
        ) : (
          <CardDescription>You don't have an active subscription.</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isActive && expiryDate && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Subscription Status</h3>
            <div className="bg-muted/50 p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium">
                  <span className="inline-flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Active
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Expires</span>
                <span className="text-sm font-mono">
                  {formatDate(expiryDate)} ({formatRelativeTime(expiryDate.getTime() / 1000)})
                </span>
              </div>
              
            </div>
          </div>
        )}

        {isActive ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Renew Subscription</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={renewMonths}
                  onChange={(e) => setRenewMonths(Number(e.target.value))}
                  className="bg-background border border-input rounded-md px-3 py-2 text-sm"
                  disabled={isProcessing}
                >
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months (5% off)</option>
                  <option value={6}>6 Months (10% off)</option>
                  <option value={12}>12 Months (15% off)</option>
                </select>
                <Button 
                  onClick={handleRenew}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? <LoadingSpinner size={16} className="mr-2" /> : null}
                  Renew Now
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
              <div className="bg-destructive/5 border border-destructive/20 rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-destructive">Cancel Subscription</h4>
                    <p className="text-sm text-muted-foreground">
                      Your subscription will remain active until the end of the current billing period.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <LoadingSpinner size={16} className="mr-2" /> : null}
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">You don't have an active subscription.</p>
            <Button asChild>
              <a href="#subscription-plans">View Subscription Plans</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
