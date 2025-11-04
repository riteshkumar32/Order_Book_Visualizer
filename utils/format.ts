export const formatPrice = (p: number) => {
  if (!Number.isFinite(p)) return '--'
  if (Math.abs(p) >= 1000) return p.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return p.toFixed(2)
}

export const formatAmount = (a: number) => {
  if (!Number.isFinite(a)) return '--'
  if (Math.abs(a) >= 1000) return a.toLocaleString(undefined, { maximumFractionDigits: 4 })
  return a.toFixed(4)
}
