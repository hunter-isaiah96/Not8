<template>
  <div
    class="pinned-comment"
    :style="{ '--x': properties.x + '%', '--y': properties.y + '%', transform: `translate(-${translateAmount}px, -${translateAmount}px)` }"
  >
    <!-- Avatar component -->
    <v-avatar
      :size="avatarSize"
      color="primary"
      class="pa-1 mb-2"
    >
      <v-img src="https://cdn.vuetifyjs.com/images/logos/v-alt.svg"></v-img>
    </v-avatar>

    <!-- Comment Card -->
    <v-card
      min-width="400"
      class="comment-box"
      title="Isaiah"
    >
      <template v-slot:append>
        <v-btn
          size="x-small"
          icon="mdi-close"
          @click="close"
        ></v-btn>
      </template>
      <v-card-text class="py-0">
        <v-text-field
          label="New Comment..."
          hide-details
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-list-item class="w-100">
          <template v-slot:append>
            <v-btn
              color="primary"
              icon="mdi-send"
            ></v-btn>
          </template>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
// const videoStore = useVideoStore()
// const userStore = useUserStore()
// const commentsStore = useCommentsStore()
// const assetStore = useAssetStore()

// const { currentTime, videoPlayerDetails } = storeToRefs(videoStore)
// const { user } = storeToRefs(userStore)
// const { asset } = storeToRefs(assetStore)
// const { addComment } = commentsStore
const emit = defineEmits({
  close: () => true,
})

const props = defineProps({
  properties: Object,
})

const avatarSize = 35
const translateAmount = avatarSize / 2

const close = () => {
  emit("close")
}
</script>

<style scoped>
.pinned-comment {
  position: absolute;
  left: var(--x); /* Position horizontally based on x percent */
  top: var(--y); /* Position vertically based on y percent */
}
</style>
