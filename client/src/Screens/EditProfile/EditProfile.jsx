import React, { useEffect, useState } from "react";
import "./EditProfile.css";
import axios from "axios";
import { BASE_URL } from "../../constant";
import Swal from "sweetalert2";
import LinearWithValueLabel from "../../Components/LinearProgressWithLabel/LinearProgressWithLabel";

const EditProfile = () => {
  const [username, setUserName] = useState(null);
  const [bio, setBio] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);
  const [profileSrc, setProfileSrc] = useState(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      let user = JSON.parse(localStorage.getItem("userInfo"));
      let res = await axios.get(BASE_URL + `/api/v1/user/user/${user?.id}`);
      if (res && res.data) {
        setUser(res?.data?.data);
        setPreviewCover(res?.data?.data?.coverImage);
        setPreviewAvatar(res?.data?.data?.profileImage);
        setUserName(res?.data?.data?.username);
        setBio(res?.data?.data?.bio);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    previewFile(file, setPreviewAvatar, "profile");
    setAvatar(file);
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    previewFile(file, setPreviewCover, "cover");
    setCoverPhoto(file);
  };

  const previewFile = (file, setPreview, type) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result);
      if (type == "cover") {
        setCoverSrc(reader?.result);
      } else {
        setProfileSrc(reader?.result);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let update_data = {
        username,
        bio,
        profile: profileSrc,
        coverPhoto: coverSrc,
      };
      let res = await axios.post(
        BASE_URL + `/api/v1/user/edit-profile/${user?._id}`,
        update_data
      );
      if (res && res.status == 200) {
        Swal.fire({
          title: "Success!",
          text: "Account created successfully!",
          icon: "success",
        });
        setLoading(false);
        window.location.href = `/my-profile/${user?._id}`;
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container mt-2">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="coverPhoto">Cover Photo</label>
          <div className="image-preview-container">
            <img
              src={previewCover}
              alt="Cover Preview"
              className="image-preview"
            />
          </div>
          <input
            type="file"
            id="coverPhoto"
            accept="image/*"
            onChange={handleCoverPhotoChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Avatar</label>
          <div className="image-preview-container">
            <img
              src={previewAvatar}
              alt="Avatar Preview"
              className="image-preview"
            />
          </div>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="save-button" disabled={loading}>
          {loading ? <>Please wait....</> : <> Save Changes</>}
        </button>
        {loading && <LinearWithValueLabel />}
      </form>
    </div>
  );
};

export default EditProfile;
