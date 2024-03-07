export function MessageBox() {
    return (    
    <Menu
        PaperProps={{  
          style: {  
            width: 350,  
          },  
       }} 
        anchorEl={notificationsAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={notificationsOpen}
        onClose={handleNotificationClose}
        
       >
            <MenuItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText 
              primary="Sam Smith"
              secondary={
                <React.Fragment>
                  {" — I'll be in your neighborhood doing"}
                </React.Fragment>
              }>Name</ListItemText>
            </MenuItem>
            
           
      </Menu>)
}