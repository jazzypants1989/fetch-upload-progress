import { createSecureServer } from "http2"
import { readFileSync, writeFileSync, createReadStream } from "fs"
import path from "path"

const server = createSecureServer({
  key: readFileSync("key.pem"),
  cert: readFileSync("cert.pem"),
})

server.on("stream", (stream, headers) => {
  const reqPath = headers[":path"]
  if (reqPath === "/") {
    const filePath = path.join(process.cwd(), "index.html")
    const fileStream = createReadStream(filePath)
    stream.respondWithFile(filePath, {
      "content-type": "text/html",
    })
    fileStream.pipe(stream)
  } else if (reqPath === "/upload" && headers[":method"] === "POST") {
    let data = []
    stream.on("data", (chunk) => {
      data.push(chunk)
    })
    stream.on("end", () => {
      const buffer = Buffer.concat(data)
      writeFileSync("uploaded-file", buffer)
      stream.respond({ ":status": 200 })
      stream.end("File uploaded successfully")
    })
  } else {
    stream.respond({ ":status": 404 })
    stream.end("Not Found")
  }
})

server.listen(3000, () => {
  console.log("HTTP/2 server running on https://localhost:3000/")
})
