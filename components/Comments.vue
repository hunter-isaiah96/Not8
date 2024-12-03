<template>
  <v-list class="pa-2">
    <v-empty-state
      v-if="comments.length == 0"
      icon="mdi-comment-text-outline"
      title="No Comments..."
      text="It's quiet in here. Start the conversation by leaving the first comment"
    ></v-empty-state>
    <v-list-item
      v-else
      v-for="comment in comments"
      :key="comment.id"
      class="px-0"
    >
      <Comment
        :time-format="videoPlayerDetails.selectedTimeFormat"
        @go-to-timestamp="goToTimestamp(comment.timestamp)"
        :comment="comment"
      ></Comment>
    </v-list-item>
  </v-list>
</template>
<script setup>
import { useCommentsStore } from "~/store/comments"
import { useVideoStore } from "~/store/video"

const route = useRoute()

const commentStore = useCommentsStore()
const { comments } = storeToRefs(commentStore)

const { fetchComments } = commentStore
fetchComments(route.params.id)
const videoStore = useVideoStore()
const { videoPlayerDetails } = storeToRefs(videoStore)

const emits = defineEmits(["goToTimestamp"])

const goToTimestamp = function (timestamp) {
  emits("goToTimestamp", timestamp)
}

defineExpose({
  goToTimestamp,
})
</script>
