<template>
  <v-card>
    <template v-slot:prepend>
      <v-avatar color="primary">
        <v-img :src="user.avatar"></v-img>
      </v-avatar>
    </template>
    <template v-slot:title>
      <div class="d-flex align-center">
        <span class="text-subtitle-2 text-capitalize">{{ comment.expand.user.username }}</span>
        <span>&nbsp;-&nbsp;</span>
        <span class="text-subtitle-2 text-capitalize opacity-40">{{ useFilters().timeAgo(comment.created) }}</span>
        <v-spacer></v-spacer>
        <div v-if="user.id == comment.user">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                density="comfortable"
                size="x-small"
                class="mr-2"
                v-bind="props"
              ></v-btn>
            </template>
            <v-card>
              <v-list>
                <v-list-item append-icon="mdi-pencil"> Edit </v-list-item>
                <v-list-item
                  @click="deleteComment(comment.id)"
                  base-color="error"
                  append-icon="mdi-delete"
                >
                  Delete
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </div>
    </template>
    <template v-slot:subtitle>
      <div v-if="comment.timed">
        <span
          class="text-white bg-primary cursor-pointer px-1"
          @click="goToTimestamp"
        >
          {{ commentTime }}
        </span>
        <span>&nbsp;</span>
      </div>
      <span class="text-subtitle-2">{{ comment.text }}</span>
    </template>
    <v-card-text
      v-if="controls"
      class="d-flex"
    >
      <v-btn
        size="x-small"
        class="mr-2 opacity-70"
        flat
        >Reply</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useUserStore } from "~/store/user"
import { useVideoStore } from "~/store/video"
import { useCommentsStore } from "~/store/comments"
const pb = usePocketbase()
const userStore = useUserStore()
const videoStore = useVideoStore()
const commentsStore = useCommentsStore()
const { user } = storeToRefs(userStore)
const { videoPlayerDetails } = storeToRefs(videoStore)
const { deleteComment } = commentsStore
const props = defineProps({
  comment: Object,
  controls: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["goToTimestamp"])

const goToTimestamp = () => {
  emit("goToTimestamp")
}

const commentTime = computed(() => {
  if (videoPlayerDetails.value.selectedTimeFormat[0] === "Standard") return useFilters().formatTime(props.comment.timestamp)
  else return `${Math.round(props.comment.timestamp * props.comment.expand.asset.metadata.fps)}`
})
</script>
