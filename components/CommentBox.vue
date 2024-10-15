<template>
  <v-card class="mt-4">
    <v-card-text>
      <div>
        <v-text-field
          hide-details
          variant="underlined"
          label="Leave your comment here..."
          v-model="comment"
          @input="pauseVideo"
          :disabled="addingComment"
        >
          <template v-slot:prepend>
            <v-avatar
              color="primary"
              size="30"
            >
              <v-img
                :alt="user.username"
                :src="user.avatar"
              ></v-img>
            </v-avatar>
          </template>
        </v-text-field>
      </div>
      <div class="d-flex align-center mt-2">
        <label class="cursor-pointer pa-0">
          <v-card
            class="d-flex align-center rounded caption px-2"
            color="background"
            height="40"
          >
            <v-icon
              small
              class="mr-2"
              :color="commentAtTimestamp ? 'primary' : ''"
            >
              mdi-alarm
            </v-icon>
            <span :class="{ 'text-primary': commentAtTimestamp }">{{ currentTime }}</span>
            <v-checkbox
              hide-details
              class="ml-2 mt-0 pt-0"
              color="primary"
              v-model="commentAtTimestamp"
              :disabled="addingComment"
            ></v-checkbox>
          </v-card>
        </label>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="submitComment()"
          :disabled="addingComment"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
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
