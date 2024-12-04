<template>
  <div class="pa-4 d-inline-block">
    <span
      v-for="caption in captions"
      :key="caption.text"
      @click="goToTimestamp(caption.start)"
      :class="{
        'current-caption': videoPlayerDetails.currentTime >= caption.start && videoPlayerDetails.currentTime <= caption.end,
      }"
    >
      {{ caption.text }}
    </span>
  </div>
</template>
<script setup>
import { useAssetStore } from "~/store/asset"
import { useVideoStore } from "~/store/video"

const assetStore = useAssetStore()
const videoStore = useVideoStore()

const { videoPlayerDetails, goToTimestamp } = videoStore

const { captions } = storeToRefs(assetStore)
</script>
<style lang="scss" scoped>
$captionColor: #5b52fe;
span {
  cursor: pointer;
  margin-right: 5px;
  &:hover {
    background: $captionColor;
    color: white;
  }
}
.current-caption {
  background: $captionColor;
  color: white;
}
</style>
