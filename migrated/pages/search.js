import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import SearchResults from '../components/Contents/SearchResult';
import { updateSearch, updateSearchType } from '../components/redux/Search';

export default function SearchPage() {
  const router = useRouter();
  const { query, type } = router.query;
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Update search state when query param changes
    if (query) {
      dispatch(updateSearch(query));
    }

    // Update search type when type param changes
    if (type !== undefined) {
      const searchType = parseInt(type, 10);
      if (!isNaN(searchType) && searchType >= 0 && searchType <= 4) {
        dispatch(updateSearchType(searchType));
      }
    }
  }, [query, type, isClient, dispatch]);

  if (!isClient) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column' 
      }}>
        <Head>
          <title>Loading Search...</title>
        </Head>
        <p>Loading search...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{query ? `Search results for "${query}"` : 'Search'} | Blog</title>
        <meta name="description" content={query ? `Search results for "${query}" on the blog` : 'Search the blog'} />
      </Head>
      <SearchResults />
    </>
  );
} 