const { createClient } = require("@supabase/supabase-js");
const envalid = require("envalid");

const { SUPABASE_KEY, SUPABASE_URL } = envalid.cleanEnv(process.env, {
  SUPABASE_KEY: envalid.str(),
  SUPABASE_URL: envalid.str(),
});
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
require("dotenv").config();
// const { client } = require("@gradio");
const express = require("express");
const axios = require("axios");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
const port = 3000;
const fileUploader = require("./src/file-upload");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/generated_audio", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "generated_audio.html"));
});

// default options
app.use(fileUpload());

// set the view engine to ejs
app.set("view engine", "ejs");

// app.get("/res", (req, res) => {
//   res.render("result", {
//     id: "someid",
//   });
// });

// app.post("/upload", function (req, res) {
//   let sampleFile;
//   let uploadPath;

//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded.");
//   }
// });

// app.get("/generate", async function (req, res) {
//   let input_path = '../resources/rithesh.wav';
//   let prompt = "Energetic funk pop song with only beats and lead instrument";

//   try {
//     // Make a GET request to the "/generate" endpoint
//     const response = await axios.get('http://127.0.0.1:8000/generate', {
//       // Add query parameters
//       params: {
//         input_path: input_path,
//         prompt: prompt,
//       }
//     });

//     // Assuming the URL is in the response data
//     const generatedUrl = response.data.url;

//     // Do something with the generated URL
//     console.log('Generated URL:', generatedUrl);

//     // Respond to the client if needed
//     res.status(200).json({ success: true, url: generatedUrl });
//   } catch (error) {
//     // Handle any errors that occurred during the request
//     console.error('Error:', error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.get("/generate", async function (req, res) {
//   async function run() {
//     let input_path = "../resources/rithesh.wav";
//     let prompt = "Energetic funk pop song with only beats and lead instrument";

//     const response_0 = await fetch(input_path);
//     const exampleAudio = await response_0.blob();

//     const app = await client("https://facebook-musicgen.hf.space/");
//     const result = await app.predict(0, [
//       "Howdy!", // string  in 'Describe your music' Textbox component
//       exampleAudio, // blob in 'File' Audio component
//     ]);

//     console.log(result.data);
//   }
// });

//run();

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

    fileUploader(uploadPath)
      .then((id) => {
        // res.send(`File uploaded with id: ${id}!`);
        res.render("result", {
          id,
        });
      })
      .catch((err) => {
        console.error(err);
        process.exitCode = 1;
      });
  });
});

app.get("/result/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("songid", id)
    .single();
  if (error) {
    console.error(error);
    return res.status(500).send(error);
  }
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
