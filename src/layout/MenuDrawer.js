import React from 'react';
import { Drawer, List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarIcon from '@material-ui/icons/Star';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { NavLink } from 'react-router-dom';

function MenuDrawer(props) {

  const list = () => (
    <div
      role="presentation"
    >
      <h3>Movies WebApp</h3>
      <Divider/>
      <List onClick={props.onClose}>
        <ListItem button key="1">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <NavLink to='/' style={{textDecoration: "none", color: "#3f50b5"}}>
            <ListItemText primary="HOME" />
          </NavLink>
        </ListItem>
        <ListItem button key="2">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <NavLink to='/about' style={{textDecoration: "none", color: "#3f50b5"}}>
            <ListItemText primary="ABOUT" />
          </NavLink>
        </ListItem>
        <ListItem button key="3">
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <NavLink to='/most-watched' style={{textDecoration: "none", color: "#3f50b5"}}>
            <ListItemText primary="MOST WATCHED" />
          </NavLink>
        </ListItem>
        <ListItem button key="4">
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <NavLink to='/top-rated' style={{textDecoration: "none", color: "#3f50b5"}}>
            <ListItemText primary="TOP RATED" />
          </NavLink>
        </ListItem>
        <ListItem button key="5">
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <NavLink to='/favourites' style={{textDecoration: "none", color: "#3f50b5"}}>
            <ListItemText primary="FAVOURITES" />
          </NavLink>
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      <Drawer anchor="left" open={props.visible} onClose={props.onClose}>
        {list()}
      </Drawer>
    </div>
  );
}
export default MenuDrawer;