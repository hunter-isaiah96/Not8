<template>
  <v-card color="background">
    <template v-slot:prepend>
      <v-avatar color="primary">
        <v-img :src="avatar"></v-img>
      </v-avatar>
    </template>
    <template v-slot:title>
      <div class="d-flex align-center">
        <span class="text-subtitle-2 text-capitalize">{{ comment.expand.user.username }}</span>
        <span class="text-subtitle-2 text-capitalize opacity-40">&nbsp;-&nbsp;{{ useFilters().timeAgo(comment.created) }}</span>
        <v-spacer></v-spacer>
        <v-menu v-if="user.id == comment.user && controls">
          <template v-slot:activator="{ props }">
            <v-btn
              color="transparent"
              icon="mdi-dots-vertical"
              density="comfortable"
              size="x-small"
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
    </template>
    <template v-slot:subtitle>
      <div>
        <span v-if="comment.timed">
          <span
            class="text-white bg-primary cursor-pointer px-1"
            @click="goToTimestamp"
          >
            {{ commentTime }}
          </span>
          <span>&nbsp;</span>
        </span>
        <span class="text-subtitle-2">{{ comment.text }}</span>
      </div>
    </template>
    <v-card-text
      v-if="user.id == comment.user && controls"
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
import { useCommentsStore } from "~/store/comments"
const pb = usePocketbase()
const props = defineProps({
  comment: Object,
  controls: {
    type: Boolean,
    default: true,
  },
  timeFormat: Array,
})
const userStore = useUserStore()
const commentsStore = useCommentsStore()
const { user } = storeToRefs(userStore)
const { deleteComment } = commentsStore
const avatar = pb.getFileUrl(props.comment.expand.user, props.comment.expand.user.avatar)

const emit = defineEmits(["goToTimestamp"])

const goToTimestamp = () => {
  emit("goToTimestamp")
}

const commentTime = computed(() => {
  if (props.timeFormat[0] == "Standard") return useFilters().formatTime(props.comment.timestamp)
  else return `${Math.round(props.comment.timestamp * props.comment.expand.asset.metadata.fps)}`
})
</script>
