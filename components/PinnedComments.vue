<template>
  <div
    class="pinned-comments"
    ref="pinnedCommentsWrapper"
    @click="startPinnedComment"
  >
    <NewPinnedComment
      v-if="newPinnedComment"
      :properties="newPinnedComment"
      @close="closePinnedComment"
    ></NewPinnedComment>

    <PinnedComment
      v-for="comment in shownComments"
      :key="comment.id"
      :comment="comment"
      :timeFormat="videoPlayerDetails.selectedTimeFormat"
    ></PinnedComment>
  </div>
</template>

<script setup>
import { useCommentsStore } from "~/store/comments"
import { useVideoStore } from "~/store/video"

const commentStore = useCommentsStore()
const videoStore = useVideoStore()
const { pinnedComments } = storeToRefs(commentStore)
const { videoPlayerDetails } = storeToRefs(videoStore)

const newPinnedComment = ref(null)
const pinnedCommentsWrapper = ref(null)

const startPinnedComment = (e) => {
  if (e.target.closest(".pinned-comment, .comment-box")) return

  const rect = pinnedCommentsWrapper.value.getBoundingClientRect()
  const xPercent = ((e.clientX - rect.left) / rect.width) * 100
  const yPercent = ((e.clientY - rect.top) / rect.height) * 100

  newPinnedComment.value = { x: xPercent, y: yPercent }
}

// Tolerance for time comparison (adjust as needed, e.g., 0.01 for 10ms tolerance)
const TOLERANCE = 0.01

const shownComments = computed(() =>
  pinnedComments.value.filter((comm) => {
    const videoTime = parseFloat(videoPlayerDetails.value.currentTime.toFixed(2))
    const commentTime = parseFloat(comm.timestamp.toFixed(2))

    return Math.abs(videoTime - commentTime) <= TOLERANCE
  })
)

const closePinnedComment = () => {
  newPinnedComment.value = null
}
</script>

<style lang="scss">
.pinned-comments {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
