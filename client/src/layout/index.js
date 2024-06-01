import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../constant";
import { setSocketConnection } from "../redux/userSlice";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import SearchIcon from "@mui/icons-material/Search";
import {
  TextField,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import GroupIcon from "@mui/icons-material/Group";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const User = ({ user }) => (
  <div className="user-item">
    <img src={user?.profileImage} className="thumbnail" />
    <p
      style={{
        color: "#34495E",
        fontFamily: "sans-serif",
        left: "10px",
        position: "relative",
      }}
    >
      {user.username}
    </p>
  </div>
);

const AuthLayouts = ({ children }) => {
  const navigate = useNavigate();
  const [uid, setUid] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleMenuOpen2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleMenuClose2 = () => {
    setAnchorEl2(null);
  };

  const handleProfileClick = () => {
    navigate(`/my-profile/${uid}`);
    handleMenuClose2();
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: "Do you want logout ?",
      showDenyButton: true,

      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        handleMenuClose2();
      } else if (result.isDenied) {
        console.log("logout denied");
        handleMenuClose2();
      }
    });
  };

  const searchUser = async () => {
    if (!query) {
      setSearchResult([]);
      return;
    }
    setLoading(true);
    try {
      let response = await axios.get(
        `${BASE_URL}/api/v1/user/search?username=${query}`
      );
      setSearchResult(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSearchResult([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    searchUser();
  }, [query]);

  useEffect(() => {
    const fetchNotifications = async () => {
      let user = JSON.parse(localStorage.getItem("userInfo"));
      let noti = await axios.get(
        `${BASE_URL}/api/v1/user/notifications/${user?.id}`
      );
      setNotifications(noti?.data);
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("notification", (notification) => {
      console.log(
        "nofitication-----------",
        notification ? notification : "no notification"
      );
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const fetchUser = () => {
      let user = JSON.parse(localStorage.getItem("userInfo"));
      if (user) {
        setUid(user?.id);
        setUserInfo(user);
      }
    };
    fetchUser();
  }, []);
  return (
    <>
      <nav className="navbar" style={{ backgroundColor: "white" }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">
            <img src={logo} style={{ height: "auto", width: "120px" }} />
          </a>
          <form className="d-flex mx-auto position-relative" role="search">
            <TextField
              sx={{ width: 500 }}
              variant="outlined"
              size="small"
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <div
              className={`${query?.trim() !== "" ? "search-results p-2" : ""}`}
            >
              {loading ? (
                <p>Loading...</p>
              ) : searchResult.length > 0 ? (
                searchResult.map((user) => (
                  <a href={`/user/${user?._id}`}>
                    <User key={user._id} user={user} />
                  </a>
                ))
              ) : (
                query?.trim() !== "" && <p>No matched users</p>
              )}
            </div>
          </form>
          <div className="d-flex">
            <div className="mx-3">
              <a href={`/all-users/${uid}`}>
                <GroupIcon />
              </a>
            </div>
            <div className="mx-3" style={{ top: "-5px", position: "relative" }}>
              <IconButton onClick={handleNotificationClick}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleNotificationClose}
              >
                {notifications.length === 0 ? (
                  <MenuItem>
                    <ListItemText primary="No new notifications" />
                  </MenuItem>
                ) : (
                  notifications.map((notification, index) => (
                    <MenuItem key={index}>
                      <ListItemText primary={notification.message} />
                    </MenuItem>
                  ))
                )}
              </Menu>
            </div>
            <div className="mx-3">
              <a href="/chat">
                <MarkChatUnreadIcon />
              </a>
            </div>
            <div className="mx-3">
              <AccountCircleIcon
                onClick={handleMenuOpen2}
                style={{ cursor: "pointer" }}
              />
              <Menu
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleMenuClose2}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
};

export default AuthLayouts;
