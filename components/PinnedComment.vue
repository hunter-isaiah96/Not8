<template>
  <div
    class="pinned-comment"
    :style="{ left: comment.metadata.x + '%', top: comment.metadata.y + '%', transform: `translate(-${translateAmount}px, -${translateAmount}px)` }"
  >
    <v-menu
      open-on-hover
      close-delay="200"
      location="top"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <v-avatar
          :size="avatarSize"
          v-bind="props"
        >
          <v-img :src="pb.getFileUrl(comment.expand.user, comment.expand.user.avatar)"></v-img>
        </v-avatar>
      </template>
      <Comment
        :time-format="timeFormat"
        @go-to-timestamp="goToTimestamp(comment.timestamp)"
        :comment="comment"
        :controls="false"
      ></Comment>
    </v-menu>
  </div>
</template>
<script setup>
const props = defineProps({
  comment: Object,
  timeFormat: Array,
})
const pb = usePocketbase()
const avatarSize = 25
const translateAmount = avatarSize / 2
</script>
<style lang="scss">
.pinned-comment {
  position: absolute;
}
</style>
