export const nowInSeconds = (): number => Math.round(Date.now() / 1000)

export const getTimeUntil = (
  futureTimestampInSeconds: number,
  diffFromNow: boolean = true,
): {
  days: number
  hours: number
  minutes: number
  seconds: number
} => {
  let diff = futureTimestampInSeconds
  if (diffFromNow) {
    const now = nowInSeconds()
    diff = Math.abs(futureTimestampInSeconds - now)
  }
  return {
    days: Math.floor(diff / (24 * 60 * 60)),
    hours: Math.floor((diff % (24 * 60 * 60)) / (60 * 60)),
    minutes: Math.floor((diff % (60 * 60)) / 60),
    seconds: diff % 60,
  }
}
