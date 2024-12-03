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
          :text="timestampTooltip"
          location="top"
          open-delay="700"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              :color="commentAtTimestamp ? 'primary' : ''"
              v-bind="props"
              @click="toggleTimestamp"
              :disabled="addingComment"
            >
              <v-icon small>mdi-alarm</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="submitComment"
          :disabled="addingComment || !comment.trim()"
          size="small"
          flat
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue"
import { useVideoStore } from "~/store/video"
import { useUserStore } from "~/store/user"
import { useCommentsStore } from "~/store/comments"
import { useAssetStore } from "~/store/asset"

const videoStore = useVideoStore()
const userStore = useUserStore()
const commentsStore = useCommentsStore()
const assetStore = useAssetStore()

const { currentTime } = storeToRefs(videoStore)
const { user } = storeToRefs(userStore)
const { asset } = storeToRefs(assetStore)
const { addComment } = commentsStore

const comment = ref("")
const commentAtTimestamp = ref(false)
const addingComment = ref(false)
const emit = defineEmits(["pauseVideo"])

const pauseVideo = () => emit("pauseVideo")

const toggleTimestamp = () => {
  commentAtTimestamp.value = !commentAtTimestamp.value
}

const timestampTooltip = computed(() => (commentAtTimestamp.value ? "Remove Timestamp" : "Add Timestamp"))

const submitComment = async () => {
  if (!comment.trim()) return

  addingComment.value = true
  try {
    await addComment({
      asset: asset.value.id,
      user: user.value.id,
      text: comment.value.trim(),
      timed: commentAtTimestamp.value,
      timestamp: currentTime.value,
      type: "comment",
    })
    comment.value = ""
    commentAtTimestamp.value = false
  } catch (e) {
    console.error(e)
  } finally {
    addingComment.value = false
  }
}
</script>

<style lang="scss" scoped>
.comment-input {
  :deep(.v-input__prepend) {
    margin: 0 !important;
  }
}
</style>
