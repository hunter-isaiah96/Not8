export const useFilters = () => {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    return hrs > 0
      ? `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b)
  }

  // Function to get the aspect ratio as a string like "16/9"
  function getAspectRatioString(width, height) {
    const divisor = gcd(width, height)
    const aspectWidth = width / divisor
    const aspectHeight = height / divisor
    return `${aspectWidth}:${aspectHeight}`
  }

  const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value))
  }

  function getTimestampPercentage(timestamp, totalDuration) {
    if (totalDuration === 0) {
      return 0 // Avoid division by zero
    }
    return (timestamp / totalDuration) * 100
  }

  return {
    formatTime,
    getAspectRatioString,
    clamp,
    getTimestampPercentage,
  }
}