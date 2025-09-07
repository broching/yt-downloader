const express = require("express");
const yup = require("yup");
const constants = require("../modules/constants");
const helpers = require("../modules/helpers");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {
    insertDocument,
    findDocument,
    updateDocument,
} = require("../services/db");
const { validateToken } = require("../modules/auth");
const cors = require("cors");
const fs = require("fs");
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");


router.post("/create_user", cors(), async (req, res) => {
    const data = req.body;

    try {
        const validationSchema = yup.object({
            name: yup
                .string()
                .trim()
                .required("Name is required"),
            email: yup
                .string()
                .trim()
                .email("Must be a valid email")
                .required("Email is required"),
            password: yup
                .string()
                .trim()
                .min(constants.PASSWORD_MIN_CHAR)
                .max(constants.PASSWORD_MAX_CHAR)
                .required("Password is required")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
                ),
        });

        try {
            await validationSchema.validate(data, { abortEarly: false });
        } catch (error) {
            return res.json(helpers.yupErrorResponse(error));
        }

        const existingUser = await findDocument(
            { email: data.email },
            constants.MONGO_DB_COLLECTIONS.USER
        );

        if (existingUser) {
            return res.json(helpers.createErrorResponse("Email already exists."));
        }

        // Hash password
        data.password = await bcrypt.hash(data.password, 10);

        // Add UUID
        data.uuid = uuidv4();
        data.role = constants.USER_ROLES.USER; // Default role
        data.created_at = new Date();
        data.updated_at = new Date();
        data.phone_number = ""; // Optional field
        data.phone_number_verified = false; // Optional field
        data.enable_mfa = false; // Optional field
        data.birthdate = null; // Optional field

        const userInfo = await insertDocument(
            data,
            constants.MONGO_DB_COLLECTIONS.USER
        );

        const accessToken = sign(userInfo, constants.APP_SECRET, {
            expiresIn: constants.TOKEN_EXPIRES_IN,
        });

        res.json({
            accessToken,
            user: userInfo,
        });
    } catch (error) {
        res.json(
            helpers.createErrorResponse(
                `Error at ${req.path} with message: ` + error.message, error.message
            )
        );
    }
});

module.exports = router;

router.post("/login_user", cors(), async (req, res) => {
    const data = req.body;

    try {
        // Validate request body
        const validationSchema = yup.object({
            email: yup
                .string()
                .trim()
                .email("Must be a valid email")
                .required("Email is required"),
            password: yup
                .string()
                .trim()
                .min(constants.PASSWORD_MIN_CHAR)
                .max(constants.PASSWORD_MAX_CHAR)
                .required("Password is required"),
        });

        try {
            await validationSchema.validate(data, { abortEarly: false });
        } catch (error) {
            return res.json(helpers.yupErrorResponse(error));
        }

        const errorMsg = "Email or password is not correct.";

        // Find user by email
        const user = await findDocument(
            { email: data.email },
            constants.MONGO_DB_COLLECTIONS.USER
        );

        if (!user) {
            throw new Error(errorMsg);
        }

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            throw new Error(errorMsg);
        }

        // Prepare user info for token and response
        const userInfo = {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
            phone_number: user.phone_number || "",
            phone_number_verified: user.phone_number_verified || false,
            birthdate: user.birthdate,
            created_at: user.created_at,
            updated_at: user.updated_at,
            enable_mfa: user.enable_mfa || false,

        };

        const accessTokenInfo = {
            uuid: userInfo.uuid,
            email: userInfo.email,
            role: userInfo.role,
        };

        const accessToken = sign(accessTokenInfo, constants.APP_SECRET, {
            expiresIn: constants.TOKEN_EXPIRES_IN,
        });

        res.json({
            accessToken,
            user: userInfo,
        });

    } catch (error) {
        res.json(
            helpers.createErrorResponse(
                `Error at ${req.path} with message: ` + error.message, error.message
            )
        );
    }
});

