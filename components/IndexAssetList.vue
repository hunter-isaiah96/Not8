<template>
  <div class="fill-height fill-width">
    <v-empty-state
      v-if="assets.length == 0"
      icon="mdi-video-box-off"
      title="No Content"
      text="It seems you haven't uploaded any content. Upload a new video :)"
    ></v-empty-state>
    <v-row>
      <v-col
        cols="3"
        v-for="item in assets"
        :key="item.id"
      >
        <IndexAssetTile :asset="item"></IndexAssetTile>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
const pb = usePocketbase()
const assets = ref([])
try {
  const result = await pb.collection("assets").getList(1, 20)
  assets.value = result.items
} catch (error) {}
</script>
<style lang="scss">
.fill-width {
  width: 100%;
}
</style>
