import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import CardTitle from '../../components/common/CardTitle'
import AddLinkIcon from '@mui/icons-material/AddLink';
import UserSocialLoginCard from '../../components/user/UserSocialLoginCard';
import { useUserContext } from '../../contexts/UserContext';
import { useAlert } from '../../contexts/AlertContext';
import { jwtDecode } from 'jwt-decode';
import UserPasswordCard from '../../components/user/UserPasswordCard';
import SSORootSocialLoginCard from '../../components/user/SSORootSocialLoginCard';
import SSORootPasswordCard from '../../components/user/SSORootPasswordCard';
import { update_user_password_api } from '../../api/auth/update_user_password_api';

function UserPasswordLoginPage() {

    const { user, UpdateUser } = useUserContext()
    const { showAlert } = useAlert()
    const [loading, setLoading] = useState({ googleLoading: false, facebookLoading: false, changePasswordLoading: false, forgetPasswordLoading: false })

    const getFederatedIdentitySub = (userAttributes, provider) => {
        if (!userAttributes || !userAttributes.identities) {
            return null;
        }
        // Parse the identities array
        const identities = JSON.parse(userAttributes.identities);

        const googleIdentity = identities.find(identity => identity.providerName === provider);

        if (googleIdentity) {
            return googleIdentity.userId;  // Return the Google 'sub' (user ID)
        }
        return null;
    };

    const unlinkGoogle = () => {
        setLoading((prev) => ({
            ...prev,
            googleLoading: true,
        }));

        const sub = getFederatedIdentitySub(user.UserAttributes, "Google")
    }

    const linkGoogle = (credentials) => {
        const { sub } = jwtDecode(credentials)
    }

    const linkFacebook = (credentials) => {
    }

    const unlinkFacebook = () => {
        setLoading((prev) => ({
            ...prev,
            facebookLoading: true,
        }));
        const sub = getFederatedIdentitySub(user.UserAttributes, "Facebook")
    }

    const changePassword = (currentPassword, newPassword) => {
        setLoading((prev) => ({
            ...prev,
            changePasswordLoading: true,
        }));
        update_user_password_api(
            currentPassword,
            newPassword,
        ).then((res) => {
            console.log("test", res)
            setLoading((prev) => ({
                ...prev,
                changePasswordLoading: false,
            }));
            if (res.status && res.status.toLowerCase() === 'fail') {
                showAlert('error', res?.client_message || 'Password change failed. Please try again.');
                return
            }
            UpdateUser(res.user, res.accessToken)
            showAlert("success", "Password changed successfully");
        }).catch((error) => {
            setLoading((prev) => ({
                ...prev,
                changePasswordLoading: false,
            }));
            showAlert(error.message, "error");
        });
    }

    const forgetPassword = () => {
        setLoading((prev) => ({
            ...prev,
            forgotPasswordLoading: true,
        }));
    }


    return (
        <>

            <UserSocialLoginCard
                unlinkGoogle={unlinkGoogle}
                linkGoogle={linkGoogle}
                linkFacebook={linkFacebook}
                unlinkFacebook={unlinkFacebook}
                googleLoading={loading.googleLoading}
                facebookLoading={loading.facebookLoading}
            />

            <Box sx={{ marginTop: "1.3rem" }} />


            <UserPasswordCard
                changePassword={changePassword}
                loading={loading}
                forgetPassword={forgetPassword}
            />


        </>
    )
}

export default UserPasswordLoginPage