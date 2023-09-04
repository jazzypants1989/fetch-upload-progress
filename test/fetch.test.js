import { expect, test } from "vitest"
import { enhancedFetch } from "../fetch"

test("should fetch data successfully", async () => {
  const response = await enhancedFetch(
    "https://jsonplaceholder.typicode.com/todos/1"
  )
  const data = await response.json()
  expect(data.id).toBe(1)
})

test("should report upload progress", async () => {
  let progressUpdates = []

  function onProgress(percentage) {
    progressUpdates.push(percentage)
  }

  // Create a small readable stream
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("Hello, world!"))
      controller.close()
    },
  })

  await enhancedFetch("https://httpbin.org/post", {
    method: "POST",
    body: stream,
    duplex: "half", // Use half-duplex mode to receive the response
    size: 13, // Size of 'Hello, world!' in bytes
    onProgress, // Pass the onProgress callback
  })

  // Check if progress was reported
  expect(progressUpdates.length).toBeGreaterThan(0)
  // Check if it reached 100%
  expect(progressUpdates[progressUpdates.length - 1]).toBe("100.00")
})

test("should report upload progress for large file", async () => {
  let progressUpdates = []

  function onProgress(percentage) {
    progressUpdates.push(percentage)
  }

  // Create a large readable stream
  const largeDataSize = 10 * 1024 * 1024 // 10 MB
  const chunkSize = 512 * 1024 // 512 KB
  const totalChunks = largeDataSize / chunkSize

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < totalChunks; i++) {
        const chunk = new Uint8Array(chunkSize).fill(65) // Filling with ASCII value of 'A'
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })

  await enhancedFetch("https://httpbin.org/post", {
    method: "POST",
    body: stream,
    duplex: "half", // Use half-duplex mode to receive the response
    size: largeDataSize, // Size of large data in bytes
    onProgress, // Pass the onProgress callback
  })

  // Check if progress was reported multiple times
  expect(progressUpdates.length).toBeGreaterThan(1)
  // Check if it reached 100%
  expect(progressUpdates[progressUpdates.length - 1]).toBe("100.00")
  console.log(progressUpdates, "progressUpdates from test")
})

test("should abort the fetch operation", async () => {
  // Use httpbin to delay the response by 2 seconds
  const fetchOperation = enhancedFetch("https://httpbin.org/delay/2")

  setTimeout(() => {
    fetchOperation.abort ? fetchOperation.abort() : console.log("no abort")
  }, 50) // Abort after 50ms, before the fetch resolves

  await expect(fetchOperation).rejects.toThrow("This operation was aborted")
})
