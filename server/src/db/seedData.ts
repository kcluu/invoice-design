import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Invoice } from '../invoices/invoice.types';

const seedPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../data/invoices.json');

export interface DraftExample {
  id: string;
  label: string;
  input: string;
  expectedDraftFields: string[];
}

interface SeedFile {
  company: { name: string; industry: string; baseCurrency: string };
  currentDate: string;
  invoices: Array<Omit<Invoice, 'paidDate'> & { paidDate?: string }>;
  bonusLlmExamples?: DraftExample[];
}

export interface Seed {
  company: SeedFile['company'];
  currentDate: string;
  invoices: Invoice[];
  examples: DraftExample[];
}

// parses the file on every call so callers always get their own copy
export const loadSeed = (): Seed => {
  const raw = JSON.parse(readFileSync(seedPath, 'utf8')) as SeedFile;
  return {
    company: raw.company,
    currentDate: raw.currentDate,
    invoices: raw.invoices.map((invoice) => ({
      ...invoice,
      billingAddress: invoice.billingAddress ?? '',
      memo: invoice.memo ?? '',
      paidDate: invoice.paidDate ?? null,
    })),
    // sample billing requests for the draft-from-text feature
    examples: raw.bonusLlmExamples ?? [],
  };
};
