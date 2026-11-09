import { describe, expect, it } from 'vitest';
import { parseRoute, paths } from './useHashRoute';

describe('parseRoute', () => {
  it('defaults to the invoice list', () => {
    expect(parseRoute('')).toEqual({ name: 'list' });
    expect(parseRoute('#/somewhere-else')).toEqual({ name: 'list' });
  });

  it('reads new, detail and edit routes', () => {
    expect(parseRoute('#/invoices/new')).toEqual({ name: 'new' });
    expect(parseRoute(`#${paths.newFromText()}`)).toEqual({ name: 'new', fromText: true });
    expect(parseRoute(`#${paths.detail('inv-2026-0412')}`)).toEqual({ name: 'detail', id: 'inv-2026-0412' });
    expect(parseRoute(`#${paths.edit('inv-2026-0412')}`)).toEqual({ name: 'edit', id: 'inv-2026-0412' });
  });
});
