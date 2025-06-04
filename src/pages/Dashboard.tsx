import { useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SubscriptionStatus } from '@/components/SubscriptionStatus';
import { WalletInfo } from '@/components/WalletInfo';
import { useSubscription } from '@/services/subscriptionService';
import ContentRow from '@/components/ContentRow';
import { type ContentItem } from '@/lib/api';

const Dashboard = () => {
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;
  const { data: subscription, isLoading } = useSubscription().useSubscriptionStatus();

  // Mock data for demonstration
  const trendingContent: ContentItem[] = [
    {
      id: 1,
      title: 'Blockchain Revolution',
      name: 'Blockchain Revolution',
      poster_path: '/placeholder-movie.jpg',
      backdrop_path: '/placeholder-backdrop.jpg',
      overview: 'A documentary about the blockchain revolution and its impact on technology.',
      vote_average: 8.5,
      media_type: 'movie',
      release_date: '2023-06-15',
      isExclusive: true,
      price: '9.99',
      year: '2023',
      image: '/placeholder-movie.jpg'
    },
  ];

  // Helper function to get subscription tier name
  const getTierName = (tier: number) => {
    switch (tier) {
      case 1: return 'Basic';
      case 2: return 'Premium';
      case 3: return 'Ultimate';
      default: return 'Unknown';
    }
  };

  if (!isConnected || !currentAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Welcome to SuiStream</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect your wallet to access premium content and manage your subscription
            </p>
            <div className="flex justify-center">
              <WalletInfo />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <WalletInfo />
            <SubscriptionStatus />
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Welcome back!</h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : subscription?.isActive ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You're currently on the{' '}
                    <span className="font-medium text-foreground">
                      {getTierName(subscription.tier)}
                    </span>{' '}
                    plan.
                  </p>
                  {subscription.expiresAt && (
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Your subscription will renew in{' '}
                        {Math.ceil((subscription.expiresAt * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You don't have an active subscription. Subscribe to access premium content.
                  </p>
                  <Button 
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <a href="#subscription-plans">View Plans</a>
                  </Button>
                </div>
              )}
            </div>

            {/* Featured content */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Featured Content</h3>
              <ContentRow 
                title="Trending Now"
                items={trendingContent}
                loading={false}
              />
              
              {/* Add more content rows as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
