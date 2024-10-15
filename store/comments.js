import { defineStore } from "pinia"

export const useCommentsStore = defineStore("commentsStore", () => {
  const pb = usePocketbase()
  const route = useRoute()
  const comments = ref([])

  const fetchComments = async function (assetId) {
    try {
      const fetchedComments = await pb.collection("comments").getFullList({
        sort: "-created",
        filter: `asset="${assetId}"`,
        expand: "user, asset",
      })
      comments.value = fetchedComments
    } catch (error) {
      console.log(error)
    }
  }

  const addComment = async function (comment) {
    try {
      await pb.collection("comments").create(comment)
      fetchComments(route.params.id)
    } catch (e) {
      console.log(e)
    }
  }

  const timestampedComments = computed(() => comments.value.filter((value) => value.timed))

  return { comments, fetchComments, addComment, timestampedComments }
})
