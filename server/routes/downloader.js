const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const yup = require("yup");
const { PassThrough } = require("stream");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/** ========= Validators ========= */
const infoSchema = yup.object({
  url: yup.string().url().required("YouTube URL is required"),
});

const downloadSchema = yup.object({
  url: yup.string().url().required("YouTube URL is required"),
  itag: yup.string().required("Format itag is required"),
  ext: yup.string().required("Output extension is required"), // e.g. mp4, mp3
  isVideo: yup.boolean().required("Must specify whether this is a video or audio download"),
  start: yup
    .string()
    .matches(/^(\d{1,2}):([0-5]?\d):([0-5]?\d)$/, "Start time must be in HH:MM:SS format")
    .notRequired(),
  end: yup
    .string()
    .matches(/^(\d{1,2}):([0-5]?\d):([0-5]?\d)$/, "End time must be in HH:MM:SS format")
    .notRequired(),
});

/** ========= Routes ========= */

// Test yt-dlp binary
router.get("/test-binary", (req, res) => {
  const ytDlpPath = path.join(__dirname, "../bin/yt-dlp.exe"); // adjust path if needed

  const dl = spawn(ytDlpPath, ["--version"]);

  let output = "";
  dl.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });

  dl.stderr.on("data", (chunk) => {
    console.error("yt-dlp error:", chunk.toString());
  });

  dl.on("close", (code) => {
    if (code === 0) {
      res.json({ message: "yt-dlp binary is working!", version: output.trim() });
    } else {
      res.status(500).json({ error: "yt-dlp binary failed to run" });
    }
  });
});

// GET /api/formats?url=<youtube_url>
router.get("/formats", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL query parameter is required" });

  try {
    // Validate URL
    await infoSchema.validate({ url });

    const ytDlpPath = path.join(__dirname, "../bin/yt-dlp.exe"); // adjust path if needed

    // Spawn yt-dlp to dump JSON info
    const dl = spawn(ytDlpPath, ["-j", url]);

    let output = "";
    let errorOutput = "";

    dl.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });

    dl.stderr.on("data", (chunk) => {
      errorOutput += chunk.toString();
    });

    dl.on("close", (code) => {
      if (code !== 0) {
        console.error("yt-dlp error:", errorOutput);
        return res.status(500).json({ error: "Failed to fetch formats" });
      }

      try {
        const info = JSON.parse(output);

        const formats = info.formats.map((f) => ({
          itag: f.format_id,
          resolution: f.format_note || (f.height ? `${f.height}p` : "audio"),
          ext: f.ext,
          fps: f.fps,
          filesize: f.filesize,
          vcodec: f.vcodec,
          acodec: f.acodec,
        }));

        res.json({ title: info.title, formats });
      } catch (err) {
        console.error("JSON parse error:", err);
        res.status(500).json({ error: "Failed to parse yt-dlp output" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Invalid request" });
  }
});

/** ========= GET /api/downloadMedia ========= */
router.get("/downloadMedia", async (req, res) => {
  try {
    // Extract query params
    const { url, itag, ext, isVideo, start, end } = req.query;

    // Validate inputs using yup
    await downloadSchema.validate({
      url,
      itag,
      ext,
      isVideo: isVideo === "true", // convert from string
      start,
      end,
    });

    const pass = new PassThrough();
    const ytDlpPath = path.join(__dirname, "../bin/yt-dlp.exe"); // Adjust path if needed

    // Build yt-dlp args
    let format = isVideo === "true" ? `${itag}+bestaudio/best` : itag;
    const args = ["-f", format, "-o", "-", "--force-keyframes-at-cuts"];

    if (start && end) {
      args.push("--download-sections", `*${start}-${end}`);
    }

    // Spawn yt-dlp process
    const dl = spawn(ytDlpPath, [...args, url], { stdio: ["ignore", "pipe", "pipe"] });

    // Log progress from stderr
    dl.stderr.on("data", (chunk) => {
      const msg = chunk.toString().trim();
      if (msg) console.log(`[yt-dlp] ${msg}`);
    });

    // Pipe stdout to PassThrough
    dl.stdout.pipe(pass);

    let uuid = uuidv4();

    // Set headers for immediate download
    res.setHeader("Content-Disposition", `attachment; filename="downloadVideo${uuid}.${ext}"`);
    res.setHeader("Content-Type", isVideo === "true" ? "video/mp4" : "audio/mpeg");

    // Pipe to response
    pass.pipe(res);

    // Handle errors
    dl.on("error", (err) => {
      console.error("yt-dlp error:", err);
      res.status(500).json({ error: "Failed to download media" });
    });

    dl.on("close", (code) => {
      if (code !== 0) {
        console.error(`yt-dlp exited with code ${code}`);
      } else {
        console.log("Download finished successfully!");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Invalid request" });
  }
});


module.exports = router;
