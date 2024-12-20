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

      comments.value = organizeComments(fetchedComments)
      console.log(comments.value)
    } catch (error) {
      console.log(error)
    }
  }

  function organizeComments(comments) {
    const commentMap = {}

    // Initialize map
    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] }
    })

    // Organize replies
    const topLevelComments = []
    comments.forEach((comment) => {
      if (comment.parent) {
        commentMap[comment.parent].replies.push(commentMap[comment.id])
      } else {
        topLevelComments.push(commentMap[comment.id])
      }
    })

    return topLevelComments
  }

  const addComment = async function (comment) {
    try {
      await pb.collection("comments").create(comment)
      fetchComments(route.params.id)
    } catch (e) {
      console.log(e)
    }
  }

  const deleteComment = async function (commentId) {
    try {
      await pb.collection("comments").delete(commentId)
      fetchComments(route.params.id)
    } catch (error) {}
  }

  const timestampedComments = computed(() => comments.value.filter((value) => value.timed))
  const pinnedComments = computed(() => comments.value.filter((value) => value.timed && value.type == "pinned"))

  return { comments, fetchComments, addComment, deleteComment, timestampedComments, pinnedComments }
})
