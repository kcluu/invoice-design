// dates are plain yyyy-mm-dd strings, so do the math in utc
export const addDays = (iso: string, days: number) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day) + days * 86_400_000).toISOString().slice(0, 10);
};

export const daysBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);

// an invoice is dated the day it goes out, so a draft written earlier keeps its full terms from the send date.
// the gap between issue and due date carries over, which covers both terms based and hand picked due dates
export const datesOnSend = (invoice: { issueDate: string; dueDate: string }, sendDate: string) => ({
  issueDate: sendDate,
  dueDate: addDays(sendDate, Math.max(0, daysBetween(invoice.issueDate, invoice.dueDate))),
});
