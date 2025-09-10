import {
    Typography,
    Tabs,
    Tab,
    FormControl,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from "@mui/material";

function DownloaderRightCard(props) {
    const {
        tabValue,
        handleTabChange,
        activeFormats,
        keysToRender,
        selectedExt,
        setSelectedExt,
        handleDownload,
        audioFormats
    } = props;
    // MUI components
    return (
        <div style={{ flex: 1 }}>
            <TableContainer component={Paper} sx={{ border: "1px solid lightgray" }}>
                <Tabs
                    sx={{
                        marginLeft: '1rem',
                        '& .MuiTabs-indicator': { backgroundColor: 'red' },
                        '& .MuiTab-root': { color: 'black' },
                        '& .Mui-selected': { color: 'red !important' }
                    }}
                    value={tabValue} onChange={handleTabChange}>
                    <Tab label="Video" />
                    <Tab label="Audio" />
                </Tabs>
                <Table sx={{ mt: "1rem" }} size="small">
                    <TableHead>
                        {tabValue === 0 && (
                            <TableRow>
                                <TableCell sx={{ minWidth: "100px", width: "50%" }}>Resolution</TableCell>
                                <TableCell sx={{ minWidth: "60px", width: "25%" }}>Extension</TableCell>
                                <TableCell sx={{ minWidth: "60px", width: "25%" }}>Action</TableCell>
                            </TableRow>
                        )}
                        {tabValue === 1 && (
                            <TableRow>
                                <TableCell sx={{ minWidth: "100px", width: "65%" }}>Extension</TableCell>
                                <TableCell sx={{ minWidth: "60px", width: "35%" }}>Action</TableCell>
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {tabValue === 1 ? (
                            (() => {
                                if (audioFormats.length === 0) {
                                    return (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                No audio formats available
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                // Pick the best audio (highest abr)
                                const bestAudio = audioFormats.reduce((prev, curr) => {
                                    if (!curr.abr) return prev;
                                    if (!prev.abr || curr.abr > prev.abr) return curr;
                                    return prev;
                                }, audioFormats[0]);

                                return (
                                    <TableRow key={bestAudio.itag}>
                                        <TableCell>mp3</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleDownload({ ...bestAudio, ext: "mp3" }, false)}
                                                sx={{ backgroundColor: "#5cb85c" }}
                                            >
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })()
                        ) : (
                            // Video tab: keep the previous rendering
                            keysToRender.length === 0 ? (
                                <>
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ borderBottom: "none" }}>
                                            <CircularProgress sx={{ color: "red", mt: "1rem" }} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ borderTop: "none" }}>
                                        <TableCell colSpan={3} align="center" sx={{ border: "none" }}>
                                            <Typography >Processing Video...</Typography>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ) : (
                                keysToRender.map((key) => {
                                    const formatsList = activeFormats[key];
                                    const firstFormat = formatsList[0];
                                    const currentExt = selectedExt[key] || firstFormat.ext;

                                    return (
                                        <TableRow key={key}>
                                            <TableCell>{key}</TableCell>
                                            <TableCell>
                                                <FormControl size="small" fullWidth>
                                                    <Select
                                                        value={currentExt}
                                                        size="small"
                                                        onChange={(e) =>
                                                            setSelectedExt(prev => ({ ...prev, [key]: e.target.value }))
                                                        }
                                                    >
                                                        {Array.from(new Set(formatsList.map(f => f.ext || "-"))).map((value) => (
                                                            <MenuItem key={value} value={value}>{value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => {
                                                        const selectedFormat = formatsList.find(f => f.ext === currentExt) || firstFormat;
                                                        handleDownload(selectedFormat, true);
                                                    }}
                                                    sx={{ backgroundColor: "#5cb85c" }}
                                                >
                                                    Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default DownloaderRightCard