router.post("/update_user_profile", cors(), validateToken, async (req, res) => {
    const data = req.body;
    const userToken = req.user; // Populated by validateToken

    const validationSchema = yup.object({
        name: yup.string().trim().min(1).max(100).required("Name is required"),
        birthdate: yup
            .date()
            .max(new Date(), "Birthdate cannot be in the future")
            .optional(),
    });

    try {
        await validationSchema.validate(data, { abortEarly: false });
    } catch (error) {
        return res.json(helpers.yupErrorResponse(error));
    }

    try {
        const existingUser = await findDocument(
            { uuid: userToken.uuid },
            constants.MONGO_DB_COLLECTIONS.USER
        );

        if (!existingUser) {
            return res.json(
                helpers.createErrorResponse("User not found.")
            );
        }

        const updateFields = {
            name: data.name,
            updated_at: new Date(),
        };

        if (data.birthdate) {
            updateFields.birthdate = new Date(data.birthdate);
        }

        await updateDocument(
            { uuid: userToken.uuid },
            { $set: updateFields },
            constants.MONGO_DB_COLLECTIONS.USER
        );

        const updatedUser = await findDocument(
            { uuid: userToken.uuid },
            constants.MONGO_DB_COLLECTIONS.USER
        );

        return res.json({
            status: constants.STATUS.SUCCESS,
            message: "Profile updated successfully.",
            user: {
                uuid: updatedUser.uuid,
                name: updatedUser.name,
                birthdate: updatedUser.birthdate,
                email: updatedUser.email,
                updated_at: updatedUser.updated_at,
            },
        });

    } catch (error) {
        console.log('reached', error)
        return res.json(
            helpers.createErrorResponse(
                `Error at ${req.path} with message: ` + error.message,
                error.message
            )
        );
    }
});

router.post("/update_user_phone_number", cors(), validateToken, async (req, res) => {
    const data = req.body;
    console.log("update_user_phone_number called", data);
    const userToken = req.user; // Populated by validateToken

    const validationSchema = yup.object({
        phone_number: yup
            .string()
            .trim()
            .required("Phone number is required"),
    });

    try {
        await validationSchema.validate(data, { abortEarly: false });
    } catch (error) {
        return res.json(helpers.yupErrorResponse(error));
    }

    try {
        const existingUser = await findDocument(
            { uuid: userToken.uuid },
            constants.MONGO_DB_COLLECTIONS.USER
        );

        if (!existingUser) {
            return res.json(
                helpers.createErrorResponse("User not found.")
            );
        }

        const updateFields = {
            phone_number: data.phone_number,
            updated_at: new Date(),
        };


        await updateDocument(
            { uuid: userToken.uuid },
            { $set: updateFields },
            constants.MONGO_DB_COLLECTIONS.USER
        );

        const updatedUser = await findDocument(
            { uuid: userToken.uuid },
            constants.MONGO_DB_COLLECTIONS.USER
        );

        return res.json({
            status: constants.STATUS.SUCCESS,
            message: "Profile updated successfully.",
            user: {
                uuid: updatedUser.uuid,
                name: updatedUser.name,
                birthdate: updatedUser.birthdate,
                email: updatedUser.email,
                phone_number: updatedUser.phone_number,
                phone_number_verified: updatedUser.phone_number_verified, 
                updated_at: updatedUser.updated_at,
            },
        });

    } catch (error) {
        console.log('reached', error)
        return res.json(
            helpers.createErrorResponse(
                `Error at ${req.path} with message: ` + error.message,
                error.message
            )
        );
    }
});


