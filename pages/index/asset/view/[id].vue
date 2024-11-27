<template>
  <main>
    <v-row
      justify="center"
      align="center"
    >
      <v-col cols="12">
        <VideoPlayer
          ref="videoPlayer"
          :asset="asset"
        ></VideoPlayer>
      </v-col>
    </v-row>
  </main>
  <v-navigation-drawer
    width="500"
    location="right"
    floating
    permanent
  >
    <template v-slot:prepend>
      <div class="pa-2">
        <v-card-title>
          <div v-if="!editControls.editTitle">
            <span>{{ asset.title }}</span>
            <v-btn
              class="ml-2"
              size="x-small"
              icon="mdi-pencil"
              @click="editTitle(true)"
            ></v-btn>
          </div>
          <v-card v-else>
            <v-text-field
              v-model="editControls.videoTitle"
              hide-details
            ></v-text-field>
            <v-card-actions>
              <v-btn @click="editTitle(false)">Cancel</v-btn>
              <v-btn
                @click="updateTitle()"
                color="primary"
                >Update</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-card-title>
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
    <template v-slot:append>
      <div
        v-show="tab === 'comments'"
        class="pa-2"
      >
        <CommentBox></CommentBox>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script setup>
import { useVideoStore } from "~/store/video"
import { useAssetStore } from "~/store/asset"
const pb = usePocketbase()

const route = useRoute()
const tab = ref(null)
const videoPlayer = ref(null)

const editControls = reactive({
  videoTitle: "",
  editTitle: false,
  updatingTitle: false,
  videoDescription: "",
  editDescription: false,
  updatingDescription: false,
})

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

const editTitle = (edit) => {
  editControls.editTitle = edit
  editControls.videoTitle = asset.value.title
}
const updateTitle = async () => {
  try {
    await pb.collection("assets").update(asset.value.id, {
      title: editControls.videoTitle,
    })
    editControls.editTitle = false
    asset.value.title = editControls.videoTitle
  } catch (e) {}
}
</script>
<style lang="scss">
.flex-1 {
  flex: 1;
}
</style>
