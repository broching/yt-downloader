
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from '@mui/material/LinearProgress';

function DownloadModal(props) {
    const { openModal, setOpenModal, modalMessage } = props;
    return (
        <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    background: "linear-gradient(145deg, #f9f9f9, #eaeaea)",
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                    padding: "0.5rem",
                    minWidth: "320px",
                },
            }}
        >
            {/* Title with close button */}
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "600",
                    color: "#333",
                }}
            >
                Download in Progress
                <IconButton
                    aria-label="close"
                    onClick={() => setOpenModal(false)}
                    sx={{
                        color: "#555",
                        "&:hover": { color: "#000" },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Content */}
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.2rem",
                    textAlign: "center",
                }}
            >
                <Typography sx={{ fontSize: "0.95rem", color: "#555" }}>
                    {modalMessage}
                </Typography>
                <Box sx={{ width: '100%' }}>
                    <LinearProgress color="success" />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default DownloadModal