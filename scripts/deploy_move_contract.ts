import { execSync } from 'child_process';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PACKAGE_PATH = path.resolve(process.cwd(), 'move');
const ADMIN_KEYPAIR_PATH = path.resolve(process.cwd(), 'admin.key.json');
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
const adminKeypair = Ed25519Keypair.fromExportedKeypair(JSON.parse(fs.readFileSync(ADMIN_KEYPAIR_PATH, 'utf-8')));

async function buildAndPublish() {
  console.log('Building Move package...');
  execSync(`sui move build --path ${PACKAGE_PATH}`, { stdio: 'inherit' });
  console.log('Publishing Move package to Sui...');
  // This assumes Sui CLI is installed and admin key is loaded in Sui CLI
  const publishOutput = execSync(
    `sui client publish --gas-budget 100000000 --json --path ${PACKAGE_PATH}`,
    { encoding: 'utf-8' }
  );
  const result = JSON.parse(publishOutput);
  const packageId = result.packageId || result.objectChanges?.find((o: any) => o.type === 'published')?.packageId;
  if (!packageId) throw new Error('Failed to get published packageId');
  console.log('Published packageId:', packageId);
  // Update .env
  const envPath = path.resolve(process.cwd(), '.env');
  let envContent = fs.readFileSync(envPath, 'utf-8');
  if (envContent.includes('SUI_PACKAGE_ID=')) {
    envContent = envContent.replace(/SUI_PACKAGE_ID=.*/g, `SUI_PACKAGE_ID=${packageId}`);
  } else {
    envContent += `\nSUI_PACKAGE_ID=${packageId}`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log('Updated .env with new SUI_PACKAGE_ID');
  return packageId;
}

buildAndPublish();
