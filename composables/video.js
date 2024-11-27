export const getVideoThumbnail = (file, seekTime = 1) =>
  new Promise((resolve, reject) => {
    if (!file || file.type.indexOf("video") === -1) {
      reject(new Error("Invalid file type. Please select a video file."))
      return
    }

    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    video.preload = "metadata"
    video.src = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      // Set the canvas size to match the video dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Seek to the desired time
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      // Draw the current frame on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob) // Resolve with the Blob
          } else {
            reject(new Error("Failed to generate thumbnail blob."))
          }
        },
        "image/png", // MIME type for the thumbnail
        0.9 // Image quality (optional, ignored for PNG)
      )
      // Cleanup and resolve the thumbnail
      URL.revokeObjectURL(video.src)
    }

    video.onerror = (error) => {
      reject(new Error("Error loading video."))
    }
  })
