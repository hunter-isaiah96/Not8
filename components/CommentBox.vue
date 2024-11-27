<template>
  <v-card elevation="0">
    <v-card-text class="pa-2 pb-0">
      <v-form @submit.prevent="submitComment">
        <v-text-field
          hide-details
          variant="underlined"
          label="Leave your comment here..."
          v-model="comment"
          @input="pauseVideo"
          :disabled="addingComment"
          class="comment-input"
        >
          <template v-slot:prepend>
            <span
              v-if="commentAtTimestamp"
              class="text-subtitle-2 text-capitalize bg-primary px-2 mr-2"
            >
              {{ currentTime }}
            </span>
          </template>
        </v-text-field>
      </v-form>
      <div class="d-flex align-center mt-2">
        <v-tooltip
          :text="commentAtTimestamp ? 'Remove Timestamp' : 'Add Timestamp'"
          location="top"
          open-delay="700"
        >
          <template v-slot:activator="{ props }">
            <label
              class="cursor-pointer pa-0"
              v-bind="props"
            >
              <v-icon
                small
                :color="commentAtTimestamp ? 'primary' : ''"
              >
                mdi-alarm
              </v-icon>
              <!-- <span :class="{ 'text-primary': commentAtTimestamp }">{{ currentTime }}</span> -->
              <v-checkbox
                hide-details
                class="ml-2 mt-0 pt-0 d-none"
                color="primary"
                v-model="commentAtTimestamp"
                :disabled="addingComment"
              ></v-checkbox>
            </label>
          </template>
        </v-tooltip>

        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="submitComment"
          :disabled="addingComment"
          size="small"
          flat
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.comment-input {
  :deep(.v-input__prepend) {
    margin: 0 !important;
  }
}
</style>
<script setup>
import { useVideoStore } from "~/store/video"
import { useUserStore } from "~/store/user"
import { useCommentsStore } from "~/store/comments"
import { useAssetStore } from "~/store/asset"

const videoStore = useVideoStore()
const userStore = useUserStore()
const commentsStore = useCommentsStore()
const assetStore = useAssetStore()

const { currentTime, videoPlayerDetails } = storeToRefs(videoStore)
const { user } = storeToRefs(userStore)
const { asset } = storeToRefs(assetStore)
const { addComment } = commentsStore
const comment = ref("")
const commentAtTimestamp = ref(false)
const emit = defineEmits(["pause-video"])

const addingComment = ref(false)

const submitComment = async function () {
  addingComment.value = true
  try {
    await addComment({
      asset: asset.value.id,
      user: user.value.id,
      text: comment.value,
      timed: commentAtTimestamp.value,
      timestamp: videoPlayerDetails.value.currentTime,
      type: "comment",
    })
    comment.value = ""
  } catch (e) {
  } finally {
    addingComment.value = false
  }
}

const pauseVideo = function () {
  emit("pause-video")
}
</script>
