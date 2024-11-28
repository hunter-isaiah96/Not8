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
        <v-avatar v-bind="props">
          <!-- <v-img
            :width="12"
            :src="pb.getFileUrl(props.comment.expand.user, props.comment.expand.user.avatar)"
          ></v-img> -->
        </v-avatar>
      </template>
      <Comment
        :controls="false"
        :comment="comment"
      />
    </v-menu>
  </div>
</template>
<script setup>
const props = defineProps({
  comment: Object,
})
console.log(props.comment.expand.user)
const pb = usePocketbase()
const avatarSize = 35
const translateAmount = avatarSize / 2
</script>
<style lang="scss">
.pinned-comment {
  position: absolute;
}
</style>
