"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick} // Pass handleTagClick to each PromptCard
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);

    // Check if the search bar is empty, display all posts
    if (!searchText) {
      setFilteredPosts(posts);
      return;
    }

    // Filter posts by prompt, tag, or username
    const filtered = posts.filter((post) => {
      const promptMatch = post.prompt.toLowerCase().includes(searchText);
      const tagMatch = post.tag.toLowerCase().includes(searchText);
      const usernameMatch = post.creator.username.toLowerCase().includes(searchText);

      return promptMatch || tagMatch || usernameMatch;
    });

    setFilteredPosts(filtered);
  };

  const handleTagClick = (tag) => {
    const filtered = posts.filter((post) => post.tag.toLowerCase() === tag.toLowerCase());
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data); // Update posts
      setFilteredPosts(data); // Initialize filteredPosts with fetched data

      console.log('Posts fetched:', data);
    };

    fetchPosts();
  }, []); // Empty dependency array to ensure this only runs on component mount

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
