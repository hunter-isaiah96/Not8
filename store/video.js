import { defineStore } from "pinia"

export const useVideoStore = defineStore("videoStore", () => {
  const filters = useFilters()
  const videoPlayerDetails = reactive({
    src: "",
    duration: 0,
    paused: true,
    speed: 1,
    currentTime: 0,
    selectedTimeFormat: ["Standard"],
  })

  const currentTime = computed(() => filters.formatTime(videoPlayerDetails.currentTime))
  const totalTime = computed(() => filters.formatTime(videoPlayerDetails.duration))

  return { videoPlayerDetails, currentTime, totalTime }
})
