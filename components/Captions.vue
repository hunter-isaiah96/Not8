<template>
  <div class="pa-4 d-inline-block full-width">
    <v-empty-state
      v-if="captions == null"
      icon="mdi-closed-caption"
      title="No Captions..."
      text="Start by uploading some captions!"
    >
      <template v-slot:actions>
        <div>
          <v-btn @click="triggerFileInput">Upload Captions</v-btn>
          <v-file-input
            ref="captionInput"
            class="d-none"
            @change="startCaptionUpload"
            hide-details
          ></v-file-input>
        </div>
      </template>
    </v-empty-state>

    <span
      v-for="caption in captions"
      :key="caption.text"
      @click="goToTimestamp(caption.start)"
      class="caption-segment mr-1"
      :class="{
        'bg-primary': videoPlayerDetails.currentTime >= caption.start && videoPlayerDetails.currentTime <= caption.end,
      }"
    >
      {{ caption.text }}
    </span>
  </div>
</template>

<script setup>
import { useAssetStore } from "~/store/asset"
import { useVideoStore } from "~/store/video"

const captionInput = ref(null)

const assetStore = useAssetStore()
const videoStore = useVideoStore()

const { videoPlayerDetails, goToTimestamp } = videoStore
const { captions } = storeToRefs(assetStore)

const { uploadCaptions } = assetStore

// Trigger the hidden input
const triggerFileInput = () => {
  captionInput.value.click()
}

// Handle file upload
const startCaptionUpload = (event) => {
  const fileInput = event.target
  const file = fileInput.files?.[0]
  if (file) {
    uploadCaptions(file)
  }
}
</script>

<style lang="scss">
.caption-segment {
  cursor: pointer;
  &:hover {
    background-color: #5b52fe;
  }
}
</style>
