import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constant";
import axios from "axios";
import AllUser from "../../Components/AllUser/AllUser";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function AllUsersScreen() {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6 card p-3">
          <h3 style={{ fontWeight: "bold" }}>
            All Users ({recommendedUsers?.length})
          </h3>
          <div className="mt-3">
            {loading ? (
              <>Loading...</>
            ) : recommendedUsers.length === 0 ? (
              <>No users</>
            ) : (
              <AllUser users={recommendedUsers} />
            )}
          </div>
          <div className="d-flex justify-content-between mt-3">
            <ArrowBackIosIcon
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </ArrowBackIosIcon>
            <ArrowForwardIosIcon
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </ArrowForwardIosIcon>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}

export default AllUsersScreen;
