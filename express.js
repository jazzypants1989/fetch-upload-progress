import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000

const uploadDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

app.post("/upload", (req, res) => {
  const filePath = path.join(uploadDir, Date.now().toString())
  const writeStream = fs.createWriteStream(filePath)

  req.pipe(writeStream)

  writeStream.on("finish", () => {
    res.status(200).send("File uploaded successfully")
  })

  writeStream.on("error", (err) => {
    console.error(err)
    res.status(500).send("Internal Server Error")
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
