
import React, { useEffect, useState } from 'react';
import {
    Container, Box, Typography, Button, TextField, Select, MenuItem, Checkbox, FormControlLabel, FormGroup,
    List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import Qs from "qs"
import axios from 'axios';
import Divider from '@mui/material/Divider';

const paths = ['Home', 'Dashboard', 'Settings', 'Profile', 'Admin'];

const RolePermissionPage = () => {
    const [roles, setRoles] = useState([
        { id: 1, name: 'Admin', permissions: ['Home', 'Dashboard', 'Settings'] },
        { id: 2, name: 'Editor', permissions: ['Home', 'Profile'] },
    ]);
    const [roleName, setRoleName] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [paths, setPaths] = useState([])
    const [newPath, setNewPath] = useState("")
    const [roleId,setRoleId] = useState(-1)
    useEffect(() => {
        axios({
            url: AccountUtil.getUrlBase() + "/account/getRole",
            method: 'get',
            headers: {
                "token": localStorage.getItem("token")
            },
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
            }],

        }).then(res => {
            setRoles(res.data)
            console.log(res.data)
        }
        )
    }, [])



    const handleAddRole = () => {
        if (!roleName) return;
        console.log(roles.length)
        const newRole = {
            roleId: roleId == -1 ? roles.length + 1: roleId ,
            roleName: roleName,
            allowedPaths: paths,
        };

        axios({
            url: AccountUtil.getUrlBase() + "/account/upsertRole",
            method: 'post',
            data: {
                roleId: roleId == -1 ? roles.length + 1 : roleId,
                roleName: roleName,
                allowedPaths: paths, },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
            headers: {
                token: localStorage.getItem("token"),
            }
        }).then(res => {
            console.log(res)
            const result = roles.find(item => item.roleId === roleId);
            if (result) {
                result.allowedPaths = paths
                setRoles([...roles]);

            } else {
                setRoles([...roles, newRole]);
            }
            setRoleName('');
            setSnackbarMessage('Role added successfully');
            setOpenSnackbar(true);
        })


    };

    // Update role permissions


    const handleRoleSelection = (role) => {
        setRoleName(role.roleName);
        setPaths(role.allowedPaths);
        setRoleId(role.roleId)
    };

    const handleDeleteRole = (role) => {
        axios({
            url: AccountUtil.getUrlBase() + "/account/deleteRole",
            method: 'post',
            data: {
                roleId: role.roleId
            },
            transformRequest: [function (data) {
                return Qs.stringify(data)
            }],
            headers: {
                token: localStorage.getItem("token"),
            }
        }).then(res => {
            console.log(res)
            setRoles(roles.filter(myrole => role.roleId !== myrole.roleId));
        })
    }
    console.log(roleId)



    const addPath = (event) => {
        // 检查 paths 中是否已包含 newPath
        if (!paths.includes(newPath) && newPath.trim() !== "") {
            setPaths([...paths, newPath]);
        }
        setNewPath("");  // 重置 newPath
    };

    return (
        <Container>
            <Box sx={{ marginBottom: 4 }}>
                <Typography variant="h4">Role Permission Management</Typography>
            </Box>

            {/* Role List */}
            <Box sx={{ marginBottom: 4 }}>
                <Typography variant="h6">Roles</Typography>
                <List>
                    {roles.map((role) => (
                                                    <ListItem
                            onClick={() => handleRoleSelection(role)}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" key={role.id} onClick={() => handleDeleteRole(role)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                primary={role.roleName}
                                secondary={"ID:" + role.roleId}
                                />
                                <Divider></Divider>
                            </ListItem>

                    ))}
                </List>

                {/* Add Role */}
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Upsert Role</Typography>
                    <TextField
                        label="Role Name"
                        value={roleName}
                        onChange={(e) => {
                            setRoleName(e.target.value)
                            const result = roles.find(item => item.roleName === e.target.value);
                            if (result) {
                                setRoleId(result.roleId)
                                setPaths(result.allowedPaths);
                            } else {
                                setRoleId(-1)
                                setPaths([]);
                            }
                        }}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <FormGroup>
                        {paths.map((path) => (
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => {
                                        setPaths(paths.filter(mypath => path !== mypath));
                                        setNewPath("");  // 重置 newPath
                                    }
                                    }>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={path}
                                // secondary={secondary ? 'Secondary text' : null}
                                />
                                <Divider></Divider>
                            </ListItem>
                        ))}
                    </FormGroup>
                    <TextField
                        label="Path"
                        value={newPath}
                        onChange={(e) => setNewPath(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" onClick={handleAddRole} sx={{ marginTop: 2 }}>
                        Upsert Role
                    </Button>
                    <Button variant="contained" onClick={addPath} sx={{ marginTop: 2, marginLeft: 2 }} color="primary">
                        Add Path
                    </Button>
                </Box>
            </Box>


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
        </Container>
    );
};

export default RolePermissionPage;
