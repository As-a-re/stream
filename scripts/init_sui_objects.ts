// Script to deploy Move objects and update the object registry using Sui JS SDK
import { SuiClient, getFullnodeUrl, SuiTransactionBlock } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs';
import { setUserObjectIds, setReviewsId } from '../lib/objectRegistry';
import fs from 'fs';
import path from 'path';

const PACKAGE_PATH = path.resolve(process.cwd(), 'move'); // Path to Move package
const PACKAGE_ID = '0xYOUR_CONTRACT_PACKAGE_ID'; // Replace after deploy
const MODULE_NAME = 'content';

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

// Load admin keypair (replace with secure key management in production)
const ADMIN_KEYPAIR_PATH = path.resolve(process.cwd(), 'admin.key.json');
const adminKeypair = Ed25519Keypair.fromExportedKeypair(JSON.parse(fs.readFileSync(ADMIN_KEYPAIR_PATH, 'utf-8')));

async function publishContract() {
  // TODO: Use Sui SDK to publish Move contract and return packageId
  // For now, return existing PACKAGE_ID
  return PACKAGE_ID;
}

async function createReviewsObject() {
  const tx = new SuiTransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::create_reviews`,
    arguments: [],
  });
  const result = await suiClient.signAndExecuteTransactionBlock({ signer: adminKeypair, transactionBlock: tx });
  const reviewsId = result.objectChanges?.find(obj => obj.objectType?.includes('Reviews'))?.objectId;
  if (!reviewsId) throw new Error('Failed to create Reviews object');
  setReviewsId(reviewsId);
  return reviewsId;
}

async function createUserObjects(wallet: string) {
  // UserLibrary
  let tx = new SuiTransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::create_user_library`,
    arguments: [],
  });
  let result = await suiClient.signAndExecuteTransactionBlock({ signer: adminKeypair, transactionBlock: tx });
  const libraryId = result.objectChanges?.find(obj => obj.objectType?.includes('UserLibrary'))?.objectId;
  if (!libraryId) throw new Error('Failed to create UserLibrary');

  // Watchlist
  tx = new SuiTransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::create_watchlist`,
    arguments: [],
  });
  result = await suiClient.signAndExecuteTransactionBlock({ signer: adminKeypair, transactionBlock: tx });
  const watchlistId = result.objectChanges?.find(obj => obj.objectType?.includes('Watchlist'))?.objectId;
  if (!watchlistId) throw new Error('Failed to create Watchlist');

  setUserObjectIds(wallet, libraryId, watchlistId);
  return { libraryId, watchlistId };
}

async function deployAndInit() {
  // Publish Move contract (if needed)
  const packageId = await publishContract();
  console.log('Move contract packageId:', packageId);

  // Create global Reviews object
  const reviewsId = await createReviewsObject();
  console.log('Created Reviews object:', reviewsId);

  // For each user, create UserLibrary and Watchlist objects
  const users = [
    '0xdedef1d507c9be500c5702be259a1dea45ccbbd7ca58c86ab8e31d169cf07a2e',
    // Add more user addresses as needed
  ];
  for (const wallet of users) {
    const { libraryId, watchlistId } = await createUserObjects(wallet);
    console.log(`Created UserLibrary (${libraryId}) and Watchlist (${watchlistId}) for ${wallet}`);
  }
  console.log('Registry initialized.');
}

deployAndInit();
