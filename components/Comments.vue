<template>
  <v-row>
    <v-col
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
