<template>
  <div v-if="props.asset.mediaURL">
    <div
      class="video-wrapper"
      @click="startPinnedComment"
    >
      <video
        ref="videoPlayer"
        class="d-block"
        @playing="setPlaying"
        @pause="setPaused"
        @durationchange="setDuration"
        @dblclick="toggleFullscreen"
      >
        <source
          :src="props.asset.mediaURL"
          type="video/mp4"
        />
      </video>
      <PinnedComments v-if="videoPlayerDetails.paused"></PinnedComments>
    </div>

    <!-- Slider Control -->
    <v-slider
      v-model="currentSeek"
      hide-details
      class="slider"
      color="primary"
      :thumb-size="0"
      @start="startSeek"
      @update:model-value="onSeek"
      @end="stopSeek"
    />

    <!-- Timestamped Comments -->
    <CommentStamps
      :timeFormat="videoPlayerDetails.selectedTimeFormat"
      :duration="videoPlayerDetails.duration"
    ></CommentStamps>

    <!-- Toolbar -->
    <v-toolbar
      color="#20222b"
      density="compact"
    >
      <v-row no-gutters>
        <v-col cols="4">
          <v-btn
            icon
            @click="togglePlay"
          >
            <v-icon>{{ videoPlayerDetails.paused ? "mdi-play" : "mdi-pause" }}</v-icon>
          </v-btn>
          <SpeedMenu
            :speed="videoPlayerDetails.speed"
            @update-speed="setVideoSpeed"
          />
        </v-col>

        <v-col
          class="d-flex align-center justify-center"
          cols="4"
        >
          <TimeFormatMenu
            :time-format="videoPlayerDetails.selectedTimeFormat"
            :current-time="currentTime"
            :total-time="totalTime"
            :video-player-time="videoPlayerDetails.currentTime"
            :fps="asset?.metadata.fps"
            @updateFormat="updateFormat"
          />
        </v-col>

        <v-col
          class="d-flex align-center justify-end"
          cols="4"
        >
          <v-btn icon><v-icon>mdi-closed-caption</v-icon></v-btn>
          <v-btn
            icon
            @click="toggleFullscreen"
            ><v-icon>mdi-fullscreen</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-toolbar>
  </div>
</template>

<script setup>
import { useVideoStore } from "~/store/video"
const videoStore = useVideoStore()
const props = defineProps({ asset: Object })

const { videoPlayer, videoPlayerDetails, currentTime, totalTime, currentSeek } = storeToRefs(videoStore)
const { setVideoSpeed, toggleFullscreen, togglePlay, pause, setPlaying, setPaused, setDuration, startSeek, onSeek, stopSeek, animationFrameId } = videoStore

/* Video State Handlers */
const updateFormat = (format) => {
  videoPlayerDetails.value.selectedTimeFormat = [format]
}
onBeforeUnmount(() => cancelAnimationFrame(animationFrameId))
</script>

<style lang="scss">
.video-wrapper {
  position: relative;
  overflow: hidden;
}

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
