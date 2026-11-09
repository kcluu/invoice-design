import { describe, expect, it } from 'vitest';
import { loadSeed } from '../src/db/seedData';
import { draftFromText } from '../src/invoices/invoice.draftFromText';
import { validateInvoiceInput } from '../src/invoices/invoice.validation';

const seed = loadSeed();
const context = { invoices: seed.invoices, asOfDate: seed.currentDate };
const example = (id: string) => seed.examples.find((item) => item.id === id)!;

describe('draftFromText', () => {
  it('drafts the usage billing request completely', () => {
    const { draft, needsReview, filledFields } = draftFromText(example('prompt-1').input, context);

    expect(draft.customerName).toBe('Acme Labs');
    expect(draft.paymentTerms).toBe('Net 30');
    expect(draft.dueDate).toBe('2026-06-03');
    expect(draft.memo).toBe('April platform subscription and usage overage.');
    expect(draft.lineItems).toEqual([
      { description: 'Platform subscription', quantity: 1, unitPrice: 12000, accountCode: '4000' },
      { description: 'Usage overage: event volume', quantity: 1480000, unitPrice: 0.012, accountCode: '4010' },
    ]);
    expect(filledFields).toEqual(expect.arrayContaining(example('prompt-1').expectedDraftFields));
    expect(needsReview).toEqual([]);
    expect(validateInvoiceInput(draft).ok).toBe(true);
  });

  it('flags the guesses in the incomplete services request', () => {
    const { draft, needsReview } = draftFromText(example('prompt-2').input, context);

    expect(draft.customerName).toBe('Brightline Health');
    expect(draft.lineItems.map((line) => [line.quantity, line.unitPrice])).toEqual([
      [40, 275],
      [12, 225],
    ]);
    expect(draft.discount).toBe(1000);
    expect(draft.taxRate).toBe(0);
    expect(needsReview.join(' ')).toMatch(/discount/i);
    expect(needsReview.join(' ')).toMatch(/tax/i);
  });

  it("asks for a customer when it can't find one", () => {
    const { draft, needsReview } = draftFromText('Bill someone for 3 hours at $100', context);
    expect(draft.customerName).toBe('');
    expect(needsReview[0]).toMatch(/customer/i);
  });
});
