<template>
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
          <v-img
            :width="12"
            :src="pb.getFileUrl(comment.expand.user, comment.expand.user.avatar)"
          />
        </v-btn>
      </template>
      <Comment
        :controls="false"
        :comment="comment"
        @goToTimestamp="goToTimestamp(comment.timestamp)"
        :time-format="timeFormat"
      />
    </v-menu>
  </div>
</template>
<script setup>
import { useCommentsStore } from "~/store/comments"
import { useVideoStore } from "~/store/video"
const videoStore = useVideoStore()
const commentsStore = useCommentsStore()
const pb = usePocketbase()
const filters = useFilters()

const props = defineProps({
  timeFormat: Array,
  duration: Number,
})

const { timestampedComments } = storeToRefs(commentsStore)
const { goToTimestamp } = videoStore

const getCommentStampStyle = (timestamp) => {
  const left = `${filters.clamp((timestamp / props.duration) * 100, 0, 99)}%`
  const transform = filters.clamp((timestamp / props.duration) * 100, 0, 99) > 0.5 ? `translateX(-50%) translateY(-50%)` : `translateX(0%) translateY(-50%)`
  return { left, transform }
}
</script>
<style lang="scss" scoped>
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
