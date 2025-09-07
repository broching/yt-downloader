import { Container, Grid } from "@mui/material"
import { useEffect, useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; "../api/auth/SendPasswordResetApi";
import { useUserContext } from "../contexts/UserContext";
import { useAlert } from "../contexts/AlertContext";
import ResendVerificationEmailDialog from "../components/login/ResendVerificationEmailDialog";
import ResetPasswordDialog from "../components/login/ResetPasswordDialog";
import LogInRightCard from "../components/login/LogInRightCard";
import LogInLeftCard from "../components/login/LogInLeftCard";
import { useLocation } from "react-router-dom"; // Import useLocation
import { login_user_api } from "../api/auth/login_user_api";

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
    const [resendDialog, setResendDialog] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [mfaCode, setMfaCode] = useState('');
    const [session, setSession] = useState(null);
    const [isMfaRequired, setIsMfaRequired] = useState(false);

    const { UserLogIn } = useUserContext();
    const { showAlert } = useAlert();
    const location = useLocation(); // Access the current URL location

    useEffect(() => {
        const hash = window.location.hash.substring(1); // Remove the #
        const params = new URLSearchParams(hash);
        const idToken = params.get("id_token");
        const accessToken = params.get("access_token");

        // Store tokens securely
        if (idToken && accessToken) {
            localStorage.setItem("id_token", idToken);
            localStorage.setItem("access_token", accessToken);
        }

        // Clear hash to prevent duplicate parsing
        window.history.replaceState(null, null, " ");
    }, []);
    const togglePasswordVisibility = () => {
        console.log('test')
        setShowPassword(!showPassword);
    };

    const handleResetPasswordDialog = () => {
        setResetPasswordDialog(true);
    }

    const handleResetPasswordDialogClose = () => {
        setResetPasswordDialog(false);
    }

    const handleResendDialog = () => {
        setResendDialog(true);
    }

    const handleResendDialogClose = () => {
        setResendDialog(false);
    }

    const googleAuth = null;

    const handleSignIn = (email, password) => {
        setLoading(true);
        login_user_api(email, password)
            .then((res) => {
                // Handle successful sign-up
                console.log('response:', res);
                if (res.status && res.status.toLowerCase() === 'fail') {
                    showAlert('error', res.client_message || 'log in failed. Please try again.');
                    setLoading(false);
                    return
                }
                
                console.log('log in successful:', res);
                UserLogIn(res.user, res.accessToken); // Handle successful login
                navigate('/');
                showAlert('success', 'Welcome back! You have successfully logged in.');
                setLoading(false);
            })
            .catch((err) => {
                console.error('error:', err);
                setLoading(false);
            });
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.email = data.email.trim();
            data.password = data.password.trim();

            handleSignIn(data.email, data.password);
        }

    })

    const resetFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
        }),
        onSubmit: (data) => {
            setResetLoading(true);
        }
    })

    const resendFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
        }),
        onSubmit: (data) => {
            setResendLoading(true);
            data.email = data.email.trim();
            data.email = data.email.trim();
        }
    })

    return (
        <>
            <Container maxWidth="xl" sx={{ marginY: "1rem", marginTop: '2rem', }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid size={{ xs: 12, sm: 6, md: 5, lg: 5 }}>
                        <LogInLeftCard
                            formik={formik}
                            togglePasswordVisibility={togglePasswordVisibility}
                            showPassword={showPassword}
                            mfaCode={mfaCode}
                            setMfaCode={setMfaCode}
                            errorMessage={errorMessage}
                            loading={loading}
                            handleResetPasswordDialog={handleResetPasswordDialog}
                            isMfaRequired={isMfaRequired}
                            open={open}
                            setOpen={setOpen}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 5, lg: 5 }}>
                        <LogInRightCard
                            handleResendDialog={handleResendDialog}
                        />
                    </Grid>
                </Grid>
            </Container>
            <ResetPasswordDialog
                resetPasswordDialog={resetPasswordDialog}
                handleResetPasswordDialogClose={handleResetPasswordDialogClose}
                resetFormik={resetFormik}
                resetLoading={resetLoading}
            />
            <ResendVerificationEmailDialog
                resendDialog={resendDialog}
                handleResendDialogClose={handleResendDialogClose}
                resendFormik={resendFormik}
                resendLoading={resendLoading}
            />
        </>
    )
}

export default LoginPage