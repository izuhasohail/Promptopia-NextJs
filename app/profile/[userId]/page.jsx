"use client";
import Profile from "@components/Profile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const UserProfile = ({ params }) => {
  const [posts, setPosts] = useState([]);
  const userId = params.userId;
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        try {
          const response = await fetch(`/api/users/${userId}/posts`);
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
      };

      fetchPosts();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const fetchUserDetails = async () => {
        try {

          //fetching the user
          const userResponse = await fetch(`/api/users/${userId}`);
          const userData = await userResponse.json();

          setUserName(userData.username); // Set the user's name

          // Fetch the user's posts
          const postsResponse = await fetch(`/api/users/${userId}/posts`);
          const postsData = await postsResponse.json();
          setPosts(postsData);
        } catch (error) {
          console.error("Failed to fetch user details or posts:", error);
        }
      };

      fetchUserDetails();
    }
  }, [userId]);

  const handleEdit = async (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        onsole.error("Failed to delete post:", error);
      }
    }
  };

  if (!userId) return <div>Loading...</div>;

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s profile page`} 
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default UserProfile;
