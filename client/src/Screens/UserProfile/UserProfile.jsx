import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import RightCard from "../../Components/RightCard/RightCard";
import axios from "axios";
import { BASE_URL } from "../../constant";
import { useParams } from "react-router-dom";
import Post from "../../Components/Post/Post";

function UserProfile() {
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const checkFollowed = async () => {
      let user = JSON.parse(localStorage.getItem("userInfo"));

      let res = await axios.post(BASE_URL + `/api/v1/user/check-followed`, {
        fromId: user?.id,
        toId: id,
      });
      if (res) {
        if (res?.data == false) {
          setFollowed(false);
        } else {
          setFollowed(true);
        }
      }
    };
    checkFollowed();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      let res = await axios.get(BASE_URL + `/api/v1/user/user/${id}`);
      if (res && res.data) {
        setUser(res?.data?.data);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        setLoading(true);

        let res = await axios.get(BASE_URL + `/api/v1/user/posts/${id}`);
        setPost(res?.data?.data);
        setLoading(false);
      };
      fetchPost();
    } catch (error) {
      console.log("Error while fetching post : ", error);
    }
  }, []);

  const requestToFollow = async () => {
    try {
      setProcessing(true);
      let current_user = JSON.parse(localStorage.getItem("userInfo"));
      let res = await axios.post(
        BASE_URL + `/api/v1/user/send-follow-request`,
        {
          fromId: current_user?.id,
          toId: id,
        }
      );
      if (res && res.data == true) {
        setFollowed(true);
        setProcessing(false);
      }
    } catch (error) {
      console.log("Error while sending follow request : ", error);
    }
  };

  const unFollow = async () => {
    try {
      setProcessing(true);
      let current_user = JSON.parse(localStorage.getItem("userInfo"));
      let res = await axios.post(BASE_URL + `/api/v1/user/unfollow`, {
        fromId: current_user?.id,
        toId: id,
      });
      if (res && res.data == true) {
        setFollowed(false);
        setProcessing(false);
      }
    } catch (error) {
      console.log("Error while sending follow request : ", error);
    }
  };

  return (
    <div>
      <div className="container mt-2">
        <div className="row">
          <div>
            <div className="cover-photo">
              <img src={user?.coverImage} alt="Cover" />
            </div>
            <div className="profile-info">
              <div className="avatar">
                <img src={user?.profileImage} alt="Avatar" />
              </div>
              <div className="details">
                <h1 className="name">{user?.username}</h1>
                <p className="bio">{user?.bio}</p>
                <div className="stats">
                  <span>{user?.following} Following</span>
                  <span>{user?.followers} Followers</span>
                  <span>{post?.length} Posts</span>
                </div>
                {!followed ? (
                  <button
                    className="mt-4 btn btn-primary"
                    onClick={requestToFollow}
                    disabled={processing}
                  >
                    {processing ? <>Please wait..</> : <>Follow</>}
                  </button>
                ) : (
                  <button
                    className="mt-4 btn btn-secondary"
                    onClick={unFollow}
                    disabled={processing}
                  >
                    {processing ? <>Please wait..</> : <>Unfollow</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <Tabs>
              <TabList>
                <Tab>Post</Tab>
                <Tab>Followers</Tab>
                <Tab>Following</Tab>
              </TabList>

              <TabPanel>
                <div className="profile-page">
                  <div className="profile-posts">
                    {post.length > 0 ? (
                      post.map((p, index) => (
                        <div key={index} className="post">
                          <Post
                            user={p}
                            time="2 hrs ago"
                            content="This is a sample post content. It's a beautiful day!"
                            image={p?.src}
                            avatar={user?.avatar}
                            name={user?.name}
                          />
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          top: "100px",
                          position: "relative",
                        }}
                      >
                        No post
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <RightCard />
              </TabPanel>
              <TabPanel>
                <RightCard />
              </TabPanel>
            </Tabs>
          </div>
          <div className="col-md-4 mt-4 card">
            <h4 className="medium-text mt-3">People your may know</h4>
            <RightCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
