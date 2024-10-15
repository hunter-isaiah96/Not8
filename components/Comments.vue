<template>
  <v-row>
    <v-empty-state
      v-if="comments.length == 0"
      icon="mdi-comment-text-outline"
      title="No Comments..."
      text="It's quiet in here. Start the conversation by leaving the first comment"
    ></v-empty-state>
    <v-col
      v-else
      cols="12"
      v-for="comment in comments"
      :key="comment.id"
    >
      <Comment
        @go-to-timestamp="goToTimestamp(comment.timestamp)"
        :comment="comment"
      ></Comment>
    </v-col>
  </v-row>
</template>
<script setup>
import { useCommentsStore } from "~/store/comments"
const route = useRoute()

const commentStore = useCommentsStore()
const { comments } = storeToRefs(commentStore)
const { fetchComments } = commentStore
fetchComments(route.params.id)

const emits = defineEmits(["goToTimestamp"])

const goToTimestamp = function (timestamp) {
  emits("goToTimestamp", timestamp)
}

defineExpose({
  goToTimestamp,
})
</script>
