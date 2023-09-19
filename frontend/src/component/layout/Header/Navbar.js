import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import HomeIcon from "@material-ui/icons/Home";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { IconButton } from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { Link } from "react-router-dom";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import InfoIcon from "@material-ui/icons/Info";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Gavel from "@material-ui/icons/Gavel";
import ListAltIcon from "@material-ui/icons/ListAlt";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";
import RateReviewIcon from "@material-ui/icons/RateReview";
import People from "@material-ui/icons/People";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import ShopIcon from "@material-ui/icons/Shop";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  icons: {
    position: "fixed",
    top: "1%",
    right: "1%",
    zIndex: "1000",
    // backgroundColor: "black",
    color: "white",
  },

  menuIcon: {
    fontSize: "2.5rem",
    "&:hover": {
      color: "#8a2be2",
    },
  },
  listItem: {
    textDecoration: "none",
    color: "black",
  },
  spanStyle: {
    fontFamily: "Roboto",
  },
  heading: {
    fontSize: "3vmax",
  },
});

const Navbar = () => {
  const classes = useStyles();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const alert = useAlert();
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(logout());
    alert.success("Logout Successfully");
  };

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <h1 className={classes.heading}>Time Max</h1>
      <Divider />
      <List>
        <Link to="/" className={classes.listItem}>
          <ListItem button key="Home">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <span className={classes.spanStyle}>Home</span>
          </ListItem>
        </Link>

        <Link to="/products" className={classes.listItem}>
          <ListItem button key="Products">
            <ListItemIcon>
              <LocalMallIcon />
            </ListItemIcon>
            <span className={classes.spanStyle}>Products</span>
          </ListItem>
        </Link>

        <Link to="/auction/products" className={classes.listItem}>
          <ListItem button key="Auctions">
            <ListItemIcon>
              <Gavel />
            </ListItemIcon>
            <span className={classes.spanStyle}>Auctions</span>
          </ListItem>
        </Link>

        {isAuthenticated ? (
          <Link to="/account" className={classes.listItem}>
            <ListItem button key="Profile">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <span className={classes.spanStyle}>Profile</span>
            </ListItem>
          </Link>
        ) : (
          <Link to="/account" className={classes.listItem}>
            <ListItem button key="Login">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <span className={classes.spanStyle}>Login</span>
            </ListItem>
          </Link>
        )}

        <Link to="/search" className={classes.listItem}>
          <ListItem button key="Search">
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <span className={classes.spanStyle}>Search</span>
          </ListItem>
        </Link>
      </List>

      <Divider />
      <List>
        {isAuthenticated && user.role === "admin" && (
          <Link to="/admin/dashboard" className={classes.listItem}>
            <ListItem button key="Dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <span className={classes.spanStyle}>Dashboard</span>
            </ListItem>
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/orders" className={classes.listItem}>
            <ListItem button key="Orders">
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <span className={classes.spanStyle}>Orders</span>
            </ListItem>
          </Link>
        )}

        <Link to="/cart" className={classes.listItem}>
          <ListItem button key="Cart">
            <ListItemIcon>
              <AddShoppingCart />
            </ListItemIcon>
            <span className={classes.spanStyle}>
              {`Cart (${cartItems.length})`}{" "}
            </span>
          </ListItem>
        </Link>

        <Link to="/about" className={classes.listItem}>
          <ListItem button key="About">
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <span className={classes.spanStyle}>About</span>
          </ListItem>
        </Link>
        {isAuthenticated && (
          <ListItem
            button
            key="Logout"
            onClick={logoutUser}
            className={classes.listItem}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <span className={classes.spanStyle}>Logout</span>
          </ListItem>
        )}
      </List>

      <Divider />

      {isAuthenticated && user.role === "admin" && (
        <List>
          <Link to="/admin/orders" className={classes.listItem}>
            <ListItem button key="All Orders">
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <span className={classes.spanStyle}>All Orders</span>
            </ListItem>
          </Link>

          <Link to="/admin/reviews" className={classes.listItem}>
            <ListItem button key="All Reviews">
              <ListItemIcon>
                <RateReviewIcon />
              </ListItemIcon>
              <span className={classes.spanStyle}>All Reviews</span>
            </ListItem>
          </Link>

          <Link to="/admin/auction/products" className={classes.listItem}>
            <ListItem button key="All Auctions">
              <ListItemIcon>
                <Gavel />
              </ListItemIcon>
              <span className={classes.spanStyle}>All Auctions</span>
            </ListItem>
          </Link>

          <Link to="/admin/users" className={classes.listItem}>
            <ListItem button key="All Users">
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <span className={classes.spanStyle}>All Users</span>
            </ListItem>
          </Link>

          <Link to="/admin/products" className={classes.listItem}>
            <ListItem button key="All Products">
              <ListItemIcon>
                <ShopIcon />
              </ListItemIcon>
              <span className={classes.spanStyle}>All Products</span>
            </ListItem>
          </Link>
          <Link to="/admin/product" className={classes.listItem}>
            <ListItem button key="Create Product">
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <span className={classes.spanStyle}>Create Product</span>
            </ListItem>
          </Link>
        </List>
      )}
    </div>
  );
  return (
    <div className={classes.icons}>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)} aria-label="sidebar">
            <MenuOpenIcon className={classes.menuIcon} />
          </IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            className={classes.listItem}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Navbar;
