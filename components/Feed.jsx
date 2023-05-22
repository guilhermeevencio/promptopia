'use client'
import React, { useState, useEffect } from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 promt_layout">
      {data.map((post) => (
        <PromptCard
            key={post.id}
            post={post}
            handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [posts, setPosts] = useState([])
  const [searchedResults, setSearchedResults] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt')
      const data = await response.json()

      setPosts(data)
    }
    fetchPosts()
  }, [])
  

  const filterPosts = (searchValue) => {
    return  posts.filter((post) => {
      const lowercasePrompt = post.prompt.toLowerCase()
      const lowercaseTag = post.tag.toLowerCase()

      return lowercaseTag.includes(searchValue.toLowerCase()) ||
        lowercasePrompt.includes(searchValue.toLowerCase())
      
    })
    // const regex = new RegExp(searchText, "i"); // 'i' flag for case-insensitive search
    // return posts.filter(
    //   (item) =>
    //     regex.test(item.creator.username) ||
    //     regex.test(item.tag) ||
    //     regex.test(item.prompt)
    // );
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPosts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPosts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for prompts"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  )
}

export default Feed