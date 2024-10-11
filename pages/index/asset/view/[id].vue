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
  >
    <v-list>
      <v-card
        :title="asset.title"
        :text="asset.description"
      >
        <v-tabs
          v-model="tab"
          bg-color="transparent"
          grow
        >
          <v-tab value="comments">Comments</v-tab>
          <v-tab value="captions">Captions</v-tab>
          <v-tab value="fileinfo">File Info</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="comments"> One </v-tabs-window-item>

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
      </v-card>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { useVideoStore } from "~/store/video"

const route = useRoute()
const pb = usePocketbase()
const asset = ref({})
const tab = ref(null)
const videoPlayer = ref(null)

const videoStore = useVideoStore()
const { videoPlayerDetails } = storeToRefs(videoStore)

const metadataDisplay = [
  { name: "File Name", key: "fileName" },
  { name: "Format", key: "format" },
  { name: "Height", key: "height" },
  { name: "Width", key: "width" },
  { name: "Aspect Ratio", key: "aspectRatio" },
  { name: "Frame Rate", key: "fps" },
  { name: "Frame Count", key: "frameCount" },
  { name: "Audio Format", key: "audioFormat" },
  { name: "Audio Sample Rate", key: "audioSampleRate" },
]
try {
  const assetResult = await pb.collection("assets").getOne(route.params.id)
  asset.value = assetResult
  asset.value.mediaURL = pb.files.getUrl(assetResult, assetResult.media)
} catch (error) {}

const pauseVideo = () => {
  if (videoPlayer.value && !videoPlayerDetails.value.paused) {
    videoPlayer.value.pause()
  }
}
</script>
<style>
.flex-1 {
  flex: 1;
}
</style>
