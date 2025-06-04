import { useEffect, useState, useCallback, ReactNode, ComponentType, FC } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSubscription } from '@/services/subscriptionService';

// Define the subscription tier type
export type SubscriptionTier = 1 | 2 | 3; // 1: Basic, 2: Premium, 3: Ultimate

// Define the return type for the hook
interface UseContentAccessReturn {
  hasAccess: boolean;
  isLoading: boolean;
  subscriptionTier?: SubscriptionTier;
  isSubscribed: boolean;
  error?: Error;
}

// Default loading component
const DefaultLoading: FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
  </div>
);

// Default access denied component
const DefaultAccessDenied: FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
    <p className="text-muted-foreground mb-6">
      You need a subscription to access this content.
    </p>
    <a 
      href="#subscription-plans" 
      className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      View Plans
    </a>
  </div>
);

// Default protected content denied component
const DefaultProtectedDenied: FC = () => (
  <div className="p-6 text-center">
    <p>You don't have access to this content. Please upgrade your subscription.</p>
  </div>
);

export const useContentAccess = (requiredTier: SubscriptionTier = 1): UseContentAccessReturn => {
  const currentAccount = useCurrentAccount();
  const { data: subscription, isLoading, error: subscriptionError } = useSubscription().useSubscriptionStatus();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const checkAccess = useCallback(async () => {
    if (!currentAccount?.address) {
      setHasAccess(false);
      setIsChecking(false);
      return;
    }

    try {
      if (isLoading) return;

      if (subscriptionError) {
        throw new Error('Failed to load subscription status');
      }

      if (!subscription?.isActive || !subscription.tier) {
        setHasAccess(false);
        return;
      }

      const userTier = subscription.tier;
      const accessGranted = userTier >= requiredTier;
      
      setHasAccess(accessGranted);
    } catch (err) {
      console.error('Error checking content access:', err);
      setError(err instanceof Error ? err : new Error('Unknown error checking content access'));
      setHasAccess(false);
    } finally {
      setIsChecking(false);
    }
  }, [currentAccount, isLoading, subscription, subscriptionError, requiredTier]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return {
    hasAccess,
    isLoading: isChecking || isLoading,
    subscriptionTier: subscription?.tier as SubscriptionTier | undefined,
    isSubscribed: subscription?.isActive || false,
    error
  };
};

// Higher-order component for protecting routes
interface WithContentAccessOptions {
  requiredTier?: SubscriptionTier;
  loadingComponent?: ReactNode;
  accessDeniedComponent?: ReactNode;
}

export function withContentAccess<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  options: WithContentAccessOptions = {}
): FC<P> {
  const {
    requiredTier = 1,
    loadingComponent = <DefaultLoading />,
    accessDeniedComponent = <DefaultAccessDenied />
  } = options;

  const WrappedComponent: FC<P> = (props) => {
    const { hasAccess, isLoading, error } = useContentAccess(requiredTier);

    if (isLoading) {
      return <>{loadingComponent}</>;
    }

    if (error || !hasAccess) {
      return <>{accessDeniedComponent}</>;
    }

    return <Component {...props} />;
  };

  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withContentAccess(${displayName})`;
  
  return WrappedComponent;
}

interface ProtectedContentProps {
  children: ReactNode;
  requiredTier?: SubscriptionTier;
  loadingComponent?: ReactNode;
  accessDeniedComponent?: ReactNode;
}

export const ProtectedContent: FC<ProtectedContentProps> = ({
  children,
  requiredTier = 1,
  loadingComponent = <DefaultLoading />,
  accessDeniedComponent = <DefaultProtectedDenied />
}) => {
  const { hasAccess, isLoading } = useContentAccess(requiredTier);

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (!hasAccess) {
    return <>{accessDeniedComponent}</>;
  }

  return <>{children}</>;
};
