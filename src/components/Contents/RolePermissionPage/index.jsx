import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Button, TextField, Chip, Paper,
  List, ListItem, ListItemText, Snackbar, Alert, Card, CardContent,
  Divider, Grid, InputAdornment, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import Qs from "qs";
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import PathIcon from '@mui/icons-material/SignpostOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { alpha } from '@mui/material/styles';
import { useNotification } from '../../../Providers/NotificationProvider';
import {API_BASE_URL, DOWNLOAD_BASE_URL} from "../../../util/io_utils/URL.js";
import AuthUtil from '../../../util/io_utils/AuthUtil.js';
import { useThemeMode } from '../../../Themes/ThemeContext';

const RolePermissionPage = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [paths, setPaths] = useState([]);
  const [editPathIndex, setEditPathIndex] = useState(-1);
  const [editPathOpen, setEditPathOpen] = useState(false);
  const [newPath, setNewPath] = useState({
    name: "",
    route: "",
    type: "nav"
  });
  const [roleId, setRoleId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null);
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  const pathTypes = ["nav", "api", "resource", "admin"];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    setLoading(true);
    axios({
      url: API_BASE_URL + "/auth/getRole",
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
    
    // Convert paths to string format before sending
    
    axios({
      url: API_BASE_URL + "/auth/upsertRole",
      method: 'post',
      data: {
        roleId: newRoleId,
        roleName: roleName,
        allowedPaths: paths,
      },
      headers: {
        token: localStorage.getItem("token"),
        "Content-Type": "application/json"
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
    setRoleId(role.roleId);
    setSelectedRoleIndex(index);
    AuthUtil.getAllPathsByRoleId(role.roleId).then(res => {
      if (!res || !res.data || res.data.code !== 0) { 
        showNotification("error", "Failed to fetch paths");
        return 
      }
      try {
        // Parse each path string into JSON object
        const pathObjects = JSON.parse(res.data.message).map(path => {
          try {
            return typeof path === 'string' ? JSON.parse(path) : path;
          } catch (e) {
            return { name: "Unknown", route: path, type: "nav" };
          }
        });
        setPaths(pathObjects);
      } catch (e) {
        console.error("Error parsing paths:", e);
        showSnackbar("Error parsing paths", "error");
      }
    })
  };

  const handleDeleteRole = (event, role) => {
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete the role "${role.roleName}"?`)) {
      setLoading(true);
      
      axios({
        url: API_BASE_URL + "/account/deleteRole",
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
    if (!newPath.name.trim() || !newPath.route.trim()) {
      showSnackbar("Path name and route cannot be empty", "error");
      return;
    }
    
    const pathExists = paths.some(path => 
      path.route === newPath.route && path.type === newPath.type
    );
    
    if (!pathExists) {
      setPaths([...paths, { ...newPath }]);
      setNewPath({
        name: "",
        route: "",
        type: "nav"
      });
      showSnackbar("Path added", "success");
    } else {
      showSnackbar("This path already exists", "warning");
    }
  };

  const handleDeletePath = (pathToDelete) => {
    AuthUtil.deletePath(paths[pathToDelete], roleId).then(res => {
      if (!res || !res.data || res.data.code !== 0) { 
        showNotification("error", "Failed to delete path");
        return 
      }
      showSnackbar("Path deleted successfully", "success");
      setPaths(paths.filter((path, index) => index !== pathToDelete));
    })
  };

  const openEditPathDialog = (index) => {
    setEditPathIndex(index);
    setEditPathOpen(true);
  };

  const handleEditPath = () => {
    if (editPathIndex >= 0) {
      const updatedPaths = [...paths];
      updatedPaths[editPathIndex] = { ...newPath };
      setPaths(updatedPaths);
      closeEditPathDialog();
      showSnackbar("Path updated successfully", "success");
    }
  };

  const closeEditPathDialog = () => {
    setEditPathOpen(false);
    setEditPathIndex(-1);
    setNewPath({
      name: "",
      route: "",
      type: "nav"
    });
  };

  const resetForm = () => {
    setRoleName('');
    setPaths([]);
    setRoleId(-1);
    setSelectedRoleIndex(null);
    setNewPath({
      name: "",
      route: "",
      type: "nav"
    });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Get a display string for the path
  const formatPathForDisplay = (path) => {
    return `${path.name} (${path.route}) - ${path.type}`;
  };

  useEffect(() => {
    if (editPathIndex >= 0 && paths[editPathIndex]) {
      setNewPath({ ...paths[editPathIndex] });
    }
  }, [editPathIndex, editPathOpen]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: mode === 'dark' ? '#1e1e1e' : alpha('#3f51b5', 0.05), border: '1px solid', borderColor: alpha('#3f51b5', 0.2) }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Role Permission Management
        </Typography>
        <Typography variant="body1" sx={{ color: mode === 'dark' ? '#fff' : 'black' }}>
          Manage roles and their access permissions to different paths in the application.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Role List */}
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ borderRadius: 2, height: '100%', bgcolor: mode === 'dark' ? '#1e1e1e' : 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', color: mode === 'dark' ? '#fff' : 'black' }}>
                <PersonIcon sx={{ mr: 1, color: mode === 'dark' ? '#fff' : 'black' }} />
                Available Roles
              </Typography>
              
              {loading && roles.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : roles.length > 0 ? (
                <List sx={{ bgcolor: mode === 'dark' ? '#1e1e1e' : 'background.paper', borderRadius: 1 }}>
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
                          color: mode === 'dark' ? '#fff' : 'black'
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => handleDeleteRole(e, role)}
                            sx={{ color: mode === 'dark' ? '#fff' : 'black' }}
                          >
                            <DeleteIcon sx={{ color: mode === 'dark' ? '#fff' : 'black' }} />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha('#3f51b5', 0.8), color: mode === 'dark' ? '#fff' : 'black' }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium" sx={{ color: mode === 'dark' ? '#fff' : 'black' }}>
                              {role.roleName}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" sx={{ color: mode === 'dark' ? '#fff' : 'black' }}>
                                ID: {role.roleId}
                              </Typography>
                              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(role.allowedPaths || []).slice(0, 2).map((path, i) => {
                                  let pathObj;
                                  try {
                                    pathObj = typeof path === 'string' ? JSON.parse(path) : path;
                                    return (
                                      <Chip
                                        key={i}
                                        label={`${pathObj.name}: ${pathObj.route}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                      />
                                    );
                                  } catch (e) {
                                    return (
                                      <Chip
                                        key={i}
                                        label={String(path)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                      />
                                    );
                                  }
                                })}
                                {(role.allowedPaths || []).length > 2 && (
                                  <Chip
                                    label={`+${role.allowedPaths.length - 2} more`}
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
          <Card elevation={3} sx={{ borderRadius: 2, bgcolor: mode === 'dark' ? '#1e1e1e' : 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', color: mode === 'dark' ? '#fff' : 'black' }}>
                <SaveIcon sx={{ mr: 1, color: mode === 'dark' ? '#fff' : 'black' }} />
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
                    
                    AuthUtil.getAllPathsByRoleId(result.roleId).then(res => {
                      if (!res || !res.data || res.data.code !== 0) { 
                        showNotification("error", "Failed to fetch paths");
                        return 
                      }
                      try {
                        // Parse each path string into JSON object
                        const pathObjects = JSON.parse(res.data.message).map(path => {
                          try {
                            return typeof path === 'string' ? JSON.parse(path) : path;
                          } catch (e) {
                            return { name: "Unknown", route: path, type: "nav" };
                          }
                        });
                        setPaths(pathObjects);
                      } catch (e) {
                        console.error("Error parsing paths:", e);
                        showSnackbar("Error parsing paths", "error");
                      }
                    });
                    
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
                sx={{
                  input: {
                    color: mode === 'dark' ? '#fff' : 'black',
                  },
                  label: {
                    color: mode === 'dark' ? '#aaa' : 'black',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#2c2c2c' : '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#444' : '#bdbdbd',
                  },
                }}
              />
              
              {/* Path List */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: mode === 'dark' ? '#fff' : 'black' }}>
                  <PathIcon sx={{ mr: 1, fontSize: '1.2rem', color: mode === 'dark' ? '#fff' : 'black' }} />
                  Allowed Paths
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    minHeight: '100px',
                    maxHeight: '250px',
                    overflow: 'auto',
                    borderRadius: 1,
                    bgcolor: mode === 'dark' ? '#1e1e1e' : alpha('#f5f5f5', 0.6)
                  }}
                >
                  {paths.length > 0 ? (
                    <List dense>
                      {paths.map((path, index) => (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <Box>
                              <IconButton edge="end" aria-label="edit" onClick={() => openEditPathDialog(index)}>
                                <EditIcon sx={{ fontSize: '1.2rem', color: '#3f51b5' }} />
                              </IconButton>
                              <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePath(index)}>
                                <DeleteIcon sx={{ fontSize: '1.2rem', color: 'error.main' }} />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {path.name}
                                </Typography>
                                <Chip 
                                  label={path.type} 
                                  size="small" 
                                  color={path.type === 'admin' ? 'error' : path.type === 'api' ? 'info' : 'default'}
                                  sx={{ ml: 1, height: '20px' }}
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {path.route}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center', p: 2, color: mode === 'dark' ? '#fff' : 'black' }}>
                      No paths assigned. Add paths below.
                    </Typography>
                  )}
                </Paper>
              </Box>
              
              {/* Add New Path */}
              <Box sx={{ mb: 3, p: 2, border: '1px dashed', borderColor: alpha('#3f51b5', 0.3), borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ color: mode === 'dark' ? '#fff' : 'black' }}>Add New Path</Typography>
                
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Path Name"
                      placeholder="e.g., Posts"
                      value={newPath.name}
                      onChange={(e) => setNewPath({...newPath, name: e.target.value})}
                      fullWidth
                      size="small"
                      sx={{
                        input: {
                          color: mode === 'dark' ? '#fff' : 'black',
                        },
                        label: {
                          color: mode === 'dark' ? '#aaa' : 'black',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: mode === 'dark' ? '#2c2c2c' : '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: mode === 'dark' ? '#444' : '#bdbdbd',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Route"
                      placeholder="e.g., /posts"
                      value={newPath.route}
                      onChange={(e) => setNewPath({...newPath, route: e.target.value})}
                      fullWidth
                      size="small"
                      sx={{
                        input: {
                          color: mode === 'dark' ? '#fff' : 'black',
                        },
                        label: {
                          color: mode === 'dark' ? '#aaa' : 'black',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: mode === 'dark' ? '#2c2c2c' : '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: mode === 'dark' ? '#444' : '#bdbdbd',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
  <FormControl fullWidth size="small">
    <InputLabel sx={{ color: mode === 'dark' ? '#aaa' : 'black' }}>
      Type
    </InputLabel>
    <Select
      value={newPath.type}
      label="Type"
      onChange={(e) => setNewPath({ ...newPath, type: e.target.value })}
      sx={{
        color: mode === 'dark' ? '#fff' : 'black',
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: mode === 'dark' ? '#555' : '#ccc',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: mode === 'dark' ? '#888' : '#666',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: mode === 'dark' ? '#3f51b5' : '#3f51b5',
        },
        backgroundColor: mode === 'dark' ? '#1e1e1e' : 'white',
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
            color: mode === 'dark' ? '#fff' : 'black',
          },
        },
      }}
    >
      {pathTypes.map((type) => (
        <MenuItem key={type} value={type} sx={{ color: mode === 'dark' ? '#fff' : 'black' }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

<Grid item xs={4}>
  <Button
    variant="contained"
    fullWidth
    onClick={addPath}
    disabled={!newPath.name.trim() || !newPath.route.trim()}
    sx={{
      bgcolor: mode === 'dark' ? '#66bb6a' : '#4caf50',
      color: mode === 'dark' ? '#000' : '#fff',
      '&:hover': {
        bgcolor: mode === 'dark' ? '#43a047' : '#388e3c',
      },
      '&.Mui-disabled': {
        bgcolor: mode === 'dark' ? '#2e2e2e' : '#e0e0e0',
        color: mode === 'dark' ? '#888' : '#9e9e9e',
        opacity: 1, // remove MUI's default fading
      },
      borderRadius: 1.5,
      textTransform: 'none',
    }}
  >
    <AddCircleIcon
      sx={{
        mr: 0.5,
        color:
          !newPath.name.trim() || !newPath.route.trim()
            ? mode === 'dark' ? '#888' : '#9e9e9e'
            : mode === 'dark' ? '#000' : '#fff',
      }}
    />
    Add
  </Button>
</Grid>


                </Grid>
              </Box>
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
  <Button
    variant="contained"
    color="primary"
    fullWidth
    size="large"
    onClick={handleAddRole}
    disabled={loading || !roleName.trim() || paths.length === 0}
    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
    sx={{
      borderRadius: 1.5,
      bgcolor: mode === 'dark' ? '#4caf50' : '#4caf50', // primary green button
      color: mode === 'dark' ? '#fff' : '#fff', // text in white
      '&:hover': {
        bgcolor: mode === 'dark' ? '#388e3c' : '#388e3c', // darker shade on hover
      },
      '&.Mui-disabled': {
        bgcolor: mode === 'dark' ? '#2e2e2e' : '#e0e0e0', // faded background when disabled
        color: mode === 'dark' ? '#888' : '#9e9e9e', // faded text when disabled
      },
    }}
  >
    {roleId === -1 ? "Create Role" : "Update Role"}
  </Button>

  {roleId !== -1 && (
    <Button
      variant="outlined"
      onClick={resetForm}
      fullWidth
      size="large"
      sx={{
        borderRadius: 1.5,
        borderColor: mode === 'dark' ? '#ffffff' : '#000000', // matching border for cancel button
        color: mode === 'dark' ? '#fff' : '#000', // text color in dark/light mode
        '&:hover': {
          borderColor: mode === 'dark' ? '#888' : '#3f51b5', // border color on hover
          backgroundColor: mode === 'dark' ? '#333' : '#f0f0f0', // background color on hover
        },
      }}
    >
      Cancel
    </Button>
  )}
</Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Path Dialog */}
      <Dialog open={editPathOpen} onClose={closeEditPathDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Path</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Path Name"
                value={newPath.name}
                onChange={(e) => setNewPath({...newPath, name: e.target.value})}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Route"
                value={newPath.route}
                onChange={(e) => setNewPath({...newPath, route: e.target.value})}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel sx={{ color: mode === 'dark' ? '#aaa' : 'black' }}>Type</InputLabel>
                <Select
                  value={newPath.type}
                  label="Type"
                  onChange={(e) => setNewPath({...newPath, type: e.target.value})}
                  sx={{
                    input: {
                      color: mode === 'dark' ? '#fff' : 'black',
                    },
                  }}
                >
                  {pathTypes.map(type => (
                    <MenuItem key={type} value={type} sx={{ color: mode === 'dark' ? '#fff' : 'black' }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditPathDialog}>Cancel</Button>
          <Button 
            onClick={handleEditPath}
            variant="contained" 
            color="primary"
            disabled={!newPath.name.trim() || !newPath.route.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

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