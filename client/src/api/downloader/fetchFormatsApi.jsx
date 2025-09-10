import api from "../APIRequest";

export const fetchFormatsApi = async (url) => {
    try {
        let response = await api.get(`/downloader/formats?url=${url}`);
        return response.data;
    } catch (error) {
        console.error('Error getting video formats:', error);
        // Re-throw the error for higher-level handling
        throw error;
    }
};