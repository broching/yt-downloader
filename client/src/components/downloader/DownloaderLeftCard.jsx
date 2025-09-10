
import YouTube from "react-youtube";
import {
  TextField,
  Typography,
  Slider,
  styled,
  Paper,
  Box
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// Custom styled slider
const RangeSlider = styled(Slider)(({ theme }) => ({
  color: "red",
  height: 8,
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:hover": { boxShadow: "0 0 0 8px rgba(25, 118, 210, 0.16)" },
    "&.Mui-active": { boxShadow: "0 0 0 14px rgba(25, 118, 210, 0.16)" },
  },
  "& .MuiSlider-rail": { opacity: 0.3, backgroundColor: "#bfbfbf" },
  "& .MuiSlider-track": { border: "none" },
  "& .MuiSlider-valueLabel": { backgroundColor: "red", color: "#fff" },
}));


function DownloaderLeftCard(props) {
  const {
    videoId,
    startEnd,
    formatTime,
    handleSliderChange,
    handleSliderStart,
    handleSliderEnd,
    videoDuration,
    setVideoDuration,
    setStartEnd,
    playerRef
  } = props;

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    const duration = playerRef.current.getDuration();
    setVideoDuration(duration);
    setStartEnd([0, duration]);
  };
  return (
    <div style={{ flex: 1 }}>
      <YouTube
        videoId={videoId}
        opts={{ width: "100%", playerVars: { autoplay: 0 } }}
        onReady={handlePlayerReady}
      />
      {videoDuration > 0 && (
        <>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mt: 2,
              borderRadius: "16px", // circular/rounded border
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: "1.2rem", width: "95%" }}
            >
              {/* Label */}
              <Typography
                variant="h6"
                sx={{
                  color: "#555",        // gray color for label
                  fontWeight: 500,      // medium weight
                  fontSize: "1.2rem",     // adjust size
                }}
              >
                Duration:
              </Typography>

              {/* Value */}
              <Typography
                variant="h6"
                sx={{

                  fontWeight: 100,      // bold for emphasis
                  fontSize: "1.1rem",   // slightly larger
                }}
              >
                {(startEnd[1] - startEnd[0]).toFixed(2)}s
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={4} sx={{ mb: 2, border: "2px solid gray", p: 2, borderRadius: "12px" }}>
              {/* Start */}
              <Box display="flex" alignItems="center" gap={1} padding={1}>
                <AccessTimeIcon fontSize="small" />
                <TextField
                  label="Start"
                  value={formatTime(startEnd[0])}
                  placeholder="00:00:00"
                  inputProps={{ pattern: "[0-9]{2}:[0-9]{2}:[0-9]{2}" }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& fieldset": {
                        borderColor: "red", // red outline
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "red", // red label when focused
                    },
                  }}
                />
              </Box>

              {/* End */}
              <Box display="flex" alignItems="center" gap={1} padding={1}>
                <TextField
                  label="End"
                  value={formatTime(startEnd[1])}
                  placeholder="00:00:00"
                  inputProps={{ pattern: "[0-9]{2}:[0-9]{2}:[0-9]{2}" }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& fieldset": {
                        borderColor: "red",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "red",
                    },
                  }}
                />
                <AccessTimeIcon fontSize="small" />
              </Box>
            </Box>
            <RangeSlider
              value={startEnd}
              onChange={handleSliderChange}
              onMouseDown={handleSliderStart}
              onMouseUp={handleSliderEnd}
              valueLabelDisplay="auto"
              min={0}
              max={videoDuration}
              step={0.1}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
                gap: 1,
                fontWeight: 500,
              }}
            >
            </Box>
          </Paper>
        </>
      )}
    </div>
  )
}

export default DownloaderLeftCard