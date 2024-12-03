<template>
  <div>
    <div v-if="!editing">
      <span>{{ value }}</span>
      <v-btn
        icon="mdi-pencil"
        size="x-small"
        @click="editing = true"
      />
    </div>
    <v-card v-else>
      <v-text-field
        v-model="inputValue"
        hide-details
      />
      <v-card-actions>
        <v-btn @click="cancelEdit">Cancel</v-btn>
        <v-btn
          @click="saveEdit"
          color="primary"
          >Update</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  value: String,
})
const emit = defineEmits(["update"])

const editing = ref(false)
const inputValue = ref(props.value)

const cancelEdit = () => (editing.value = false)
const saveEdit = () => {
  emit("update", inputValue.value)
  editing.value = false
}

watch(
  () => props.value,
  (newVal) => {
    inputValue.value = newVal
  }
)
</script>
