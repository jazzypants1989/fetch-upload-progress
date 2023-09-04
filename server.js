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

// import express from "express"
// import fs from "fs"
// import path from "path"
// import { fileURLToPath } from "url"

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const app = express()
// const port = 3000

// const uploadDir = path.join(__dirname, "uploads")
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir)
// }

// app.use(express.static("."))

// app.post("/upload", (req, res) => {
//   const filePath = path.join(uploadDir, Date.now().toString())
//   const writeStream = fs.createWriteStream(filePath)

//   req.pipe(writeStream)

//   writeStream.on("finish", () => {
//     res.status(200).send("File uploaded successfully")
//   })

//   writeStream.on("error", (err) => {
//     console.error(err)
//     res.status(500).send("Internal Server Error")
//   })
// })

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`)
// })
