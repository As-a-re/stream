import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useContentAccess, SubscriptionTier } from '@/hooks/useContentAccess';
import { useWalletContext } from '@/providers/WalletProvider';

interface ContentAccessWrapperProps {
  children: ReactNode;
  requiredTier?: SubscriptionTier;
  showUpgradePrompt?: boolean;
}

export const ContentAccessWrapper = ({
  children,
  requiredTier = 1,
  showUpgradePrompt = true,
}: ContentAccessWrapperProps) => {
  const { isConnected } = useWalletContext();
  const { hasAccess, isLoading } = useContentAccess(requiredTier); // Removed subscriptionTier as it's unused and causing a type error to be investigated

  // If still loading, show a loading state or the content with a blur overlay
  if (isLoading) {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-pulse text-white">Loading access...</div>
        </div>
      </div>
    );
  }

  // If user has access, show the content
  if (hasAccess) {
    return <>{children}</>;
  }

  // If user doesn't have access, show the upgrade prompt or a lock icon
  return (
    <div className="relative group">
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
      {showUpgradePrompt ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-center">
          <div className="bg-black/80 backdrop-blur-sm p-6 rounded-lg max-w-md w-full">
            <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Premium Content</h3>
            <p className="text-muted-foreground mb-4">
              {isConnected
                ? 'Upgrade your subscription to access this content.'
                : 'Connect your wallet and subscribe to access premium content.'}
            </p>
            {isConnected ? (
              <Button className="w-full" onClick={() => {
                // Scroll to subscription plans
                const plansSection = document.getElementById('subscription-plans');
                plansSection?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Upgrade Now
              </Button>
            ) : (
              <Button className="w-full">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="h-8 w-8 text-white/80" />
        </div>
      )}
    </div>
  );
};

export default ContentAccessWrapper;
