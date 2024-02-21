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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Container } from '@mui/material';
import Masonry from 'react-masonry-css';

export default function NestedList() {
  const categories = {
    travel: ['Solo Travel', 'Family Travel', 'Backpacking'],
    food: ['Cooking', 'Quick recipes', 'Vegetarian'],
    technology: ['Robotics', 'Quantum Computing', 'Cloud Computing'],
    education: ['IT', 'Civil', 'Mechanical', 'Electronics', 'Medical', 'Masters']
  };

  const catKeys = Object.keys(categories);
  const [openStates, setOpenStates] = React.useState({
    travel: false,
    food: false,
    technology: false,
    education: false,
  });

  const handleClick = (item) => {
    setOpenStates({
      ...openStates,
      [item]: !openStates[item],
    });
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Categories
        </ListSubheader>
      }
    >
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {catKeys.map(catName => (
          <Container key={catName}>
            <ListItemButton onClick={() => handleClick(catName)}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary={catName} />
              {openStates[catName] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStates[catName]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categories[catName].map((item, index) => (
                  <ListItemButton key={index} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ArrowForwardIosIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Container>
        ))}
      </Masonry>
    </List>
  );
}
