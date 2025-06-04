import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useSubscription, SubscriptionTier } from '@/services/subscriptionService';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';

const SubscriptionPlans = () => {
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;
  const address = currentAccount?.address;
  const { subscribe, tiers, useSubscriptionStatus } = useSubscription();
  const { data: subscription, isLoading } = useSubscriptionStatus();
  const [isSubscribing, setIsSubscribing] = useState<SubscriptionTier | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (isSubscribing === tier) return; // Prevent multiple clicks

    const tierInfo = tiers[tier];
    if (!tierInfo) return;

    // Check if user already has an active subscription
    if (subscription?.isActive) {
      toast.info(`You already have an active ${subscription.tier ? tiers[subscription.tier]?.name : ''} subscription`);
      return;
    }

    // TODO: Implement proper balance check with useSuiClientQuery
    // const currentWalletBalance = accountBalance ? BigInt(accountBalance.totalBalance) : BigInt(0);
    // if (currentWalletBalance < BigInt(tierInfo.price)) {
    //   toast.error(`Insufficient balance. You need at least ${tierInfo.price / 1000000000} SUI`);
    //   return;
    // }

    try {
      setIsSubscribing(tier);
      await subscribe.mutateAsync({ tier });
      toast.success(`Successfully subscribed to ${tierInfo.name} tier!`);
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setIsSubscribing(null);
    }
  };

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: (tiers[1].price / 1000000000).toString(), // Convert from MIST to SUI
      period: '/month',
      icon: Zap,
      color: 'text-neon-cyan',
      borderColor: 'border-neon-cyan',
      bgGradient: 'from-cyan-500/10 to-blue-500/10',
      features: [
        'HD Quality Streaming',
        '1000+ Movies & Shows',
        '2 Devices',
        'Mobile & Web Access',
        'Standard Support'
      ]
    },
    {
      id: 2,
      name: 'Premium',
      price: (tiers[2].price / 1000000000).toString(), // Convert from MIST to SUI
      period: '/month',
      icon: Star,
      color: 'text-neon-pink',
      borderColor: 'border-neon-pink',
      bgGradient: 'from-pink-500/10 to-purple-500/10',
      popular: true,
      features: [
        '4K Ultra HD Streaming',
        '5000+ Movies & Shows',
        '5 Devices',
        'All Platform Access',
        'Offline Downloads',
        'Priority Support',
        'Early Access Content'
      ]
    },
    {
      id: 3,
      name: 'Ultimate',
      price: (tiers[3].price / 1000000000).toString(), // Convert from MIST to SUI
      period: '/month',
      icon: Crown,
      color: 'text-neon-purple',
      borderColor: 'border-neon-purple',
      bgGradient: 'from-purple-500/10 to-indigo-500/10',
      features: [
        '8K Streaming',
        'Unlimited Content',
        'Unlimited Devices',
        'VIP Live Events',
        'Premium Downloads',
        'Concierge Support',
        'Exclusive Content',
        'NFT Rewards'
      ]
    }
  ];

  // Show loading state while checking subscription status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-pink"></div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white">
            Choose Your <span className="text-neon-pink">Plan</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Secure payments on Sui Network. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`glass-card ${plan.borderColor} ${plan.popular ? 'scale-105 neon-border animate-neon-pulse' : ''} relative overflow-hidden group hover:scale-105 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-neon-pink to-neon-purple p-2 text-center">
                    <span className="text-white font-semibold text-sm">MOST POPULAR</span>
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.bgGradient} flex items-center justify-center`}>
                    <IconComponent className={`w-8 h-8 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-orbitron text-white">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className={`text-4xl font-bold ${plan.color}`}>
                      {plan.price}
                    </div>
                    <div className="text-white/60">{plan.period}</div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className={`w-5 h-5 ${plan.color} flex-shrink-0`} />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSubscribe(plan.id as SubscriptionTier)}
                    disabled={isSubscribing === plan.id}
                    className={`w-full bg-gradient-to-r ${plan.bgGradient} hover:opacity-80 text-white font-semibold py-3 ${plan.borderColor} border transition-all duration-300 group-hover:animate-neon-pulse flex items-center justify-center gap-2`}
                  >
                    {isSubscribing === plan.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Subscribe with SUI'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;
