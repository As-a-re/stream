import { useSubscription } from '@/services/subscriptionService';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Clock, Zap, Star, Crown } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export const SubscriptionStatus = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { data: subscription, isLoading } = useSubscription().useSubscriptionStatus();
  
  if (!address) {
    return (
      <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">Connect your wallet to view your subscription status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTierIcon = (tier?: number) => {
    switch (tier) {
      case 1: return <Zap className="h-5 w-5 text-blue-500" />;
      case 2: return <Star className="h-5 w-5 text-purple-500" />;
      case 3: return <Crown className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getTierName = (tier?: number) => {
    switch (tier) {
      case 1: return 'Basic';
      case 2: return 'Premium';
      case 3: return 'Ultimate';
      default: return 'None';
    }
  };

  const isActive = subscription?.isActive && subscription.expiresAt * 1000 > Date.now();

  return (
    <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Subscription Status</CardTitle>
          {isActive ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Check className="h-3.5 w-3.5 mr-1.5" /> Active
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
              <X className="h-3.5 w-3.5 mr-1.5" /> Inactive
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTierIcon(subscription?.tier)}
            <span className="font-medium">Current Plan</span>
          </div>
          <span className="font-mono">
            {subscription?.tier ? getTierName(subscription.tier) : 'None'}
          </span>
        </div>

        {subscription?.expiresAt && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isActive ? 'Renews' : 'Expired'}
              </span>
            </div>
            <span className="text-sm font-mono">
              {formatRelativeTime(subscription.expiresAt)}
            </span>
          </div>
        )}

        {!isActive && (
          <div className="pt-4">
            <a 
              href="#subscription-plans" 
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Subscribe Now
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
