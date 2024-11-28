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
        @dblclick="setFullscreen"
      >
        <source
          :src="props.asset.mediaURL"
          type="video/mp4"
        />
      </video>
      <div v-if="newPinnedComment">
        <NewPinnedComment
          :properties="newPinnedComment"
          @close="closePinnedComment"
        ></NewPinnedComment>
      </div>
      <div v-if="videoPlayerDetails.paused">
        <PinnedComment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
        ></PinnedComment>
      </div>
    </div>

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

    <div class="comment-stamps bg-surface">
      <v-menu
        v-for="comment in timestampedComments"
        :key="comment.id"
        open-on-hover
        close-delay="200"
        location="top"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            class="comment-stamp overflow-hidden"
            color="primary"
            density="compact"
            size="x-small"
            v-bind="props"
            @click="goToTimestamp(comment.timestamp)"
            :style="getCommentStampStyle(comment.timestamp)"
          >
            <template v-slot:default>
              <v-img
                :width="12"
                :src="pb.getFileUrl(comment.expand.user, comment.expand.user.avatar)"
              ></v-img>
            </template>
          </v-btn>
        </template>
        <Comment
          :controls="false"
          :comment="comment"
          @go-to-timestamp="goToTimestamp(comment.timestamp)"
        />
      </v-menu>
    </div>

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
          <v-menu location="top">
            <template v-slot:activator="{ props, isActive }">
              <v-btn
                :append-icon="isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                v-bind="props"
                >{{ timeFormated }}</v-btn
              >
            </template>
            <v-card subtitle="Time Format">
              <v-list
                class="pt-0"
                v-model:selected="videoPlayerDetails.selectedTimeFormat"
              >
                <v-list-item
                  v-for="timeFormat in timeFormats"
                  :key="timeFormat"
                  :value="timeFormat"
                >
                  <v-list-item-title>{{ timeFormat }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
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
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue"
import { useCommentsStore } from "~/store/comments"
import { useVideoStore } from "~/store/video"

const pb = usePocketbase()

const filters = useFilters()
const videoStore = useVideoStore()
const commentsStore = useCommentsStore()

const props = defineProps({ asset: Object })

const { comments } = storeToRefs(commentsStore)

const videoPlayer = ref(null)
const currentSeek = ref(0)
const newPinnedComment = ref(null)

let wasPlayingBeforeSeek = false
let animationFrameId = null

const { videoPlayerDetails, currentTime, totalTime } = storeToRefs(videoStore)
const { timestampedComments } = storeToRefs(commentsStore)

const speeds = [0.25, 0.5, 0.75, 1, 1.5, 2, 3]
const timeFormats = ["Standard", "Frames"]

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

const pause = () => {
  videoPlayer.value.pause()
}

/* Video State Handlers */
const setPlaying = () => {
  videoPlayerDetails.value.paused = false
  updateFrame()
}

const setPaused = () => {
  videoPlayerDetails.value.paused = true
  cancelAnimationFrame(animationFrameId)
}

const setDuration = (e) => (videoPlayerDetails.value.duration = e.target.duration)

/* Update Frame with requestAnimationFrame */
const updateFrame = () => {
  videoPlayerDetails.value.currentTime = videoPlayer.value.currentTime
  currentSeek.value = (videoPlayerDetails.value.currentTime / videoPlayerDetails.value.duration) * 100
  animationFrameId = requestAnimationFrame(updateFrame)
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

const stopSeek = () => wasPlayingBeforeSeek && videoPlayer.value.play()

const getTimestampPercentage = (timestamp) => filters.getTimestampPercentage(timestamp, videoPlayerDetails.value.duration)

const goToTimestamp = (timestamp) => {
  videoPlayer.value.currentTime = timestamp
  updateFrame()
}

const getCommentStampStyle = (timestamp) => {
  const left = `${filters.clamp(getTimestampPercentage(timestamp), 0, 99.3)}%`
  const transform = `translateX(-${getTimestampPercentage(timestamp) < 1.3 ? 0 : 50}%) translateY(-50%)`
  return { left, transform }
}

const timeFormated = computed(() =>
  videoPlayerDetails.value.selectedTimeFormat[0] === "Standard"
    ? `${currentTime.value} / ${totalTime.value}`
    : `${Math.round(videoPlayerDetails.value.currentTime * parseFloat(props.asset?.metadata.fps))}`
)

// Pinned Comment Functionality

const startPinnedComment = (e) => {
  pause()
  // Find the closest parent element with the class .comment-box
  const parentElement = e.target.closest(".comment-box") // This will find the closest parent with .comment-box

  // If the parent element with .comment-box is not found (i.e., the click was outside .comment-box)
  if (!parentElement) {
    // Get bounding rectangle of the wrapper div (the element clicked)
    const rect = videoPlayer.value.getBoundingClientRect()

    // Calculate click position relative to the div
    const xPosition = e.clientX - rect.left
    const yPosition = e.clientY - rect.top

    // Convert to percentages
    const xPercent = (xPosition / rect.width) * 100
    const yPercent = (yPosition / rect.height) * 100

    // Save the new pinned comment position
    newPinnedComment.value = {
      x: xPercent,
      y: yPercent,
    }

    console.log(newPinnedComment.value)
  }
}

const closePinnedComment = () => {
  newPinnedComment.value = null
}

onBeforeUnmount(() => cancelAnimationFrame(animationFrameId))

defineExpose({
  pause,
  goToTimestamp,
})
</script>

<style lang="scss">
.video-wrapper {
  position: relative;
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

.comment-stamps {
  position: relative;
  height: 20px;
  .comment-stamp {
    position: absolute;
    top: 50%;
    transform: translateY(50%);
  }
}
</style>
