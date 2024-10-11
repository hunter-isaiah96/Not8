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
        >
          <template v-slot:prepend>
            <v-avatar
              color="primary"
              size="30"
            >
              I
              <!-- <v-img></v-img> -->
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
            ></v-checkbox>
          </v-card>
        </label>
        <v-spacer></v-spacer>
        <v-btn
          @click="addComment"
          icon
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { useVideoStore } from "~/store/video"
const videoStore = useVideoStore()
const { currentTime, comments } = storeToRefs(videoStore)
const comment = ref("")
const commentAtTimestamp = ref(false)
const emit = defineEmits(["pause-video"])

const addComment = function () {
  comments.value.push()
}

const pauseVideo = function () {
  emit("pause-video")
}
</script>
