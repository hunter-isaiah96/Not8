<template>
  <video
    class="d-block"
    ref="videoPlayer"
    @timeupdate="updateTime"
    @click="togglePlay"
    @playing="setPlaying"
    @pause="setPaused"
    @durationchange="setDuration"
  >
    <source
      :src="props.asset.mediaURL"
      type="video/mp4"
    />
  </video>

  <v-slider
    v-model="currentSeek"
    hide-details
    @start="startSeek"
    @update:model-value="onSeek"
    @end="stopSeek"
    class="slider"
    color="primary"
    :thumb-size="0"
  ></v-slider>

  <v-toolbar
    color="#20222b"
    density="compact"
  >
    <v-row>
      <v-col cols="4">
        <v-btn
          icon
          @click="togglePlay"
        >
          <v-icon>{{ videoPlayerDetails.paused ? "mdi-play" : "mdi-pause" }}</v-icon>
        </v-btn>
        <v-menu transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              >{{ videoPlayerDetails.speed }}X</v-btn
            >
          </template>
          <v-list>
            <v-list-item
              v-for="speed in speeds"
              :key="speed"
              @click="setVideoSpeed(speed)"
            >
              <v-list-item-title>{{ speed }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col
        class="d-flex align-center justify-center"
        cols="4"
      >
        {{ currentTime }} / {{ totalTime }}
      </v-col>
      <v-col
        class="d-flex align-center justify-end"
        cols="4"
      >
        <v-btn icon><v-icon>mdi-closed-caption</v-icon></v-btn>
        <v-btn
          icon
          @click="setFullscreen"
          ><v-icon>mdi-fullscreen</v-icon></v-btn
        >
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script setup>
import { useVideoStore } from "~/store/video"
const videoStore = useVideoStore()

const props = defineProps({
  asset: Object,
})

const videoPlayer = ref(null)
const currentSeek = ref(0) // Seek position
let wasPlayingBeforeSeek = false // Track if video was playing before seeking

const { videoPlayerDetails, currentTime, totalTime } = storeToRefs(videoStore)

const speeds = [0.25, 0.5, 0.75, 1, 1.5, 2, 3]

/* Video Player Controls */
const togglePlay = () => (videoPlayer.value.paused ? videoPlayer.value.play() : videoPlayer.value.pause())

const setVideoSpeed = (speed) => {
  videoPlayerDetails.value.speed = speed
  videoPlayer.value.playbackRate = speed
}

const setFullscreen = () => {
  if (videoPlayer.value.requestFullscreen) videoPlayer.value.requestFullscreen()
  else if (videoPlayer.value.webkitRequestFullscreen) videoPlayer.value.webkitRequestFullscreen()
  else if (videoPlayer.value.msRequestFullscreen) videoPlayer.value.msRequestFullscreen()
}

/* Video Player State Handlers */
const setPlaying = () => (videoPlayerDetails.value.paused = false)
const setPaused = () => (videoPlayerDetails.value.paused = true)
const setDuration = (e) => (videoPlayerDetails.value.duration = e.target.duration)
const updateTime = () => {
  videoPlayerDetails.value.currentTime = videoPlayer.value.currentTime
  currentSeek.value = (videoPlayerDetails.value.currentTime / videoPlayerDetails.value.duration) * 100 // Update seekbar
}

/* Slider Handlers */
const startSeek = () => {
  wasPlayingBeforeSeek = !videoPlayer.value.paused
  videoPlayer.value.pause()
}

const onSeek = (value) => {
  const newTime = (value / 100) * videoPlayerDetails.value.duration
  videoPlayer.value.currentTime = newTime
  videoPlayerDetails.value.currentTime = newTime
}

const stopSeek = () => {
  if (wasPlayingBeforeSeek) videoPlayer.value.play()
}

defineExpose({
  pause() {
    videoPlayer.value.pause()
  },
})
</script>

<style lang="scss">
video {
  width: 100%;
  aspect-ratio: 16/9;
}

.slider {
  margin: 0 !important;
  .v-input__control {
    min-height: auto !important;
  }
  .v-slider-track {
    border-radius: 0;
  }
}
</style>
