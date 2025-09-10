import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function About() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: "16px",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={3}>
          <YouTubeIcon sx={{ color: "#FF0000", fontSize: 45 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#d32f2f", textAlign: "center" }}
          >
            About YoutubeDownloader
          </Typography>
        </Box>

        {/* Introduction */}
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", lineHeight: 1.8 }}>
          <strong>YoutubeDownloader</strong> is a free and powerful tool that allows users to
          download and convert videos and audio from popular platforms like{" "}
          <strong>YouTube, Facebook, TikTok, Instagram, Dailymotion, and more</strong>. With support
          for multiple formats such as MP4, MP3, M4V, FLV, AVI, and WEBM, you can easily save your
          favorite content in the best quality — up to 4K and beyond — all without installing any
          software or registering.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Features Section */}
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#FF0000", mb: 2 }}>
          🔥 Key Advantages
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon sx={{ color: "#FF0000" }} />
            </ListItemIcon>
            <ListItemText primary="Absolutely free and unlimited downloads" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon sx={{ color: "#FF0000" }} />
            </ListItemIcon>
            <ListItemText primary="Supports all popular video/audio formats (MP4, MP3, M4V, FLV, AVI, WEBM…)" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon sx={{ color: "#FF0000" }} />
            </ListItemIcon>
            <ListItemText primary="Download in multiple resolutions — 360p, 720p, 1080p, 2K, 4K, and even 8K" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon sx={{ color: "#FF0000" }} />
            </ListItemIcon>
            <ListItemText primary="No need to install third-party apps or register" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon sx={{ color: "#FF0000" }} />
            </ListItemIcon>
            <ListItemText primary="Works on all devices and browsers — PC, mobile, tablet" />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        {/* How it Works Section */}
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#FF0000", mb: 2 }}>
          ⚡ How to Download
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <PlayCircleFilledIcon sx={{ color: "#FF0000" }} />
            </ListItemIcon>
            <ListItemText primary="Paste a YouTube link or enter keywords into the search box" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DownloadIcon sx={{ color: "#FF0000" }} />
            </ListItemIcon>
            <ListItemText primary="Press the Start button to begin conversion" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DownloadIcon sx={{ color: "#FF0000" }} />
            </ListItemIcon>
            <ListItemText primary="Choose your desired audio or video format and click Download" />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Extra Info */}
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#FF0000", mb: 1 }}>
          ✅ Why Choose YoutubeDownloader?
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 2 }}>
          YoutubeDownloader is designed for speed, simplicity, and safety. With our latest
          technology, you get lightning-fast downloads without sacrificing quality. Whether you want
          to save videos for offline use, extract high-quality MP3 audio, or store content in
          different formats, YoutubeDownloader makes it easy — all in one place.
        </Typography>

        <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
          ⚠️ Note: Please ensure that you comply with copyright laws when downloading content.
        </Typography>
      </Paper>
    </Container>
  );
}

export default About;
