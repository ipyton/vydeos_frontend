import React, { useState } from "react";
import { Button, TextField, Grid, Typography, Box, Container, Alert } from "@mui/material";
import axios from "axios";
import { useNotification } from '../../../Providers/NotificationProvider';

const ResetPassword = () => {
    // State management
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (newPassword !== confirmPassword) {
            setError("not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");
        try {
            // Send POST request to reset password API
            const response = await axios.post("/api/reset-password", {
                oldPassword,
                newPassword,
            },
        {
            token: localStorage.getItem("token"),

        });

            if (response.status === 200) {
                setSuccess(true);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setError("密码重置失败，请稍后重试");
            }
        } catch (error) {
            setError("服务器错误，请稍后重试");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    重置密码
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ width: "100%", marginTop: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ width: "100%", marginTop: 2 }}>
                        密码重置成功！
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        label="旧密码"
                        type="password"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="新密码"
                        type="password"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="确认新密码"
                        type="password"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? "正在提交..." : "重置密码"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPassword;
