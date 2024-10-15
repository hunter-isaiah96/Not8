import { defineStore } from "pinia"

export const useVideoStore = defineStore("videoStore", () => {
  const videoPlayerDetails = reactive({
    src: "",
    duration: 0,
    paused: true,
    speed: 1,
    currentTime: 0,
  })

  const comments = ref([])

  const currentTime = computed(() => formatTime(videoPlayerDetails.currentTime))
  const totalTime = computed(() => formatTime(videoPlayerDetails.duration))

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    return hrs > 0
      ? `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return { videoPlayerDetails, currentTime, totalTime, comments }
})
