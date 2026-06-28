export function formatGameDateTime(value?: string | number | Date | null) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour = hours % 12 || 12

  return `${year}. ${month}. ${day}. ${period} ${hour}:${minutes}:${seconds}`
}
