<template>
  <v-card
    :title="props.asset.title"
    :text="props.asset.description"
    @click="goToAsset"
  >
  </v-card>
</template>
<script setup>
const props = defineProps({
  asset: Object,
})

const goToAsset = function () {
  navigateTo(`/asset/view/${props.asset.id}`)
}
</script>
