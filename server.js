const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
const port = 3000;
const fileUploader = require("./src/file-upload");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// default options
app.use(fileUpload());

app.post("/upload", function (req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + "/uploads/" + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    console.log({ err });
    if (err) return res.status(500).send(err);

    fileUploader(uploadPath).catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
    res.send("File uploaded!");
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
