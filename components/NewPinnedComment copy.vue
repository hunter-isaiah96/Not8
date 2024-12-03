<template>
  <div
    class="pinned-comment"
    :style="{ '--x': properties.x + '%', '--y': properties.y + '%', transform: `translate(-${translateAmount}px, -${translateAmount}px)` }"
  >
    <v-menu mod>
      <template v-slot:activator="{ props }">
        <v-avatar
          :size="avatarSize"
          v-bind="props"
        >
          <v-img
            :alt="user.username"
            :src="user.avatar"
          ></v-img>
        </v-avatar>
      </template>
      <v-card
        min-width="400"
        class="comment-box"
        title="Isaiah"
        :style="{ right: properties.x > 50 ? '0px' : 'unset' }"
      >
        <template v-slot:append>
          <v-btn
            :disabled="addingComment"
            size="x-small"
            icon="mdi-close"
            @click="close"
          ></v-btn>
        </template>
        <v-card-text class="py-0">
          <v-text-field
            :disabled="addingComment"
            label="New Comment..."
            v-model="comment"
            hide-details
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-list-item class="w-100">
            <template v-slot:append>
              <v-btn
                :disabled="addingComment"
                color="primary"
                icon="mdi-send"
                @click="submitComment"
              ></v-btn>
            </template>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { useVideoStore } from "~/store/video"
import { useUserStore } from "~/store/user"
import { useCommentsStore } from "~/store/comments"
import { useAssetStore } from "~/store/asset"

const videoStore = useVideoStore()
const userStore = useUserStore()
const commentsStore = useCommentsStore()
const assetStore = useAssetStore()

const { videoPlayerDetails } = storeToRefs(videoStore)
const { user } = storeToRefs(userStore)
const { asset } = storeToRefs(assetStore)
const { addComment } = commentsStore
const comment = ref("")
const addingComment = ref(false)

const emit = defineEmits({
  close: () => true,
})

const props = defineProps({
  properties: Object,
})

const avatarSize = 25
const translateAmount = avatarSize / 2

const close = () => {
  emit("close")
}

const submitComment = async () => {
  addingComment.value = true
  try {
    await addComment({
      asset: asset.value.id,
      user: user.value.id,
      text: comment.value,
      timed: true,
      timestamp: videoPlayerDetails.value.currentTime,
      type: "pinned",
      metadata: props.properties,
    })
    comment.value = ""
    close()
  } catch (e) {
    console.log(e)
  } finally {
    addingComment.value = false
  }
}
</script>

<style scoped>
.pinned-comment {
  position: absolute;
  left: var(--x); /* Position horizontally based on x percent */
  top: var(--y); /* Position vertically based on y percent */
  z-index: 1000;
}
</style>
