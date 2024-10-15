import React, { useState, useEffect, useRef, useCallback } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import LoadingBar from 'react-top-loading-bar'; // Import LoadingBar

const News = ({ country, pageSize, category, searchTerm, apikey }) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadingBarRef = useRef(null); // Use ref for loading bar

  // Memoized fetchArticles function to avoid re-creation on each render
  const fetchArticles = useCallback(async (reset = false) => {
    const apiKey = process.env.REACT_APP_NEWS_API || apikey;
    const api = searchTerm
      ? `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
      : `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

    if (reset) {
      setArticles([]); // Only clear articles if it's a fresh fetch (new category/searchTerm)
    }

    loadingBarRef.current.continuousStart(); // Start loading bar
    setLoading(true); // Set loading state

    try {
      const response = await fetch(api);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setArticles(prevArticles => [...prevArticles, ...data.articles]); // Append articles
      setTotalResults(data.totalResults); // Set total results
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false); // Stop loading
      loadingBarRef.current.complete(); // Complete loading bar
    }
  }, [searchTerm, category, country, page, pageSize, apikey]); // Add dependencies

  useEffect(() => {
    // Only fetch when page changes or category/searchTerm changes (reset articles on change)
    fetchArticles(true); // Pass true to reset articles on initial fetch
  }, [fetchArticles, category, searchTerm, country, pageSize, apikey]); // Add missing dependencies

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight) {
        if (!loading && articles.length < totalResults) {
          setPage(prevPage => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup scroll event listener
  }, [loading, articles.length, totalResults]); // Only run when loading or article count changes

  return (
    <div className="container my-3">
      <LoadingBar color="#f11946" ref={loadingBarRef} /> {/* LoadingBar */}
      <h1 className="text-center">Top News Headlines</h1>
      {loading && <Spinner />} {/* Show spinner when loading */}
      <div className="news-grid">
        {articles.map((article, index) => (
          <div className="news-item" key={index}>
            <NewsItem
              title={article.title}
              description={article.description}
              imageUrl={article.urlToImage}
              url={article.url}
              author={article.author}
              date={article.publishedAt}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

News.defaultProps = {
  country: 'us',
  pageSize: 6,
  category: 'general',
  searchTerm: '',
  apikey: process.env.REACT_APP_NEWS_API,
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  searchTerm: PropTypes.string,
  apikey: PropTypes.string.isRequired,
};

export default News;
