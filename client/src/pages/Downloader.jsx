import React, { useState, useRef } from "react";
import {
    TextField,
    CardContent,
    Typography,
    Alert,
    Grid,
    Box
} from "@mui/material";
import { fetchFormatsApi } from "../api/downloader/fetchFormatsApi";
import YouTubeIcon from "@mui/icons-material/YouTube";
import DownloaderLeftCard from "../components/downloader/DownloaderLeftCard";
import DownloaderRightCard from "../components/downloader/DownloaderRightCard";
import DownloadModal from "../components/downloader/DownloadModal";

function Downloader() {
    const [url, setUrl] = useState("");
    const [videoId, setVideoId] = useState(null);
    const [error, setError] = useState("");
    const [videoDuration, setVideoDuration] = useState(0);
    const [startEnd, setStartEnd] = useState([0, 0]);
    const [isSliding, setIsSliding] = useState(false);
    const [formats, setFormats] = useState([]);
    const [videoTitle, setVideoTitle] = useState("");
    const [tabValue, setTabValue] = useState(0); // 0 = Video, 1 = Audio
    const [selectedExt, setSelectedExt] = useState({}); // Track selected extension per row
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const playerRef = useRef(null);

    const extractVideoId = (ytUrl) => {
        try {
            const urlObj = new URL(ytUrl);
            if (urlObj.hostname === "youtu.be") return urlObj.pathname.slice(1);
            if (urlObj.hostname.includes("youtube.com")) return urlObj.searchParams.get("v");
        } catch {
            return null;
        }
        return null;
    };

    const handleChange = (e) => {
        const newUrl = e.target.value.trim();
        setUrl(newUrl);

        if (!newUrl) {
            setVideoId(null);
            setError("");
            setFormats([]);
            return;
        }

        const id = extractVideoId(newUrl);
        if (id) {
            setVideoId(id);
            setError("");
            setStartEnd([0, 0]);
            setVideoDuration(0);
            fetchFormats(newUrl);
        } else {
            setVideoId(null);
            setError("Invalid YouTube URL. Please check and try again.");
            setFormats([]);
        }
    };

    const fetchFormats = async (videoUrl) => {
        try {
            const res = await fetchFormatsApi(videoUrl);
            setFormats(res.formats || []);
            setVideoTitle(res.title || "");
        } catch (err) {
            console.error(err);
            setError("Failed to fetch video formats.");
        }
    };

    const handlePlayerReady = (event) => {
        playerRef.current = event.target;
        const duration = playerRef.current.getDuration();
        setVideoDuration(duration);
        setStartEnd([0, duration]);
    };

    const handleSliderChange = (event, newValue) => {
        const [newStart, newEnd] = newValue;
        const startDiff = Math.abs(newStart - startEnd[0]);
        const endDiff = Math.abs(newEnd - startEnd[1]);
        const movingThumb = startDiff > endDiff ? "start" : "end";
        setStartEnd(newValue);
        if (playerRef.current && isSliding) {
            playerRef.current.seekTo(movingThumb === "start" ? newStart : newEnd, true);
        }
    };

    const handleSliderStart = () => setIsSliding(true);
    const handleSliderEnd = () => setIsSliding(false);
    const handleTabChange = (event, newValue) => setTabValue(newValue);

    const videoFormats = formats.filter(f => f.vcodec && f.vcodec !== "none");
    const audioFormats = formats.filter(f => (!f.vcodec || f.vcodec === "none") && f.acodec && f.acodec !== "none");

    const groupByKey = (arr, key) => {
        const grouped = {};
        arr.forEach(f => {
            const val = f[key] || "Unknown";
            if (!grouped[val]) grouped[val] = [];
            grouped[val].push(f);
        });
        return grouped;
    };

    const groupedVideoFormats = groupByKey(videoFormats, "resolution");
    const groupedAudioFormats = groupByKey(audioFormats, "abr");

    const activeFormats = tabValue === 0 ? groupedVideoFormats : groupedAudioFormats;

    const sortVideoKeysDesc = (keys) => {
        return keys
            .map(k => {
                if (k === "Unknown") return -1;
                return parseInt(k.replace("p", "")) || 0;
            })
            .map((num, index) => ({ num, key: keys[index] }))
            .sort((a, b) => b.num - a.num)
            .map(item => item.key);
    };

    const keysToRender = tabValue === 0
        ? sortVideoKeysDesc(Object.keys(activeFormats))
        : Object.keys(activeFormats);

    const handleDownload = (format, isVideo) => {
        // Convert start/end seconds to HH:MM:SS
        const toHHMMSS = (secs) => {
            const h = Math.floor(secs / 3600).toString().padStart(2, "0");
            const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
            const s = Math.floor(secs % 60).toString().padStart(2, "0");
            return `${h}:${m}:${s}`;
        };

        const [startSec, endSec] = startEnd; // assuming startEnd is defined in your component

        const start = toHHMMSS(startSec);
        const end = toHHMMSS(endSec);

        // Construct query string
        const params = new URLSearchParams({
            url,
            itag: format.itag,
            ext: format.ext,
            isVideo: isVideo.toString(),
            start,
            end,
        });

        const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/downloader/downloadMedia?${params.toString()}`;


        // Show modal
        setModalMessage(`${videoTitle} (${format.ext}) download started. Please do not close the browser.`);
        setOpenModal(true);

        // Create a temporary link and click it to start download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${videoTitle || "download"}.${format.ext}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, "0");
        const minutes = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(totalSeconds % 60)
            .toString()
            .padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    }



    return (
        <Box sx={{ maxWidth: "1300px", margin: "2rem auto", padding: "1rem" }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <YouTubeIcon sx={{ color: "#FF0000", fontSize: 36 }} />
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#212121",
                            letterSpacing: 1,
                        }}
                    >
                        YouTube Downloader
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    label="Paste YouTube Link"
                    variant="outlined"
                    value={url}
                    onChange={handleChange}
                    sx={{
                        marginBottom: "0.5rem",
                        "& .MuiOutlinedInput-root.Mui-focused": {
                            "& fieldset": {
                                borderColor: "red", // red outline when focused
                            },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "red", // red label when focused
                        },
                    }}
                />


                {error && <Alert sx={{ mb: "1rem" }} severity="error">{error}</Alert>}

                {/* Show arrow + message only if no link entered */}
                {!url && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mt: 0,
                            mb: 3,
                            animation: "fadeIn 1s ease-in-out",
                            "@keyframes bounce": {
                                "0%, 100%": { transform: "translateY(0)" },
                                "50%": { transform: "translateY(10px)" },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: "6rem",
                                color: "red",
                                animation: "bounce 1s infinite",
                            }}
                        >
                            🢁
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{ color: "gray", mb: 1, fontWeight: 500 }}
                        >
                            Paste your link above 👆
                        </Typography>
                    </Box>
                )}

                {videoId && (
                    <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            {/* Left side: player + slider */}
                            <DownloaderLeftCard
                                videoId={videoId}
                                videoDuration={videoDuration}
                                startEnd={startEnd}
                                setStartEnd={setStartEnd}
                                handleSliderChange={handleSliderChange}
                                handleSliderStart={handleSliderStart}
                                handleSliderEnd={handleSliderEnd}
                                formatTime={formatTime}
                                playerRef={playerRef}
                                handlePlayerReady={handlePlayerReady}
                                videoTitle={videoTitle}
                                setVideoTitle={setVideoTitle}
                                setVideoDuration={setVideoDuration}

                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            {/* Right side: video/audio table */}
                            <DownloaderRightCard
                                tabValue={tabValue}
                                handleTabChange={handleTabChange}
                                activeFormats={activeFormats}
                                keysToRender={keysToRender}
                                selectedExt={selectedExt}
                                setSelectedExt={setSelectedExt}
                                handleDownload={handleDownload}
                                audioFormats={audioFormats}
                            />

                        </Grid>
                    </Grid>
                )}

                {/* Download modal */}
                <DownloadModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    modalMessage={modalMessage}
                />
            </CardContent>
        </Box>
    );
}

export default Downloader;
