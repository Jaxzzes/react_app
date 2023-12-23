import React, {useMemo, useState, useEffect} from 'react';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import PostFilter from '../components/PostFilter';
import MyModal from '../components/UI/modal/MyModal';
import MyButton from '../components/UI/button/MyButton';
import { usePosts } from '../hooks/usePosts';
import PostService from '../API/PostService';
import Loader from '../components/UI/loader/Loader';
import { useFetching } from '../hooks/useFetching';
import { getPageCount, getPagesArray } from '../utils/pages';
import Pagination from '../components/UI/pagination/Pagination';

function Posts() {

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({sort: '', query: ''});
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

  const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, newPage) => {
   
    const response = await PostService.getAll(limit, newPage);
    setPosts(response.data);

    const totalCount = response.headers['x-total-count'];

    const calculatedTotalPages = getPageCount(totalCount, limit);
    setTotalPages(calculatedTotalPages);
  });
  

  const updateAndStorePosts = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const resetChanges = async () => {
    const response = await PostService.getAll(limit, page);
    const originalPosts = response.data;
    updateAndStorePosts(originalPosts);
  };

  const createPost = async (newPost) => {
    const updatedPosts = [{ ...newPost, id: Date.now() }, ...posts];
    updateAndStorePosts(updatedPosts);
    setModal(false);
  };

  const removePost = (post) => {
    const updatedPosts = posts.filter((p) => p.id !== post.id);
    updateAndStorePosts(updatedPosts);
  };

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts'));
    if (storedPosts) {
      setPosts(storedPosts);
    } else {
      resetChanges();
    }
  }, []);

  const changePage = (page) => {
    if (page === 0) {
      setPage(page + 1);
    } else {
      setPage(page);
    }
    fetchPosts(limit, page);
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
            Create post
          </MyButton>
        </div>
        <div>
          <MyButton style={{ marginTop: 30 }} onClick={resetChanges}>
            Reset Changes
          </MyButton>
        </div>
      </div>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>

      <hr style={{margin: '15px 0'}} />
      
      <PostFilter 
        filter={filter}
        setFilter={setFilter}
      />
      {postError && 
        <h1>Error ${postError}</h1>
      }
      {isPostsLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title="List posts" />
      }
      <Pagination 
        page={page} 
        changePage={changePage} 
        totalPages={totalPages} 
      />

    </div>
  );
}

export default Posts;
