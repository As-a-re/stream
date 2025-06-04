import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { LogOut, Copy, ExternalLink } from 'lucide-react';
import { formatAddress } from '@/lib/utils';
import { toast } from 'sonner';

export const WalletInfo = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const { mutate: disconnect } = useDisconnectWallet();
  // TODO: Replace with useSuiClientQuery for balance
  const balance = null; // Placeholder

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  const viewOnExplorer = () => {
    if (!address) return;
    window.open(`https://suiexplorer.com/address/${address}?network=testnet`, '_blank');
  };

  if (!currentAccount) return null;

  return (
    <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">Connected</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => disconnect()}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          Disconnect
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Address</span>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm">{formatAddress(address)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleCopyAddress}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={viewOnExplorer}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Balance</span>
          {currentAccount?.label && (
            <span className="text-sm text-muted-foreground">
              ({currentAccount.label})
            </span>
          )}
          <span className="font-mono text-sm">{balance} SUI</span>
        </div>
      </div>
    </div>
  );
};
