import { Step, Stepper, StepLabel, Box, Card, CardContent, Typography, Stack, Grid, Divider, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import SmsIcon from '@mui/icons-material/Sms';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../../css/PhoneInput.css';
import CardTitle from '../../components/common/CardTitle';
import { Link } from 'react-router-dom';
import GetUserTypeFromUsername from '../../functions/GetUserTypeFromUsername';

function MFAPhoneCard(props) {
    const {
        phoneNumber,
        handlePhoneChange,
        isPhoneInputEnabled,
        errors,
        saveNumberLoading,
        handleSavePhoneNumber,
        user,
        isMobile,
        handleVerifyNumber,
        handleReEnablePhoneInput,
        loading,
        setshowEnableMFAModal,
        setShowDisable,
    } = props;

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <CardTitle icon={<LocalPhoneIcon />} title="Phone Number" />
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, sm: 8, md: 8 }} sx={{ mt: '1rem' }}>
                            <PhoneInput
                                defaultCountry="SG"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="Enter phone number"
                                disabled={!isPhoneInputEnabled}
                            />

                            {errors.phone_number && (
                                <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', ml: '14px' }}>
                                    {errors.phone_number}
                                </Typography>
                            )}

                            <LoadingButton
                                loading={saveNumberLoading}
                                variant="contained"
                                color="primary"
                                disabled={!isPhoneInputEnabled}
                                onClick={handleSavePhoneNumber}
                                sx={{ mt: '1rem', mb: '0.8rem' }}
                            >
                                Save Number
                            </LoadingButton>
                        </Grid>

                        <Grid item size={{ xs: 12, sm: 4, md: 4 }} sx={{ mt: '1rem', mb: '1rem' }}>
                            {user.phone_number_verified === "false" && (
                                <Box>
                                    <Alert severity="warning">Your Number is not verified.</Alert>
                                    <Typography variant="body2" sx={{ ml: '0.3rem' }}>
                                        Click <Link to="#" onClick={handleVerifyNumber}>here</Link> to send a verification code.
                                    </Typography>
                                </Box>
                            )}

                            {user.phone_number_verified === "true" && (
                                <Box>
                                    <Alert severity="success">Your Number is Verified.</Alert>
                                    <Typography variant="body2" sx={{ ml: '0.3rem' }}>
                                        Click <Link to="#" onClick={handleReEnablePhoneInput}>here</Link> to set a new number.
                                    </Typography>
                                </Box>
                            )}

                            {!user.phone_number_verified && (
                                <Box>
                                    <Alert severity="info">Add your number.</Alert>
                                    <Typography variant="body2" sx={{ ml: '0.3rem' }}>
                                        For 2FA to work, you need a phone number.
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: '1rem' }} />
                    <CardTitle icon={<SecurityIcon />} title="2-Factor Authentication (2FA)" />

                    <Box my="1rem" sx={{ p: '10px' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 1.6,
                                color: '#555',
                                mb: '1.5rem',
                                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' }
                            }}
                        >
                            To enable 2FA, you need a <b>verified</b> phone number.
                        </Typography>

                        {!isMobile && (
                            <Typography
                                variant="body1"
                                sx={{
                                    lineHeight: 1.6,
                                    color: '#555',
                                    mb: '1.5rem',
                                    fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' }
                                }}
                            >
                                After you log in with email/password, you will be required to enter a unique code sent to your messages.
                            </Typography>
                        )}

                        <Box my="1.5rem">
                            <Stepper activeStep={-1} alternativeLabel>
                                <Step>
                                    <StepLabel>
                                        <SmsIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                                        <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' } }} component="span">
                                            {isMobile ? "Step 1: Password" : "Step 1: Enter your email/password"}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>
                                        <PhoneInTalkIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                                        <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' } }} component="span">
                                            {isMobile ? "Step 2: SMS Code" : "Step 2: Receive SMS with verification code"}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>
                                        <VerifiedUserIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                                        <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' } }} component="span">
                                            {isMobile ? "Step 3: Verify" : "Step 3: Enter code to verify your account"}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            </Stepper>
                        </Box>

                        <Box>
                            {!user.enable_mfa && user.phone_number_verified === "true" && (
                                <LoadingButton
                                    sx={{ ml: '-0.5rem' }}
                                    loading={loading}
                                    variant="contained"
                                    color="primary"
                                    loadingPosition="start"
                                    startIcon={<LockIcon />}
                                    onClick={() => setshowEnableMFAModal(true)}
                                >
                                    Enable 2FA
                                </LoadingButton>
                            )}

                            {user.enable_mfa && user.phone_number_verified === "true" && (
                                <LoadingButton
                                    sx={{ ml: '-0.5rem' }}
                                    loading={loading}
                                    variant="contained"
                                    color="warning"
                                    loadingPosition="start"
                                    startIcon={<KeyOffIcon />}
                                    onClick={() => setShowDisable(true)}
                                >
                                    Disable 2FA
                                </LoadingButton>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    );
}

export default MFAPhoneCard;
