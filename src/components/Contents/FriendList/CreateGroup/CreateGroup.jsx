import { useEffect } from "react"

export default function() {
    useEffect(()=>{
        
    }, [])
    
    return (<Dialog open={openDialog} onClose={() => { setOpenDialog(false) }}>
        <DialogTitle>Select Friends to Create Group</DialogTitle>
        <DialogContent>
            <List>
                {friends.map((friend) => (
                    <ListItem key={friend.id}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedFriends.includes(friend.id)}
                                    onChange={() => handleToggleFriend(friend.id)}
                                    name={friend.name}
                                    color="primary"
                                />
                            }
                            label={friend.name}
                        />
                    </ListItem>
                ))}
            </List>
        </DialogContent>


        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleCreateGroup} color="primary" variant="contained">
                Create Group
            </Button>
        </DialogActions>
    </Dialog>)
}