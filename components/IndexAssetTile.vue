<template>
  <v-card @click="goToAsset">
    <v-img
      height="200px"
      :src="thumbnail"
      cover
    ></v-img>
    <v-card-item>
      <v-card-title>{{ props.asset.title }}</v-card-title>

      <v-card-subtitle>
        {{ props.asset.description }}
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>
<script setup>
const props = defineProps({
  asset: Object,
})
const thumbnail = props.asset.thumbnail ? getFileURL(props.asset, props.asset.thumbnail) : null
const goToAsset = function () {
  navigateTo(`/asset/view/${props.asset.id}`)
}
</script>