router.post("/update_user_password", cors(), validateToken, async (req, res) => {
    console.log("update_user_password called", req.body);
    const data = req.body;
    const userToken = req.user; // Populated by validateToken

    const validationSchema = yup.object({
        currentPassword: yup
            .string()
            .trim()
            .min(constants.PASSWORD_MIN_CHAR)
            .max(constants.PASSWORD_MAX_CHAR)
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
            ),
        newPassword: yup
            .string()
            .trim()
            .min(constants.PASSWORD_MIN_CHAR)
            .max(constants.PASSWORD_MAX_CHAR)
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
            ),
    });

    try {
        await validationSchema.validate(data, { abortEarly: false });
    } catch (error) {
        res.json(helpers.yupErrorResponse(error, "Validation error"));
        return;
    }

    const existingUser = await findDocument(
        { uuid: userToken.uuid },
        constants.MONGO_DB_COLLECTIONS.USER
    );

    if (!existingUser) {
        return res.json(
            helpers.createErrorResponse("User not found.")
        );
    }

    const match = await bcrypt.compare(data.currentPassword, existingUser.password);
    if (!match) {
        return res.json(helpers.createErrorResponse("Current password is incorrect."));
    }
    const isSamePassword = await bcrypt.compare(data.newPassword, existingUser.password);
    if (isSamePassword) {
        return res.json(helpers.createErrorResponse("New password must not be same as current password."));
    }

    const newHashedPassword = await bcrypt.hash(data.newPassword, 10);

    await updateDocument(
        { uuid: userToken.uuid },
        { $set: { password: newHashedPassword } },
        constants.MONGO_DB_COLLECTIONS.USER
    );

    const userInfo = {
        uuid: existingUser.uuid,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        phone_number: existingUser.phone_number || "",
        phone_number_verified: existingUser.phone_number_verified || false,
        birthdate: existingUser.birthdate,
        created_at: existingUser.created_at,
        updated_at: existingUser.updated_at,
        enable_mfa: existingUser.enable_mfa || false,
    };

    const accessTokenInfo = {
        uuid: existingUser.uuid,
        email: existingUser.email,
        role: existingUser.role,
    };
    
    let accessToken = sign(accessTokenInfo, constants.APP_SECRET, {
        expiresIn: constants.TOKEN_EXPIRES_IN,
    });

    res.json({
        accessToken,
        user: userInfo,
    });
});

// For internal use only. Reset user's password to default password.
router.post("/ResetPassword", cors(), async (req, res) => {
    const data = req.body;
    const validationSchema = yup.object({
        username: yup.string().trim().min(3).max(50).required(),
    });

    try {
        await validationSchema.validate(data, { abortEarly: false });
    } catch (error) {
        res.json(helpers.yupErrorResponse(error));
        return;
    }

    const user = await findDocument(
        { username: data.username },
        constants.MONGO_DB_COLLECTIONS.USER
    );

    if (user == null) {
        return res.json({
            status: constants.STATUS.FAIL,
            message: "User does not exist",
        });
    }

    const newHashedPassword = await bcrypt.hash(
        constants.DEFAULT_USER_PASSWORD,
        10
    );

    await updateDocument(
        { username: user.username },
        { $set: { password: newHashedPassword } },
        constants.MONGO_DB_COLLECTIONS.USER
    );

    let userInfo = {
        username: user.username,
    };
    let accessToken = sign(userInfo, constants.APP_SECRET, {
        expiresIn: constants.TOKEN_EXPIRES_IN,
    });

    res.json({
        accessToken,
        user: userInfo,
    });
});

router.get("/oauth2callback", async (req, res) => {
    if (req.query.error) {
        // The user did not give the app permission.
        return res.send("Permission denied.");
    }
    const code = req.query.code;
    console.log("oauth code" + code);
    const state = req.query.state;
    const username = state.split(";")[0];
    const originalUrl = state.split(";")[1];

    const oauth2Client = new google.auth.OAuth2(
        oauth2Key.client_id,
        oauth2Key.client_secret,
        oauth2Key.redirect_uris[0]
    );

    // let tokens = null;
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens) {
        return res.send("Authentication failed.");
    }
    const tokenStr = JSON.stringify(tokens);
    const tokenPath =
        "./services/google_slides_service/token/" + username + "/token.json";
    fs.writeFileSync(tokenPath, tokenStr);
    // res.redirect('http://localhost:3001/file/ExportGoogleSlides/f6fff586-f48d-413d-bdf4-45d601f50ba8');
    //return;
    //  res.send('Authentication successful! Please return to the previous page.');
    res.redirect(originalUrl);
});

module.exports = router;
