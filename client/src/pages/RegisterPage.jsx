import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, List, ListItem, ListItemIcon, ListItemText, IconButton, InputAdornment, Divider } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import { useAlert } from '../contexts/AlertContext';
import CardTitle from '../components/common/CardTitle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoadingButton from '@mui/lab/LoadingButton';
import { enqueueSnackbar } from 'notistack';
import { register_user_api } from '../api/auth/register_user_api';


const schema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\^$*.\[\]{}()?\-"!@#%&/\\,><':;|_~`]/, 'Password must contain at least one special character')
        .notOneOf([yup.ref('username'), null], 'Password cannot contain your username'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords do not match')
}).required();

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        yup.reach(schema, name).validate(value).then(() => {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }).catch(err => {
            setErrors(prev => ({ ...prev, [name]: err.message }));
        });

        if (name === 'password' || name === 'confirmPassword') {
            const passwordVal = name === 'password' ? value : formData.password;
            const confirmPasswordVal = name === 'confirmPassword' ? value : formData.confirmPassword;

            setTimeout(() => {
                if (passwordVal !== confirmPasswordVal) {
                    setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
                } else {
                    setErrors(prev => ({ ...prev, confirmPassword: "" }));
                }
            }, 0);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        schema.validate(formData, { abortEarly: false })
            .then(() => {
                setErrors({});
                register_user_api(formData.name, formData.email, formData.password)
                    .then((res) => {
                        // Handle successful sign-up
                        if (res.status && res.status.toLowerCase() === 'fail') {
                            showAlert('error', res.client_message || 'Sign up failed. Please try again.');
                            setLoading(false);
                            return
                        }
                        console.log('Sign-up successful:', res);
                        navigate('/login');
                        showAlert('success', 'Sign up successfull. Please log in.')
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error('error:', err);
                        setLoading(false);
                    });
            })
            .catch(err => {
                const newErrors = err.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setErrors(newErrors);
                setLoading(false);
            });
    };

    const passwordValidationCriteria = [
        { test: (pwd) => pwd.length >= 8, text: "At least 8 characters" },
        { test: (pwd) => /[A-Z]/.test(pwd), text: "At least one uppercase letter" },
        { test: (pwd) => /[a-z]/.test(pwd), text: "At least one lowercase letter" },
        { test: (pwd) => /[0-9]/.test(pwd), text: "At least one number" },
        { test: (pwd) => /[\^$*.\[\]{}()?\-"!@#%&/\\,><':;|_~`]/.test(pwd), text: "At least one special character" },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                marginTop: '2rem',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Paper elevation={6}
                sx={{
                    display: 'flex',
                    width: {
                        xs: '90%',
                        sm: '70%',
                        md: '60%',
                        lg: '50%',
                        xl: '50%'
                    }
                }}>
                <Grid container>
                    <Grid size={{ xs: 12, md: 6 }} sx={{
                        backgroundImage: `url(/images/registerPage.webp)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} />
                    <Grid size={{ xs: 12, md: 6 }} sx={{ padding: 3 }}>
                        <CardTitle title="Register an account" icon={<PersonAddIcon />} />
                        <Divider />
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            {Object.keys(formData).map(key => (
                                <TextField
                                    key={key}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id={key}
                                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                    name={key}
                                    type={(key === "password" && !showPassword) || (key === "confirmPassword" && !showConfirmPassword) ? "password" : "text"}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    error={!!errors[key]}
                                    helperText={errors[key]}
                                    autoComplete={key}
                                    InputProps={{
                                        endAdornment: (key === "password" || key === "confirmPassword") ? (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={key === "password" ? togglePasswordVisibility : toggleConfirmPasswordVisibility}
                                                    edge="end"
                                                >
                                                    {(key === "password" && showPassword) || (key === "confirmPassword" && showConfirmPassword) ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            height: '40px'
                                        },
                                        '& .MuiFormLabel-root': {
                                            fontSize: '0.9rem',
                                            top: '-7px'
                                        },
                                    }}
                                />
                            ))}
                            <List dense sx={{ marginTop: -2 }}>
                                {passwordValidationCriteria.map((criteria, index) => (
                                    <ListItem key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '0.5rem',
                                            '& .MuiTypography-root': {
                                                fontSize: '0.7rem',
                                                marginLeft: '-35px'
                                            },
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '0.7rem'
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            {criteria.test(formData.password) ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                                        </ListItemIcon>
                                        <ListItemText primary={criteria.text} sx={{ color: criteria.test(formData.password) ? 'green' : 'red' }} />
                                    </ListItem>
                                ))}
                            </List>
                            <LoadingButton type="submit" loadingPosition="start" fullWidth loading={loading} variant="contained" color="primary" sx={{ mt: 3, mb: 2, }} >Sign up</LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default RegisterPage;