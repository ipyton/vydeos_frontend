
import  React, {useState} from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';



import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,

} from '@dnd-kit/sortable';


import ListItem from './ListItem';
import Item from '../Item';
  
export default function Settings(props) {
  const [settings, setSettings]=React.useState([])

  // return (
  //   <Box display="flex" justifyContent="center">
  //       <List sx={{ width: '100%', bgcolor: 'background.paper'}} >
  //     <ListItem>
  //       <ListItemAvatar>
  //         <Avatar>
  //           <ImageIcon />
  //         </Avatar>
  //       </ListItemAvatar>
  //       <ListItemText primary="Photos" />
  //       <FormControlLabel
  //       control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
  //       />
  //     </ListItem>
  //     <Divider variant="inset" component="li" />
  //     <ListItem>
  //       <ListItemAvatar>
  //         <Avatar>
  //           <WorkIcon />
  //         </Avatar>
  //       </ListItemAvatar>
  //       <ListItemText primary="Work" />
  //       <FormControlLabel
  //       control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
  //       />
  //     </ListItem>
  //     <Divider variant="inset" component="li" />
  //     <ListItem>
  //       <ListItemAvatar>
  //         <Avatar>
  //           <BeachAccessIcon />   
  //         </Avatar>
  //       </ListItemAvatar>
  //       <ListItemText primary="Vacation" />
  //       <FormControlLabel
  //       control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
  //       />
  //     </ListItem>
  //   </List>
  //   </Box>
    
  // );
  const [items, setItems] = useState([1, 2, 3]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  let handleSave= (event)=> {
    console.log(items)
  }

  return (
    <div sx={{top:"1%"}}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map(id => <ListItem key={id} id={id} name={id +"uigafdiub"} picture ={"pictures"}/>)}
        </SortableContext>
      </DndContext>

      <Button variant="contained" onClick={handleSave} sx={{left:"50%"}}>Save</Button>



    </div>

  );
  
  function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}