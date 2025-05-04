import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert, Card, CardContent,
  Avatar, IconButton, Tooltip, CircularProgress, Chip, MenuItem, Select, FormControl, InputLabel,
  Grid, Divider, InputAdornment, Fade
} from '@mui/material';
import axios from 'axios';
import Qs from "qs";
import AccountUtil from '../../../util/io_utils/AccountUtil';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { alpha } from '@mui/material/styles';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { useNotification } from '../../../Providers/NotificationProvider';

const UserManagementService = () => {
  const [users, setUsers] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchEmail, setSearchEmail] = useState('');
  const [newRoleId, setNewRoleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const { showNotification } = useNotification();

  // Fetch available roles on component mount
  useEffect(() => {
    fetchAvailableRoles();
  }, []);

  const fetchAvailableRoles = () => {
    axios({
      url: URL.API_BASE_URL + "/auth/getRole",
      method: 'get',
      headers: {
        "token": localStorage.getItem("token")
      },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
    }).then(res => {
      if (Array.isArray(res.data)) {
        setAvailableRoles(res.data);
      } else {
        console.error("Invalid role data format");
        showSnackbar("Failed to fetch roles", "error");
      }
    }).catch(error => {
      console.error("Error fetching roles:", error);
      showSnackbar("Failed to fetch roles", "error");
    });
  };

  // Apply debounce for search input
  useEffect(() => {
    if (!searchEmail.trim()) {
      setUsers([]);
      setSearching(false);
      setSearchError(false);
      return;
    }

    const timer = setTimeout(() => {
      searchUser(searchEmail);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchEmail]);

  const searchUser = (email) => {
    setSearching(true);
    setSearchError(false);
    
    axios({
      url: URL.API_BASE_URL + "/account/getAuthById",
      method: 'get',
      params: {
        userEmail: email
      },
      headers: {
        token: localStorage.getItem("token"),
      }
    }).then(res => {
      setSearching(false);
      
      if (res.data.code === -1) {
        setUsers([]);
        setSearchError(true);
        showSnackbar("User not found", "warning");
        return;
      }
      
      try {
        const userData = JSON.parse(res.data.message);
        setUsers([userData]);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUsers([]);
        setSearchError(true);
        showSnackbar("Error retrieving user data", "error");
      }
    }).catch(error => {
      setSearching(false);
      setSearchError(true);
      setUsers([]);
      console.error("Error searching user:", error);
      showSnackbar("Error searching for user", "error");
    });
  };

  const handleDeleteUser = () => {
    setLoading(true);
    
    axios({
      url: URL.API_BASE_URL + "/account/deleteUser",
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
      setLoading(false);
      
      if (res.data.code === 0) {
        setUsers([]);
        setOpenDeleteDialog(false);
        showSnackbar(`User ${selectedUser.userId} deleted successfully`, "success");
      } else {
        showSnackbar("Failed to delete user", "error");
      }
    }).catch(error => {
      setLoading(false);
      console.error("Error deleting user:", error);
      showSnackbar("Error deleting user", "error");
    });
  };

  const handleUpdatePermissions = () => {
    if (!newRoleId) {
      showSnackbar("Please select a role", "warning");
      return;
    }
    
    setLoading(true);
    
    axios({
      url: URL.API_BASE_URL + "/account/changeRole",
      method: 'post',
      data: {
        roleId: newRoleId,
        userId: selectedUser.userId
      },
      transformRequest: [function (data) {
        return Qs.stringify(data)
      }],
      headers: {
        token: localStorage.getItem("token"),
      }
    }).then(res => {
      setLoading(false);
      
      if (res.data.code === 0) {
        // Update the user in the list
        const updatedUsers = users.map(user => {
          if (user.userId === selectedUser.userId) {
            return { ...user, roleid: newRoleId };
          }
          return user;
        });
        
        setUsers(updatedUsers);
        setOpenPermissionDialog(false);
        showSnackbar(`Role updated successfully for ${selectedUser.userId}`, "success");
      } else {
        showSnackbar("Failed to update user role", "error");
      }
    }).catch(error => {
      setLoading(false);
      console.error("Error updating user role:", error);
      showSnackbar("Error updating user role", "error");
    });
  };

  const openDeleteUserDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const openPermissionDialogHandler = (user) => {
    setSelectedUser(user);
    setNewRoleId(user.roleid);
    setOpenPermissionDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setOpenPermissionDialog(false);
    setLoading(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const getAvatarColor = (userId) => {
    const colors = ['#3f51b5', '#f50057', '#00897b', '#ff9800', '#8e24aa', '#e91e63'];
    const index = userId.toString().charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getRoleName = (roleId) => {
    const role = availableRoles.find(r => r.roleId.toString() === roleId?.toString());
    return role ? role.roleName : 'Unknown Role';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: alpha('#3f51b5', 0.05), border: '1px solid', borderColor: alpha('#3f51b5', 0.2) }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 32 }} />
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search for users by email and manage their roles and permissions.
        </Typography>
      </Paper>

      <Card elevation={3} sx={{ borderRadius: 2, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ mr: 1 }} />
            Find User
          </Typography>
          
          <TextField
            label="Search by Email"
            variant="outlined"
            fullWidth
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searching ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null
            }}
            placeholder="Enter user email address..."
            error={searchError}
            helperText={searchError ? "User not found or error occurred" : ""}
            sx={{ mb: 1 }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter the complete email address of the user you want to manage.
          </Typography>
        </CardContent>
      </Card>

      <Fade in={users.length > 0}>
        <Card elevation={3} sx={{ borderRadius: 2, mb: 4, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: alpha('#3f51b5', 0.8), color: 'white', p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              User Details
            </Typography>
          </Box>
          
          {users.map(user => (
            <Box key={user.userId} sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      bgcolor: getAvatarColor(user.userId),
                      fontSize: '1.5rem'
                    }}
                  >
                    {user.userId.toString().charAt(0).toUpperCase()}
                  </Avatar>
                </Grid>
                
                <Grid item xs>
                  <Typography variant="h6" component="div">
                    User ID: {user.userId}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <VpnKeyIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                    <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                      Current Role:
                    </Typography>
                    <Chip 
                      label={getRoleName(user.roleid)} 
                      color="primary" 
                      variant="outlined" 
                      size="small"
                    />
                  </Box>
                </Grid>
                
                <Grid item>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Role">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => openPermissionDialogHandler(user)}
                        sx={{ borderRadius: 2 }}
                      >
                        Edit Role
                      </Button>
                    </Tooltip>
                    
                    <Tooltip title="Delete User">
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => openDeleteUserDialog(user)}
                        sx={{ borderRadius: 2 }}
                      >
                        Delete
                      </Button>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Role Permissions
                </Typography>
                
                {availableRoles.find(r => r.roleId.toString() === user.roleid?.toString())?.allowedPaths?.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availableRoles
                      .find(r => r.roleId.toString() === user.roleid?.toString())
                      ?.allowedPaths
                      ?.map((path, index) => (
                        <Chip
                          key={index}
                          label={path}
                          size="small"
                          variant="filled"
                          sx={{ 
                            bgcolor: alpha('#3f51b5', 0.1),
                            color: '#3f51b5',
                            '&:hover': { bgcolor: alpha('#3f51b5', 0.2) }
                          }}
                        />
                      ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No permissions found for this role
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Card>
      </Fade>

      {users.length === 0 && !searching && searchEmail.trim() !== '' && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            bgcolor: alpha('#f5f5f5', 0.6), 
            textAlign: 'center',
            border: '1px dashed',
            borderColor: alpha('#000', 0.1)
          }}
        >
          <NoAccountsIcon sx={{ fontSize: 60, color: alpha('#000', 0.2), mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No user found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try a different email address or check for typos
          </Typography>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete User Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#f44336', color: 'white' }}>
          Delete User
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3, minWidth: 400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#f44336', mr: 2 }}>
              <DeleteIcon />
            </Avatar>
            <Typography variant="h6">
              Confirm Deletion
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the user with ID <strong>{selectedUser?.userId}</strong>?
          </Typography>
          <Typography variant="body2" color="error">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser} 
            variant="contained" 
            color="error"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Permissions Dialog */}
      <Dialog 
        open={openPermissionDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#3f51b5', color: 'white' }}>
          Edit User Role
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3, minWidth: 400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: '#3f51b5', mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="subtitle1">
              User ID: <strong>{selectedUser?.userId}</strong>
            </Typography>
          </Box>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="role-select-label">Assign Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={newRoleId}
              label="Assign Role"
              onChange={(e) => setNewRoleId(e.target.value)}
            >
              {availableRoles.map((role) => (
                <MenuItem key={role.roleId} value={role.roleId}>
                  {role.roleName} (ID: {role.roleId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {newRoleId && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Role Permissions:
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha('#f5f5f5', 0.5) }}>
                {availableRoles.find(r => r.roleId.toString() === newRoleId?.toString())?.allowedPaths?.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availableRoles
                      .find(r => r.roleId.toString() === newRoleId?.toString())
                      ?.allowedPaths
                      ?.map((path, index) => (
                        <Chip
                          key={index}
                          label={path}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No permissions defined for this role
                  </Typography>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdatePermissions} 
            variant="contained" 
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
            disabled={loading || !newRoleId}
            sx={{ borderRadius: 2 }}
          >
            {loading ? "Updating..." : "Update Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagementService;