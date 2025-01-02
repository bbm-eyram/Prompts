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
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/prompt");
      if (!response.ok) throw new Error("Failed to fetch prompts");
      const data = await response.json();
      setAllPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

      {/* Loading and Error States */}
      {loading && <p>Loading prompts...</p>}
      {error && <p>Error: {error}</p>}

      {/* Display Prompts */}
      {!loading && !error && (
        <PromptCardList
          data={searchText ? searchedResults : allPosts}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;
