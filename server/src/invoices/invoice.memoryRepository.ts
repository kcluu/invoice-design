import type { InvoiceRepository } from './invoice.repository'
import type { Invoice } from './invoice.types'

// in-memory stand-in used by tests so they don't need a running postgres
export const createMemoryRepository = (initial: Invoice[] = []): InvoiceRepository => {
  const store = new Map(initial.map((invoice) => [invoice.id, structuredClone(invoice)]))
  const copy = (invoice: Invoice) => structuredClone(invoice)

  return {
    async list() {
      return [...store.values()]
        .sort((a, b) => b.issueDate.localeCompare(a.issueDate) || b.invoiceNumber.localeCompare(a.invoiceNumber))
        .map(copy)
    },
    async findById(id) {
      const invoice = store.get(id)
      return invoice ? copy(invoice) : null
    },
    async insert(invoice) {
      if (store.has(invoice.id)) throw new Error(`invoice ${invoice.id} already exists`)
      store.set(invoice.id, copy(invoice))
      return copy(invoice)
    },
    async update(invoice) {
      store.set(invoice.id, copy(invoice))
      return copy(invoice)
    },
    async remove(id) {
      return store.delete(id)
    },
  }
}
