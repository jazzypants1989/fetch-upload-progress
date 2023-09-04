import { createReadStream, statSync } from "fs"
import { Readable } from "node:stream"
import { enhancedFetch } from "./fetch.js"

async function main() {
  const filePath = "./some-large-file.txt" // Replace with your file path
  const totalSize = statSync(filePath).size // Get the file size

  const nodeStream = createReadStream(filePath)
  const webStream = Readable.toWeb(nodeStream)

  const response = await enhancedFetch("http://localhost:3000/upload", {
    method: "POST",
    body: webStream,
    headers: { "Content-Type": "application/octet-stream" },
    duplex: "half",
    size: totalSize, // Pass the total size to enhancedFetch
    onProgress: (percentage) => {
      console.log(`Upload progress: ${percentage}%`)
    },
  })

  if (response.ok) {
    console.log("File uploaded successfully!")
  } else {
    console.log("Failed to upload file.")
    console.log("Response status:", response.status, response.statusText)
  }
}

main().catch((error) => {
  console.log("An error occurred:", error)
})
