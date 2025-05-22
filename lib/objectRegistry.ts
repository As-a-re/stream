import fs from 'fs';
import path from 'path';

const REGISTRY_PATH = path.resolve(process.cwd(), 'object_registry.json');

export function getUserLibraryId(wallet: string): string | null {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  return registry.users?.[wallet]?.library || null;
}
export function getUserWatchlistId(wallet: string): string | null {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  return registry.users?.[wallet]?.watchlist || null;
}
export function getReviewsId(): string {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  return registry.reviews;
}
export function setUserObjectIds(wallet: string, libraryId: string, watchlistId: string) {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  registry.users = registry.users || {};
  registry.users[wallet] = { library: libraryId, watchlist: watchlistId };
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}
export function setReviewsId(reviewsId: string) {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  registry.reviews = reviewsId;
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}
