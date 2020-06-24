import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Drawer, Divider } from '@material-ui/core'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { CssBaseline, Avatar, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FaceIcon from '@material-ui/icons/Face';
import MenuIcon from '@material-ui/icons/Menu'
import MailIcon from '@material-ui/icons/Mail'
import * as React from 'react'
import app from '../app';
import clsx from 'clsx'

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  userBox: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end'
  },
  userInfo: {
    marginRight: '30px',
    textAlign: 'right'
  },
  userAvatar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

interface DrawerState {
  open: boolean
}

export default function CustomDrawer(props: React.ComponentProps<'div'>) {

  const b = app.getBundle().components.drawer
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}>
            <MenuIcon />
          </IconButton>
          <div className={classes.userBox}>
            <div className={classes.userInfo}>
              <Typography>Mario Rossi</Typography>
              <Typography variant="caption">{b.settings}</Typography>
            </div>
            <Avatar className={classes.userAvatar}>
              <FaceIcon />
            </Avatar>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, open ? classes.drawerOpen : classes.drawerClose)}
        classes={{ paper: clsx(open ? classes.drawerOpen : classes.drawerClose) }}>

        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* TODO: Insert here the action icon we want */}
          <ListItem button key="Send email">
            <ListItemIcon><MailIcon /></ListItemIcon>
            <ListItemText primary="Send email" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  )
}