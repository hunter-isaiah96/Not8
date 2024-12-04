<template>
  <v-card
    color="background"
    :class="{ 'ml-5': comment.parent }"
  >
    <template v-slot:prepend>
      <v-avatar color="primary">
        <v-img :src="avatarUrl" />
      </v-avatar>
    </template>

    <template v-slot:title>
      <div class="d-flex align-center">
        <span class="text-subtitle-2 text-capitalize">{{ username }}</span>
        <span class="text-subtitle-2 text-capitalize opacity-40"> &nbsp;-&nbsp;{{ formattedTime }} </span>
        <v-spacer />
        <v-menu v-if="showControls">
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              density="comfortable"
              size="x-small"
              v-bind="props"
              color="transparent"
            />
          </template>
          <v-list>
            <v-list-item append-icon="mdi-pencil">Edit</v-list-item>
            <v-list-item
              @click="deleteComment(comment.id)"
              base-color="error"
              append-icon="mdi-delete"
            >
              Delete
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>

    <template v-slot:subtitle>
      <div>
        <span
          v-if="comment.timed"
          @click="goToTimestamp(comment.timestamp)"
          class="text-white cursor-pointer px-1"
          :class="commentClass"
        >
          {{ commentTime }}
        </span>
        <span class="text-subtitle-2">&nbsp;{{ comment.text }}</span>
      </div>
    </template>

    <v-card-text
      class="pr-0 pb-2"
      v-if="showControls"
    >
      <v-btn
        @click="toggleReply"
        size="x-small"
        class="mr-2 opacity-70 d-block"
        flat
        >Reply</v-btn
      >

      <div v-if="reply">
        <v-text-field
          v-model="replyText"
          :label="`Reply to ${username}...`"
          append-inner-icon="mdi-send"
          @click:append-inner="replyToComment"
          @keyup.enter.native="replyToComment"
          hide-details
          class="mt-2 mb-4 mr-3"
        />
      </div>

      <div>
        <Comment
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          class="my-2"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue"
import { storeToRefs } from "pinia"
import { useVideoStore } from "~/store/video"
import { useUserStore } from "~/store/user"
import { useCommentsStore } from "~/store/comments"
import { useAssetStore } from "~/store/asset"

const props = defineProps({
  comment: Object,
  controls: { type: Boolean, default: true },
  timeFormat: Array,
})

const videoStore = useVideoStore()
const userStore = useUserStore()
const commentsStore = useCommentsStore()
const assetStore = useAssetStore()
const pb = usePocketbase()

const { user } = storeToRefs(userStore)
const { asset } = storeToRefs(assetStore)
const { addComment, deleteComment } = commentsStore
const { goToTimestamp } = videoStore

const reply = ref(false)
const replyText = ref("")

const username = props.comment.expand.user.username
const avatarUrl = pb.getFileUrl(props.comment.expand.user, props.comment.expand.user.avatar)

const showControls = computed(() => user.value.id === props.comment.user && props.controls)

const commentTime = computed(() => {
  if (props.timeFormat[0] === "Standard") {
    return useFilters().formatTime(props.comment.timestamp)
  }
  return `${Math.round(props.comment.timestamp * props.comment.expand.asset.metadata.fps)}`
})

const formattedTime = useFilters().timeAgo(props.comment.created)
const commentClass = computed(() => (props.comment.type === "comment" ? "bg-primary" : "bg-pinned"))

const toggleReply = () => {
  if (!reply.value && props.comment.parent) {
    replyText.value = `@${username} `
  } else {
    replyText.value = ""
  }
  reply.value = !reply.value
}

const replyToComment = async () => {
  if (!replyText.value.trim()) return

  const newComment = {
    asset: asset.value.id,
    user: user.value.id,
    text: replyText.value.trim(),
    type: "comment",
    parent: props.comment.parent || props.comment.id,
  }

  try {
    await addComment(newComment)
    reply.value = false
    replyText.value = ""
  } catch (error) {
    console.error(error)
  }
}
</script>
