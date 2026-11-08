// dates are plain yyyy-mm-dd strings, so do the math in utc
export const addDays = (iso: string, days: number) => {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day) + days * 86_400_000).toISOString().slice(0, 10)
}
