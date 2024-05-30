import React, { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, IconButton } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../constant";
import GroupIcon from "@mui/icons-material/Group";

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

function Header({ uid }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

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

  return (
    <div>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Crowdly
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
              <GroupIcon />
            </div>
            <div className="mx-3">
              <NotificationsIcon />
            </div>
            <div className="mx-3">
              <a href="/chat">
                <MarkChatUnreadIcon />
              </a>
            </div>
            <div className="mx-3">
              <a href={`/my-profile/${uid}`}>
                <AccountCircleIcon />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
