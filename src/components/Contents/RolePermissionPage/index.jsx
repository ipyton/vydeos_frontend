import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Button, TextField, Chip, Paper,
  List, ListItem, ListItemText, Snackbar, Alert, Card, CardContent,
  Divider, Grid, InputAdornment, CircularProgress
} from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import Qs from "qs";
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import PathIcon from '@mui/icons-material/SignpostOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { alpha } from '@mui/material/styles';
import { useNotification } from '../../../Providers/NotificationProvider';

const RolePermissionPage = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState("");
  const [roleId, setRoleId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    setLoading(true);
    axios({
      url: AccountUtil.getUrlBase() + "/account/getRole",
      method: 'get',
      headers: {
        "token": localStorage.getItem("token")
      },
      transformRequest: [function (data) {
        return Qs.stringify(data);
      }],
    })
      .then(res => {
        setRoles(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching roles:", error);
        showSnackbar("Failed to fetch roles", "error");
        setLoading(false);
      });
  };

  const handleAddRole = () => {
    if (!roleName.trim()) {
      showSnackbar("Role name cannot be empty", "error");
      return;
    }

    if (paths.length === 0) {
      showSnackbar("Role must have at least one path", "error");
      return;
    }

    setLoading(true);
    const newRoleId = roleId === -1 ? roles.length + 1 : roleId;
    
    axios({
      url: AccountUtil.getUrlBase() + "/account/upsertRole",
      method: 'post',
      data: {
        roleId: newRoleId,
        roleName: roleName,
        allowedPaths: paths,
      },
      transformRequest: [function (data) {
        return Qs.stringify(data);
      }],
      headers: {
        token: localStorage.getItem("token"),
      }
    })
      .then(res => {
        const existingRoleIndex = roles.findIndex(item => item.roleId === roleId);
        
        if (existingRoleIndex >= 0) {
          const updatedRoles = [...roles];
          updatedRoles[existingRoleIndex] = {
            ...updatedRoles[existingRoleIndex],
            roleName,
            allowedPaths: paths
          };
          setRoles(updatedRoles);
          showSnackbar("Role updated successfully", "success");
        } else {
          const newRole = {
            roleId: newRoleId,
            roleName: roleName,
            allowedPaths: paths,
          };
          setRoles([...roles, newRole]);
          showSnackbar("Role added successfully", "success");
        }
        
        resetForm();
        setLoading(false);
      })
      .catch(error => {
        console.error("Error saving role:", error);
        showSnackbar("Failed to save role", "error");
        setLoading(false);
      });
  };

  const handleRoleSelection = (role, index) => {
    setRoleName(role.roleName);
    setPaths(role.allowedPaths || []);
    setRoleId(role.roleId);
    setSelectedRoleIndex(index);
  };

  const handleDeleteRole = (event, role) => {
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete the role "${role.roleName}"?`)) {
      setLoading(true);
      
      axios({
        url: AccountUtil.getUrlBase() + "/account/deleteRole",
        method: 'post',
        data: {
          roleId: role.roleId
        },
        transformRequest: [function (data) {
          return Qs.stringify(data);
        }],
        headers: {
          token: localStorage.getItem("token"),
        }
      })
        .then(() => {
          setRoles(roles.filter(myrole => role.roleId !== myrole.roleId));
          
          if (role.roleId === roleId) {
            resetForm();
          }
          
          showSnackbar("Role deleted successfully", "success");
          setLoading(false);
        })
        .catch(error => {
          console.error("Error deleting role:", error);
          showSnackbar("Failed to delete role", "error");
          setLoading(false);
        });
    }
  };

  const addPath = () => {
    if (!newPath.trim()) {
      showSnackbar("Path cannot be empty", "error");
      return;
    }
    
    if (!paths.includes(newPath.trim())) {
      setPaths([...paths, newPath.trim()]);
      setNewPath("");
      showSnackbar("Path added", "success");
    } else {
      showSnackbar("Path already exists", "warning");
    }
  };

  const handleDeletePath = (pathToDelete) => {
    setPaths(paths.filter(path => path !== pathToDelete));
  };

  const resetForm = () => {
    setRoleName('');
    setPaths([]);
    setRoleId(-1);
    setSelectedRoleIndex(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPath();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: alpha('#3f51b5', 0.05), border: '1px solid', borderColor: alpha('#3f51b5', 0.2) }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Role Permission Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage roles and their access permissions to different paths in the application.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Role List */}
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Available Roles
              </Typography>
              
              {loading && roles.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : roles.length > 0 ? (
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                  {roles.map((role, index) => (
                    <React.Fragment key={role.roleId}>
                      <ListItem
                        button
                        selected={selectedRoleIndex === index}
                        onClick={() => handleRoleSelection(role, index)}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': { bgcolor: alpha('#3f51b5', 0.08) },
                          '&.Mui-selected': { bgcolor: alpha('#3f51b5', 0.12) },
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => handleDeleteRole(e, role)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha('#3f51b5', 0.8) }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {role.roleName}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                ID: {role.roleId}
                              </Typography>
                              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(role.allowedPaths || []).slice(0, 3).map((path, i) => (
                                  <Chip
                                    key={i}
                                    label={path}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                ))}
                                {(role.allowedPaths || []).length > 3 && (
                                  <Chip
                                    label={`+${role.allowedPaths.length - 3} more`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography>No roles found. Create a new role to get started.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Role Editor */}
        <Grid item xs={12} md={7}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <SaveIcon sx={{ mr: 1 }} />
                {roleId === -1 ? "Create New Role" : "Edit Role"}
              </Typography>

              <TextField
                label="Role Name"
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  const result = roles.find(item => item.roleName === e.target.value);
                  if (result) {
                    setRoleId(result.roleId);
                    setPaths(result.allowedPaths || []);
                    setSelectedRoleIndex(roles.findIndex(r => r.roleId === result.roleId));
                  } else if (roleId !== -1) {
                    // Only reset if we were editing an existing role
                    setRoleId(-1);
                    setPaths([]);
                    setSelectedRoleIndex(null);
                  }
                }}
                fullWidth
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <PathIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Allowed Paths
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    minHeight: '100px',
                    borderRadius: 1,
                    bgcolor: alpha('#f5f5f5', 0.6),
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  {paths.length > 0 ? (
                    paths.map((path, index) => (
                      <Chip
                        key={index}
                        label={path}
                        onDelete={() => handleDeletePath(path)}
                        color="primary"
                        variant="outlined"
                        sx={{ '& .MuiChip-deleteIcon': { color: 'inherit' } }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center', p: 2 }}>
                      No paths assigned. Add paths below.
                    </Typography>
                  )}
                </Paper>
              </Box>
              
              <Box sx={{ display: 'flex', mb: 3 }}>
                <TextField
                  label="Add New Path"
                  placeholder="e.g., /dashboard"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PathIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={addPath} 
                  sx={{ ml: 1, bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                  disabled={!newPath.trim()}
                >
                  <AddCircleIcon sx={{ mr: 0.5 }} />
                  Add
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleAddRole}
                  disabled={loading || !roleName.trim() || paths.length === 0}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ borderRadius: 1.5 }}
                >
                  {roleId === -1 ? "Create Role" : "Update Role"}
                </Button>
                
                {roleId !== -1 && (
                  <Button
                    variant="outlined"
                    onClick={resetForm}
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 1.5 }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for feedback messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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
    </Container>
  );
};

export default RolePermissionPage;