<template>
  <main>
    <v-row justify="center">
      <v-col cols="9">
        <VideoPlayer
          ref="videoPlayer"
          :asset="asset"
        ></VideoPlayer>
        <CommentBox @pause-video="pauseVideo"></CommentBox>
      </v-col>
    </v-row>
  </main>
  <v-navigation-drawer
    width="500"
    location="right"
    floating
  >
    <template v-slot:prepend>
      <div class="pa-2">
        <v-card-title>{{ asset.title }}</v-card-title>
        <v-card-subtitle>{{ asset.description }}</v-card-subtitle>
        <v-tabs
          v-model="tab"
          bg-color="transparent"
          grow
        >
          <v-tab value="comments">Comments</v-tab>
          <v-tab value="captions">Captions</v-tab>
          <v-tab value="fileinfo">File Info</v-tab>
        </v-tabs>
      </div>
    </template>
    <v-list>
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="comments">
            <Comments @go-to-timestamp="goToTimestamp"></Comments>
          </v-tabs-window-item>

          <v-tabs-window-item value="captions"> Two </v-tabs-window-item>

          <v-tabs-window-item value="fileinfo">
            <v-list>
              <v-list-item
                v-for="item in metadataDisplay"
                :key="item.key"
              >
                <div class="d-flex justify-between">
                  <span class="flex-1 text-disabled">{{ item.name }}</span>
                  <span class="flex-1">{{ asset.metadata[item.key] }}</span>
                </div>
                <v-divider class="my-4"></v-divider>
              </v-list-item>
            </v-list>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { useVideoStore } from "~/store/video"
import { useAssetStore } from "~/store/asset"

const route = useRoute()
const tab = ref(null)
const videoPlayer = ref(null)

const videoStore = useVideoStore()
const assetStore = useAssetStore()
const { videoPlayerDetails } = storeToRefs(videoStore)
const { asset } = storeToRefs(assetStore)
const { loadAsset } = assetStore

loadAsset(route.params.id)

const metadataDisplay = [
  { name: "File Name", key: "fileName" },
  { name: "Size", key: "size" },
  { name: "Format", key: "format" },
  { name: "Height", key: "height" },
  { name: "Width", key: "width" },
  { name: "Aspect Ratio", key: "aspectRatio" },
  { name: "Frame Rate", key: "fps" },
  { name: "Frame Count", key: "frameCount" },
  { name: "Audio Format", key: "audioFormat" },
  { name: "Audio Sample Rate", key: "audioSampleRate" },
]

const pauseVideo = () => {
  if (videoPlayer.value && !videoPlayerDetails.value.paused) {
    videoPlayer.value.pause()
  }
}

const goToTimestamp = function (timestamp) {
  if (videoPlayer.value) {
    videoPlayer.value.goToTimestamp(timestamp)
  }
}
</script>
<style lang="scss">
.flex-1 {
  flex: 1;
}
</style>
