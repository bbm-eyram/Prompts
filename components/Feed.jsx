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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async (query = "") => {
    try {
      setLoading(true);
      const response = await fetch(`/api/prompt?search=${query}`);
      if (!response.ok) throw new Error("Failed to fetch prompts");
      const data = await response.json();
      setAllPosts(data);
      if (query) setSearchedResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchText(query);
    fetchPosts(query);
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    fetchPosts(tagName);
  };

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

      {/* All Prompts or Search Results */}
      {!loading && !error && (
        <>
          {searchText && searchedResults.length === 0 ? (
            <p>No results found for "{searchText}".</p>
          ) : (
            <PromptCardList
              data={searchText ? searchedResults : allPosts}
              handleTagClick={handleTagClick}
            />
          )}
        </>
      )}
    </section>
  );
};

export default Feed;
