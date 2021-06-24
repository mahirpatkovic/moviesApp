import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Button, Menu, MenuItem } from '@material-ui/core';

import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { NavLink } from 'react-router-dom';
import externalClasses from './style/NavigationBar.module.css';
import MenuDrawer from './MenuDrawer';
import PersonIcon from '@material-ui/icons/Person';

import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: 'fixed',
        zIndex: 1,
        width: '100%',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: '50%',
        width: '40%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    navigationLinks: {
        color: "black",
        backgroundColor: "white",
        textDecoration: "none",
    }
}));

function NavigationBar(props) {
    const classes = useStyles();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const dispatch = useDispatch();

    const isUserLoggedIn = useSelector(state => state.auth.isAuthenticated);
    const currentUser = useSelector(state => state.user.currentUser);

    const searchMovieHandler = (event) => {
        props.onSearchMovie(event.target.value);
    }

    const openDrawerHandler = () => {
        setIsDrawerOpen(true);
    }

    const closeDrawerHandler = () => {
        setIsDrawerOpen(false);
    }

    const openMenuHandler = (event) => {
        setOpenMenu(event.currentTarget);
    };

    const closeMenuHandler = () => {
        setOpenMenu(null);
    };

    const logoutHandler = () => {
        localStorage.removeItem('_currentUser');
        dispatch(authActions.logout());
        window.location.reload();
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {window.innerWidth < 1025 && <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={openDrawerHandler}
                    >
                        <MenuIcon />
                    </IconButton>}
                    <Typography className={classes.title} variant="h6" noWrap>
                        Movies WebApp
                    </Typography>
                    {window.innerWidth > 1025 && <nav className={externalClasses.nav}>
                        <ul>
                            <li>
                                <NavLink to='/' activeClassName={externalClasses.active}>
                                    HOME
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to='/about' activeClassName={externalClasses.active}>
                                    ABOUT
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/most-watched" activeClassName={externalClasses.active}>
                                    MOST_WATCHED
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/top-rated" activeClassName={externalClasses.active}>
                                    TOP_RATED
                                </NavLink>
                            </li>
                            {isUserLoggedIn && <li>
                                <NavLink to='/favourites' activeClassName={externalClasses.active}>
                                    FAVOURITES
                                </NavLink>
                            </li>}
                        </ul>
                    </nav>}

                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={searchMovieHandler}
                        />
                    </div>
                    {isUserLoggedIn && <div>
                        <Button aria-controls="simple-menu" aria-haspopup="true" variant="contained" onClick={openMenuHandler} >
                            {currentUser.username}
                            <PersonIcon />
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={openMenu}
                            keepMounted
                            open={Boolean(openMenu)}
                            onClose={closeMenuHandler}
                        >
                            <MenuItem onClick={closeMenuHandler}>My Profile</MenuItem>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </Menu>
                    </div>}
                    {!isUserLoggedIn && <div>
                        <NavLink to='/login' style={{ textDecoration: 'none' }}>
                            <Button variant="contained" >LogIn</Button>
                        </NavLink>
                        <NavLink to='/signup' style={{ textDecoration: 'none' }}>
                            <Button variant="contained">SignUp</Button>
                        </NavLink>
                    </div>}
                </Toolbar>
            </AppBar>
            <MenuDrawer
                visible={isDrawerOpen}
                onClose={closeDrawerHandler}
            />
        </div>
    );
}
export default NavigationBar;
