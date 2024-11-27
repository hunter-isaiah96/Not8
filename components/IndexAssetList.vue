<template>
  <v-row class="fill-height">
    <v-col
      cols="3"
      v-for="item in assets"
      :key="item.id"
    >
      <IndexAssetTile :asset="item"></IndexAssetTile>
    </v-col>
  </v-row>
</template>
<script setup>
const pb = usePocketbase()
const assets = ref([])
try {
  const result = await pb.collection("assets").getList(1, 20)
  assets.value = result.items
} catch (error) {}
</script>
