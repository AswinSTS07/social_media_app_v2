import React, { useEffect, useState } from "react";
import LeftCard from "../../Components/LeftCard/BasicList";
import RightCard from "../../Components/RightCard/RightCard";
import Post from "../../Components/Post/Post";
import axios from "axios";
import { BASE_URL } from "../../constant";
import { Link } from "react-router-dom";

const user = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

function HomeScreen() {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("userInfo"));
        let res = await axios.get(BASE_URL + `/api/v1/user/posts/${user?.id}`);
        setPost(res?.data?.data);
        setLoading(false);
      };
      fetchPost();
    } catch (error) {
      console.log("Error while fetching post : ", error);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchRecommendUsers = async () => {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("userInfo"));
        let res = await axios.get(
          BASE_URL + `/api/v1/user/recommended-users/${user?.id}`
        );
        setRecommendedUsers(res?.data?.data);
        setLoading(false);
      };
      fetchRecommendUsers();
    } catch (error) {
      console.log("Error while fetching post : ", error);
    }
  }, []);

  return (
    <div className="row mt-5">
      <div className="col-md-3">
        <div className="container-fluid card">
          <LeftCard />
        </div>
      </div>
      <div className="col-md-6 scrollable-column">
        {loading ? (
          <>Loading....</>
        ) : post.length > 0 ? (
          post.map((p, index) => (
            <Post
              user={p}
              cd
              f
              time="2 hrs ago"
              content={p?.caption}
              image={p?.src}
              postId={p._id}
            />
          ))
        ) : (
          <>No post available</>
        )}
      </div>
      <div className="col-md-3">
        <h4 className="medium">Recommended for you</h4>
        <div className="container-fluid card">
          {recommendedUsers?.length == 0 ? (
            <>No recommended users</>
          ) : (
            recommendedUsers.map((users, index) => (
              <Link to={`/user/${users?._id}`}>
                <RightCard data={users} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
