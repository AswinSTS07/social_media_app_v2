import React, { useEffect, useState } from "react";
import LeftCard from "../../Components/LeftCard/BasicList";
import RightCard from "../../Components/RightCard/RightCard";
import Post from "../../Components/Post/Post";
import axios from "axios";
import { BASE_URL } from "../../constant";
import { Link } from "react-router-dom";
import Skeleton from "../../Components/Skeleton/Skeleton";
import Skeleton_Loader from "../../Components/Skeleton/Skeleton";
import AlignItemsList from "../../Components/Following/Following";

const user = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

function HomeScreen() {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("userInfo"));
        let res = await axios.get(BASE_URL + `/api/v1/user/posts/${user?.id}`);
        setLoading(false);
        setPost(res?.data?.data);
      };
      fetchPost();
    } catch (error) {
      console.log("Error while fetching post : ", error);
    }
  }, []);

  useEffect(() => {
    const fetchFollowing = async () => {
      let user = JSON.parse(localStorage.getItem("userInfo"));
      let res = await axios.get(
        BASE_URL + `/api/v1/user/following/${user?.id}`
      );

      if (res && res.data) {
        setFollowing(res?.data?.data);
      }
    };
    fetchFollowing();
  }, []);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchRecommendUsers = async () => {
      try {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("userInfo"));
        let res = await axios.get(
          `${BASE_URL}/api/v1/user/recommended-users/${user?.id}`,
          {
            params: { page, limit },
          }
        );
        setRecommendedUsers(res?.data?.data?.users || []);
        setTotalPages(res?.data?.data?.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.log("Error while fetching post: ", error);
        setLoading(false);
      }
    };
    fetchRecommendUsers();
  }, [page]);

  return (
    <div className="row mt-5">
      <div className="col-md-3 p-4">
        <div className="container-fluid card">
          <LeftCard />
        </div>
        <div className="container-fluid card mt-3">
          <div className="mt-2">
            <h4 style={{ fontWeight: "600" }}>
              Following ({following?.length})
            </h4>
            {/* <AlignItemsList /> */}
            {following?.length > 0 ? (
              following.map((fol, index) => <RightCard data={fol} />)
            ) : (
              <p>No following </p>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-6 scrollable-column">
        {loading ? (
          <>
            <Skeleton_Loader />
          </>
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
      <div className="col-md-3 p-4">
        <h4 className="medium">Recommended for you</h4>
        <div className="card mt-2">
          {recommendedUsers?.length == 0 ? (
            <>No recommended users</>
          ) : (
            recommendedUsers?.map((users, index) => (
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
