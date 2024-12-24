import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControlLabel, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import Qs from "qs";
import AccountUtil from '../../../util/io_utils/AccountUtil';
import { json } from 'react-router-dom';
import Input from '@mui/material/Input';
const usersData = [
    // { id: 1, username: 'user1', email: 'user1@example.com', permissions: ['Home', 'Profile'] },
    // { id: 2, username: 'user2', email: 'user2@example.com', permissions: ['Dashboard', 'Settings'] },
    // { id: 3, username: 'user3', email: 'user3@example.com', permissions: ['Profile', 'Settings'] },
];

const allPermissions = ['Home', 'Dashboard', 'Settings', 'Profile', 'Admin'];
const ariaLabel = { 'aria-label': 'description' };

const UserManagementService = () => {
    const [users, setUsers] = useState(usersData);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [searchEmail, setSearchEmail] = useState(''); // Search input state
    const [debouncedSearchEmail, setDebouncedSearchEmail] = useState(''); // Debounced search value
    const [newroleid, setNewRoleId] = useState()

    // Apply debounce for search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchEmail(searchEmail);
            axios({
                url: AccountUtil.getUrlBase() + "/account/getAuthById?userEmail=" + searchEmail,
                method: 'get',
                transformRequest: [function (data) {
                    return Qs.stringify(data)
                }],
                headers: {
                    token: localStorage.getItem("token"),
                }
            }).then(res=> {
                if (res.data.code === -1) {
                    return 
                }
                console.log(res.data)
                const message = JSON.parse(res.data.message)
                setUsers([message])
                console.log(message)
            })
        }, 500); // 500ms delay before setting the debounced search value

        // Cleanup timeout on input change
        return () => clearTimeout(timer);
    }, [searchEmail]);

    // useEffect(()=> {
    //     axios({
    //         url: AccountUtil.getUrlBase() + "/account/deleteUser",
    //         method: 'post',
    //         data: {
    //             // roleId: role.roleId
    //         },
    //         transformRequest: [function (data) {
    //             return Qs.stringify(data)
    //         }],
    //         headers: {
    //             token: localStorage.getItem("token"),
    //         }
    //     })
    // }, [])

    // Filter users based on debounced search term
    // const filteredUsers = users.filter(user =>
    //     user.email.toLowerCase().includes(debouncedSearchEmail.toLowerCase())
    // );

    // Delete user
    const handleDeleteUser = () => {
        axios({
            url: AccountUtil.getUrlBase() + "/account/deleteUser",
            method: 'post',
            data: {
                userId: selectedUser.userId
            },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
            headers: {
                token: localStorage.getItem("token"),
            }
        }).then(res => {
            console.log(res)
            const updatedUsers = users.filter(user => user.id !== selectedUser.id);
            setUsers(updatedUsers);
            setOpenDeleteDialog(false);
            setSnackbarMessage(`User ${selectedUser.username} deleted successfully.`);
            setOpenSnackbar(true);        })

    };

    // Update user permissions
    const handleUpdatePermissions = () => {
        console.log(newroleid)
        axios({
            url: AccountUtil.getUrlBase() + "/account/changeRole",
            method: 'post',
            data: {
                roleId: newroleid,
                userId: selectedUser.userId
            },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
            headers: {
                token: localStorage.getItem("token"),
            }
        }).then(res => {
            console.log(res)
            //const updatedUsers = users.filter(user => user.id !== selectedUser.id);
            //setUsers(updatedUsers);
            //setOpenDeleteDialog(false);
            setSnackbarMessage(`User ${selectedUser.username} updated successfully.`);
            setOpenSnackbar(true);
        })
        setOpenPermissionDialog(false);
        // setSnackbarMessage(`Permissions for ${selectedUser.username} updated.`);
        // setOpenSnackbar(true);
    };

    // Handle permissions toggle

    // Open the delete dialog
    const openDeleteUserDialog = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    // Open the permission dialog
    const openPermissionDialogHandler = (user) => {
        setSelectedUser(user);
        // setSelectedPermissions(user.permissions);
        setOpenPermissionDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDeleteDialog(false);
        setOpenPermissionDialog(false);
    };

    return (
        <Container>
            <Box sx={{ marginBottom: 4 }}>
                <Typography variant="h4">User Management</Typography>
            </Box>

            {/* Search by Email */}
            <Box sx={{ marginBottom: 4 }}>
                <TextField
                    label="Search by Email"
                    variant="outlined"
                    fullWidth
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)} // Set the search value immediately
                />
            </Box>

            {/* User Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.userId}>
                                {/* //<TableCell>{user.userName}</TableCell> */}
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.roleid}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginRight: 1 }}
                                        onClick={() => openPermissionDialogHandler(user)}
                                    >
                                        Edit Roles
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => openDeleteUserDialog(user)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar for success message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Delete User Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete {selectedUser?.userId}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Permissions Dialog */}
            <Dialog open={openPermissionDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit Permissions for {selectedUser?.userId}</DialogTitle>
                <DialogContent>
                    <Input defaultValue={selectedUser?.roleid} value={newroleid} inputProps={ariaLabel} onChange={(event)=> {
                        setNewRoleId(event.target.value)
                        //console.log(event.target.value)
                    }} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdatePermissions} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagementService;
