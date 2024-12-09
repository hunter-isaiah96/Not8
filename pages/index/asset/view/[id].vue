<template>
  <main class="full-width">
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
          <EditableField
            :value="asset.title"
            @update="updateTitle"
          ></EditableField>
          <v-tabs
            v-model="tab"
            bg-color="transparent"
            grow
          >
            <v-tab value="comments">Comments</v-tab>
            <v-tab value="captions">Captions</v-tab>
            <v-tab value="fileinfo">File Info</v-tab>
          </v-tabs>
        </v-card-title>
      </div>
    </template>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="comments">
        <Comments />
      </v-tabs-window-item>
      <v-tabs-window-item value="captions">
        <Captions></Captions>
      </v-tabs-window-item>
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
            <v-divider class="my-4" />
          </v-list-item>
        </v-list>
      </v-tabs-window-item>
    </v-tabs-window>
    <template v-slot:append>
      <div
        v-if="tab === 'comments'"
        class="pa-2"
      >
        <CommentBox />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import { useAssetStore } from "~/store/asset"

const route = useRoute()
const pb = usePocketbase()

const videoPlayer = ref(null)
const tab = ref(null)

const assetStore = useAssetStore()
const { asset } = storeToRefs(assetStore)

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

assetStore.loadAsset(route.params.id)

const updateTitle = async (newTitle) => {
  try {
    await pb.collection("assets").update(asset.value.id, { title: newTitle })
    asset.value.title = newTitle
  } catch (e) {
    console.error("Failed to update title:", e)
  }
}
</script>

<style lang="scss" scoped>
.flex-1 {
  flex: 1;
}
.full-width {
  width: 100%;
}
</style>
