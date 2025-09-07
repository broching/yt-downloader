import { Delete, Logout } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./AlertContext";

const userContext = createContext(null);

export const UserProvider = (props) => {

    const { children } = props;
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [idTokoen, setIdToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isReady, setIsReady] = useState(false);

    const navigate = useNavigate();
    const { showAlert } = useAlert();

    useEffect(() => {
        const accessTokenCheck = localStorage.getItem('accessToken');
        const userStorage = localStorage.getItem('user');

        // set the use state variables
        if (userStorage && accessTokenCheck) {
            setAccessToken(accessTokenCheck);
            setUser(JSON.parse(userStorage)); // Correctly parse the stored user object
        }
        setIsReady(true);
    }, []);

    // Method to populate the context use state vairables
    const UserLogIn = (userObject, accessTokenInput) => {
        // Store tokens in localStorage or secure storage
        localStorage.setItem('accessToken', accessTokenInput);
        // Set tokens in state for easy access
        setAccessToken(accessTokenInput);

        localStorage.setItem('user', JSON.stringify(userObject));
        setUser(userObject)
    }

    const UpdateUser = (userObject, accessTokenInput = null) => {
        if (accessTokenInput) {
            localStorage.setItem('accessToken', accessTokenInput);
            setAccessToken(accessTokenInput);
        }
        localStorage.setItem('user', JSON.stringify(userObject));
        setUser(userObject);
    }


    const DeleteUser = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        setAccessToken(null);
        setIdToken(null);
        setRefreshToken(null);
        setUser(null);
        showAlert('info', 'Your account has been deleted')
        navigate('/')
    }

    const UserLogOut = () => {
        navigate('/')
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        setAccessToken(null);
        setUser(null);

        showAlert('success', 'Log out successful')
    }

    const SessionRefreshError = async () => {
        await navigate('/login')
        UserLogOut();
        showAlert('warning', 'Your session has expired. Please log in again.')
    }

    const SetNewTokens = (inputAccessToken, inputIdToken) => {
        localStorage.setItem('accessToken', inputAccessToken);
        localStorage.setItem('idToken', inputIdToken);
        setAccessToken(inputAccessToken);
        setIdToken(inputIdToken);
        console.log('new tokens set')
    }

    const RefreshUser = async (retryCount = 0) => {

    }

    const IsLoggedIn = () => {
        if (user) {
            return true
        }
        else {
            return false
        }
    }


    return (
        <userContext.Provider
            value={{
                accessToken,
                idTokoen,
                refreshToken,
                user,
                setUser,
                UserLogIn,
                UserLogOut,
                IsLoggedIn,
                RefreshUser,
                SessionRefreshError,
                SetNewTokens,
                DeleteUser,
                UpdateUser,
            }}
        >
            {isReady ? children : null}
        </userContext.Provider>
    )
}

// Custom hook to handle errors
export const useUserContext = () => {
    if (!userContext) {
        enqueueSnackbar('User context is null, please add your component within the scope of your provider')
    }
    return useContext(userContext);
}