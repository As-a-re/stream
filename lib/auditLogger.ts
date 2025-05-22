import fs from 'fs';
import path from 'path';

const LOG_PATH = path.resolve(process.cwd(), 'audit.log');

export function logAudit(action: string, admin: string, details: any) {
  const entry = {
    timestamp: new Date().toISOString(),
    admin,
    action,
    details,
  };
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
}

export function readAuditLog() {
  if (!fs.existsSync(LOG_PATH)) return [];
  return fs.readFileSync(LOG_PATH, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
}
