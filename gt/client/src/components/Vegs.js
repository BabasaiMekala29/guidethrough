import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { Container } from '@mui/material';

export default function NestedList() {
    const categories = {
        travel: ['Solo Travel', 'Family Travel','Backpacking'],
        food: ['Cooking','Quick recepies','Vegetarian'],
        // "healthy living": ['Nutrition','Fitness','Stress Management'],
        technology: ['Robotics','Quantum Computing','Cloud Computing'],
        education: ['IT','Civil','Mechanical','Electronics','Medical','Masters']
    }
    const catKeys = Object.keys(categories);
  const [openStates, setOpenStates] = React.useState({
    travel: false,
    food: false,
    technology: false,
    education: false,
    // "healthy living": false
  });

  const handleClick = (item) => {
    setOpenStates({
      ...openStates,
      [item]: !openStates[item],
    });
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
    >
      {/* <ListItemButton onClick={() => handleClick('fruits')}>
        <ListItemIcon>
          <StarBorder />
        </ListItemIcon>
        <ListItemText primary="Fruits" />
        {openStates.fruits ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>  */}
      {
        catKeys.map(catName =>(
            <Container>
            <ListItemButton onClick={() => handleClick(catName)}>
                <ListItemIcon>
                    <StarBorder />
                </ListItemIcon>
                <ListItemText primary={catName} />

                {openStates.catName ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStates.catName} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary={categories[catName][0]} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary={categories[catName][1]} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary={categories[catName][2]} />
              </ListItemButton>
            </List>
          </Collapse>
          </Container>
        ))
      }
      {/*  */}
      {/* <Collapse in={openStates.catName} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary={categories.catName[0]} />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary={categories.catName[1]} />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary={categories.catName[2]} />
          </ListItemButton>
        </List>
      </Collapse> */}
      {/* 
      <ListItemButton onClick={() => handleClick('vegetables')}>
        <ListItemIcon>
          <StarBorder />
        </ListItemIcon>
        <ListItemText primary="Vegetables" />
        {openStates.vegetables ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openStates.vegetables} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Carrot" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Tomato" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Broccoli" />
          </ListItemButton>
        </List>
      </Collapse> */}
    </List>
  );
}
