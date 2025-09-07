import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Grid,
    TextField,
    Avatar,
    CardActions,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext';
import CardTitle from '../../components/common/CardTitle';
import { LoadingButton } from '@mui/lab';
import { useAlert } from "../../contexts/AlertContext";
import * as yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../../css/PhoneInput.css'
import ProfileInformationCard from '../../components/user/ProfileInformationCard';
import DeleteUserCard from '../../components/user/DeleteUserCard';
import { update_user_profile_api } from '../../api/auth/update_user_profile_api';

// Define the validation schema with yup
const schema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
}).required();

function ViewProfilePage() {
    const { user, UpdateUser } = useUserContext();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthdate: '',
    });
    const [errors, setErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModified, setIsModified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    // Populate form data from user context
    useEffect(() => {
        if (user) {
            console.log('user:', user);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                birthdate: user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '',
            });
        }
    }, [user]);

    const validateForm = async () => {
        try {
            await schema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationErrors) {
            const validationIssues = {};
            validationErrors.inner.forEach((err) => {
                validationIssues[err.path] = err.message;
            });
            setErrors(validationIssues);
            return false;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsModified(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(URL.createObjectURL(file));
            setIsModified(true);
        }
    };

    const handleEditProfile = async () => {
        if (!(await validateForm())) {
            return;
        }

        setIsLoading(true);

        const requestObj = {
            email: formData.email,
            name: formData.mame,
            birthdate: formData.birthdate ? formData.birthdate : "",
        };
        update_user_profile_api(formData.name, formData.birthdate ? formData.birthdate : "")
            .then((res) => {
                console.log('response:', res);
                // Handle successful sign-up
                if (res.status && res.status.toLowerCase() === 'fail') {
                    showAlert('error', res.client_message || 'Update profile failed. Please try again.');
                    setIsLoading(false);
                    return
                }
                console.log('update profile successful:', res);
                const storedUser = JSON.parse(localStorage.getItem('user')) || {};
                const updatedUser = {
                    ...storedUser,
                    name: res.user.name,
                    birthdate: formData.birthdate
                };

                UpdateUser(updatedUser);
                showAlert('success', 'Your profile has been updated successfully.');
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('error:', err);
                setIsLoading(false);
            });
        setIsModified(false);
    };

    const deleteUser = async () => {
    };

    return (
        <Stack direction="column" spacing={2}>
            <ProfileInformationCard
                formData={formData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                handleEditProfile={handleEditProfile}
                errors={errors}
                isLoading={isLoading}
                isModified={isModified}
                selectedFile={selectedFile}
                user={user}
            />
            <DeleteUserCard
                deleteUser={deleteUser}
            />
        </Stack>
    );
}

export default ViewProfilePage;
