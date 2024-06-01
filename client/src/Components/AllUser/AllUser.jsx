import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function AllUser({ users }) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {users?.map((user, index) => (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={user?.profile_pic} />
            </ListItemAvatar>
            <ListItemText
              primary={user?.username}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Followers {"  "}
                  </Typography>
                  {user?.followers}
                </React.Fragment>
              }
            />
            <a href={`/user/${user?._id}`}>View profile</a>
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      ))}
    </List>
  );
}
