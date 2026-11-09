import { describe, expect, it } from 'vitest';
import { loadSeed } from '../src/db/seedData';
import { buildPrompt, toDraftResult, type LlmDraft } from '../src/invoices/invoice.llmDraft';
import { createMemoryRepository } from '../src/invoices/invoice.memoryRepository';
import { createInvoiceService } from '../src/invoices/invoice.service';
import { validateInvoiceInput } from '../src/invoices/invoice.validation';

const seed = loadSeed();
const context = { invoices: seed.invoices, asOfDate: seed.currentDate };

const llmDraft = (overrides: Partial<LlmDraft> = {}): LlmDraft => ({
  customerName: 'Acme Labs',
  paymentTerms: null,
  dueDate: null,
  currency: null,
  memo: 'April platform subscription.',
  taxRate: null,
  discount: null,
  lineItems: [{ description: 'Platform subscription', quantity: 1, unitPrice: 12000, accountCode: '4000' }],
  statedFields: ['customerName', 'lineItems', 'memo'],
  needsReview: [],
  ...overrides,
});

describe('toDraftResult', () => {
  it("fills unstated fields from the customer's history and works out the due date", () => {
    const { draft, needsReview } = toDraftResult(llmDraft({ paymentTerms: 'Net 15' }), context);
    const acme = seed.invoices.find((invoice) => invoice.customerName === 'Acme Labs')!;

    expect(draft).toMatchObject({
      customerName: 'Acme Labs',
      billingEmail: acme.billingEmail,
      paymentTerms: 'Net 15',
      issueDate: '2026-05-04',
    });
    expect(draft.dueDate).toBe('2026-05-19');
    expect(needsReview).toEqual([]);
    expect(validateInvoiceInput(draft).ok).toBe(true);
  });

  it('refuses a customer the model made up', () => {
    const { draft, needsReview, filledFields } = toDraftResult(llmDraft({ customerName: 'Globex' }), context);

    expect(draft.customerName).toBe('');
    expect(filledFields).not.toContain('customerName');
    expect(needsReview).toContain(`"Globex" isn't a known customer. Pick one before saving.`);
  });

  it("keeps the model's review notes and ignores an invalid due date", () => {
    const { draft, needsReview } = toDraftResult(
      llmDraft({ dueDate: '2026-01-01', needsReview: [{ field: 'taxRate', reason: "Tax wasn't stated. Confirm before sending." }] }),
      context
    );

    expect(draft.dueDate >= draft.issueDate).toBe(true);
    expect(needsReview[0]).toBe("Tax wasn't stated. Confirm before sending.");
    expect(needsReview[1]).toMatch(/isn\'t valid/);
  });

  it('wraps the request so it is treated as data', () => {
    expect(buildPrompt('bill acme', context)).toContain('<request>\nbill acme\n</request>');
  });
});

describe('draftFromText with an llm drafter', () => {
  it('falls back to the rule based drafter when the llm fails', async () => {
    const service = createInvoiceService(createMemoryRepository(seed.invoices), {
      asOfDate: seed.currentDate,
      drafter: async () => {
        throw new Error('overloaded');
      },
    });
    const original = console.error;
    console.error = () => {};
    const result = await service.draftFromText({ text: seed.examples[0].input }).finally(() => (console.error = original));

    expect(result.draft.customerName).toBe('Acme Labs');
    expect(result.needsReview[0]).toMatch(/AI drafting wasn\'t available/);
  });
});
