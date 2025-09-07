import { useState } from 'react'
import { useTheme, useMediaQuery } from '@mui/material'
import { useUserContext } from '../../contexts/UserContext'
import { isValidPhoneNumber } from 'react-phone-number-input';
import VerifyPhoneNumberDialogModal from '../../components/common/VerifyPhoneNumberDialogModal'
import { useAlert } from '../../contexts/AlertContext'
import EnableMFAModal from '../../components/user/EnableMFAModal'
import DisableMFAModal from '../../components/user/DisableMFAModal'
import MFAPhoneCard from '../../components/user/MFAPhoneCard'
import { update_user_phone_number_api } from '../../api/auth/update_user_phone_number';

function UserMFAPage() {
    const [showVerifyNumberDialog, setShowVerifyNumberDialog] = useState(false);
    const [showDisable, setShowDisable] = useState(false);
    const [showEnableMFAModal, setshowEnableMFAModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enable2FALoading, setEnable2FALoading] = useState(false);
    const { user, UpdateUser, accessToken, refreshToken, SessionRefreshError } = useUserContext();
    const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");
    const [errors, setErrors] = useState('');
    const [sendCodeButtonLoading, setSendCodeButtonLoading] = useState(false);
    const [verifyButtonLoading, setVerifyButtonLoading] = useState(false);
    const [saveNumberLoading, setSaveNumberLoading] = useState(false);
    const [isPhoneInputEnabled, setIsPhoneInputEnabled] = useState(user.phone_number_verified == true ? false : true);
    const [verificationCode, setVerificationCode] = useState('');
    const { showAlert } = useAlert();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handlePhoneChange = (value) => {
        setPhoneNumber(value);
    };

    const handleReEnablePhoneInput = () => {
        setIsPhoneInputEnabled(true); // Enable phone input and Save button
    };

    const sendVerificationCode = () => {
        setSendCodeButtonLoading(true);
    }

    const verifyCode = (code) => {
        setVerifyButtonLoading(true)
    }

    const handleSavePhoneNumber = () => {
        // Logic to save the phone number, e.g., API call or update user attributes
        let inputPhoneNumber = phoneNumber == undefined ? "" : phoneNumber
        if (inputPhoneNumber == "") {
            savePhoneNumberApi(inputPhoneNumber);
        }
        else if (isValidPhoneNumber(inputPhoneNumber)) {
            savePhoneNumberApi(inputPhoneNumber);
        }
        else {
            setErrors({ phone_number: "Invalid phone_number" })
        }
    };

    const savePhoneNumberApi = (inputPhoneNumber) => {
        console.log('inputPhoneNumber:', inputPhoneNumber);
        setSaveNumberLoading(true);
        update_user_phone_number_api(inputPhoneNumber)
            .then((res) => {
                console.log('response:', res);
                // Handle successful sign-up
                if (res.status && res.status.toLowerCase() === 'fail') {
                    showAlert('error', res.client_message || 'Update profile failed. Please try again.');
                    setSaveNumberLoading(false);
                    return
                }
                console.log('update profile successful:', res);
                const storedUser = JSON.parse(localStorage.getItem('user')) || {};
                const updatedUser = {
                    ...storedUser,
                    phone_number: res.user.phone_number,
                };

                UpdateUser(updatedUser);
                showAlert('success', 'Your profile has been updated successfully.');
                setSaveNumberLoading(false);
            })
            .catch((err) => {
                console.error('error:', err);
                setSaveNumberLoading(false);
            });
    }

    const enable2FA = () => {
        setEnable2FALoading(true);

    }


    const disable2FA = () => {
        setLoading(true)

    }

    const handleVerifyNumber = () => {
        setShowVerifyNumberDialog(true)
    }

    return (
        <>
            <MFAPhoneCard
                phoneNumber={phoneNumber}
                handlePhoneChange={handlePhoneChange}
                isPhoneInputEnabled={isPhoneInputEnabled}
                errors={errors}
                saveNumberLoading={saveNumberLoading}
                handleSavePhoneNumber={handleSavePhoneNumber}
                user={user}
                isMobileisMobile
                handleVerifyNumber={handleVerifyNumber}
                handleReEnablePhoneInput={handleReEnablePhoneInput}
                loading={loading}
                setshowEnableMFAModal={setshowEnableMFAModal}
                setShowDisable={setShowDisable}
                isMobile={isMobile}
            />
            <VerifyPhoneNumberDialogModal
                open={showVerifyNumberDialog}
                setOpen={setShowVerifyNumberDialog}
                phoneNumber={phoneNumber}
                onSendCode={sendVerificationCode}
                loadingSendCode={sendCodeButtonLoading}
                onVerify={verifyCode}
                loadingVerify={verifyButtonLoading}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
            />
            <EnableMFAModal
                showModal={showEnableMFAModal}
                setShowModal={setshowEnableMFAModal}
                enable2FA={enable2FA}
                loading={enable2FALoading}
            />

            <DisableMFAModal
                showModal={showDisable}
                setShowModal={setShowDisable}
                disable2FA={disable2FA}
                loading={loading}
            />
        </>
    )
}

export default UserMFAPage