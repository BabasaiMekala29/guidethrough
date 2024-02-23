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
import { Container, Typography } from '@mui/material';
import Masonry from 'react-masonry-css';

export default function NestedList() {
  const categories = {
    Travel: ['Solo Travel', 'Family Travel', 'Backpacking'],
    Food: ['Cooking', 'Quick recipes', 'Vegetarian','food preservation','kitchen hacks','meal prep'],
    Technology: ['Robotics', 'Quantum Computing', 'Cloud Computing'],
    Education: ['IT', 'Civil', 'Mechanical', 'Electronics', 'Medical', 'Masters'],
    Parenting: ['Child care', 'Teen parenting', 'Single parenting'],
    "Home & Gardening": ['Vegetable', 'Herbs','Kitchen Gardening', 'Roof Gardening', 'Succulents','Home Decor','Sustainable living'],
    "Healthy living": ['Nutrition & Diet', 'Fitness', 'Stress Management'],
    "Pet care": ['training & behaviour', 'Health & nutrition', 'Grooming tips'],
    "Competitive exams": ['SAT','ACT','GRE','GMAT','LSAT','ILETS','TOEFL','GATE','UPSC','Banking','JEE'],
    Finance: ['money management','Stock investment','retirement planning','Tax Strategies','passive income streams','crypto currency','Risk management'],
    Learning: ['language learning','Math & Science','Home schooling','Communication'],
    Fashion: ['trends & styles','design & seiving','Personal styling','Sustainable fashion','Wardrobe curation'],
    Business: ['startup','sales techniques','digital marketing','branding tactics','small business','Freelancing'],
    "Addiction Recovery": ['Abuse treatment','Alcoholism recovery','Drug addiction','Behaviourial Addiction','Coping Addiction','After care'],
    Health: ['Mental health','Male health','Female health'],
    Literature: ['Poetry','Prose','Fiction'],
    Law: ['Criminal law','Business law','Civil law','Property & Employement','Environmental laws']
    

  };
  const iconArr = [<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,
  <StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />,<StarBorder />]
  const catKeys = Object.keys(categories);
 
  const [openStates, setOpenStates] = React.useState({
    Travel: false,
    Food: false,
    Technology: false,
    Education: false,
    Parenting: false,
    Law: false,
    Literature: false,
    Health: false,
    Business: false,
    Learning: false,
    Finance: false,
    Fashion: false,
    "Addiction Recovery": false,
    "Home & Gardening": false,
    "Competitive exams": false,
    "Pet care": false,
    "Healthy living": false

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
      sx={{ width: '100%'}}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <Typography variant='h5' component="div" id="nested-list-subheader" sx={{paddingTop:'12px',paddingBottom:'12px;'}}>
          Categories
        </Typography>
      }
    >
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {catKeys.map((catName,index) => (
          <Container key={catName}>
            <ListItemButton onClick={() => handleClick(catName)}>
              <ListItemIcon>
                {iconArr[index]}
              </ListItemIcon>
              <ListItemText primary={catName} />
              {openStates[catName] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStates[catName]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categories[catName].map((item, index) => (
                  <ListItemButton href={`/category/${catName}/${item}`} key={index} sx={{ pl: 4 }}>
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
