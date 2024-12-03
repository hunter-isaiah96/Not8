import { defineStore } from "pinia"

export const useVideoStore = defineStore("videoStore", () => {
  const filters = useFilters()

  const videoPlayer = ref(null)
  const currentSeek = ref(0)
  const animationFrameId = ref(null)

  const videoPlayerDetails = reactive({
    src: "",
    duration: 0,
    paused: true,
    speed: 1,
    currentTime: 0,
    selectedTimeFormat: ["Standard"],
  })

  let wasPlayingBeforeSeek = false

  // Computed properties for formatted time
  const currentTime = computed(() => filters.formatTime(videoPlayerDetails.currentTime))
  const totalTime = computed(() => filters.formatTime(videoPlayerDetails.duration))

  /** Video control methods */
  const setVideoSpeed = (speed) => {
    videoPlayerDetails.speed = speed
    if (videoPlayer.value) videoPlayer.value.playbackRate = speed
  }

  const togglePlay = () => {
    if (videoPlayer.value) {
      videoPlayer.value.paused ? videoPlayer.value.play() : videoPlayer.value.pause()
    }
  }

  const toggleFullscreen = () => videoPlayer.value?.requestFullscreen()

  const pause = () => videoPlayer.value?.pause()

  /** Video state handlers */
  const setPlaying = () => {
    videoPlayerDetails.paused = false
    updateFrame()
  }

  const setPaused = () => {
    videoPlayerDetails.paused = true
    cancelAnimationFrame(unref(animationFrameId))
  }

  const setDuration = (e) => (videoPlayerDetails.duration = e.target.duration)

  /** Seek control */
  const startSeek = () => {
    wasPlayingBeforeSeek = !videoPlayer.value?.paused
    pause()
  }

  const onSeek = (value) => {
    const newTime = (value / 100) * videoPlayerDetails.duration
    if (videoPlayer.value) {
      videoPlayer.value.currentTime = newTime
      videoPlayerDetails.currentTime = newTime
    }
  }

  const stopSeek = () => {
    if (wasPlayingBeforeSeek) videoPlayer.value?.play()
    cancelAnimationFrame(unref(animationFrameId))
  }

  /** Utility methods */
  const goToTimestamp = (timestamp) => {
    if (videoPlayer.value) {
      videoPlayer.value.currentTime = timestamp
      updateFrame()
    }
  }

  const updateFrame = () => {
    if (videoPlayer.value) {
      videoPlayerDetails.currentTime = videoPlayer.value.currentTime
      currentSeek.value = (videoPlayerDetails.currentTime / videoPlayerDetails.duration) * 100
      animationFrameId.value = requestAnimationFrame(updateFrame)
    }
  }

  return {
    videoPlayer,
    videoPlayerDetails,
    currentSeek,
    currentTime,
    totalTime,
    setVideoSpeed,
    togglePlay,
    toggleFullscreen,
    pause,
    setPlaying,
    setPaused,
    setDuration,
    startSeek,
    onSeek,
    stopSeek,
    goToTimestamp,
  }
})
