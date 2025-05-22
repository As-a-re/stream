export interface WalletState {
  connected: boolean
  address: string | null
  ownedContentIds: string[]
}
