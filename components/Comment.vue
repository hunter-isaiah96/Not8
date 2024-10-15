<template>
  <v-card>
    <template v-slot:prepend>
      <v-avatar color="primary">
        <span class="text-uppercase">{{ comment.expand.user.username[0] }}</span>
      </v-avatar>
    </template>
    <template v-slot:title>
      <div class="d-flex align-center">
        <span class="text-subtitle-2 text-capitalize">{{ comment.expand.user.username }}</span>
        <v-spacer></v-spacer>
        <div v-if="user.id == comment.user">
          <v-menu close-on-content-click="true">
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
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      append-icon="mdi-delete"
                    >
                      Delete
                    </v-list-item>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card title="Delete Comment">
                      <v-card-text> Are you sure you wish to delete this comment? </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          text="No"
                          @click="isActive.value = false"
                        ></v-btn>
                        <v-btn
                          text="Yes"
                          color="error"
                          @click="isActive.value = false"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </div>
    </template>
    <template v-slot:subtitle>
      <span
        v-if="comment.timed"
        class="text-white bg-primary cursor-pointer px-1"
        @click="goToTimestamp"
      >
        {{ commentTime }}
      </span>
      <span>&nbsp;</span>
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
const userStore = useUserStore()
const videoStore = useVideoStore()
const { user } = storeToRefs(userStore)
const { videoPlayerDetails } = storeToRefs(videoStore)
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
