import Head from 'next/head';
import Masonry from 'react-responsive-masonry';
import { useEffect, useState } from 'react';
import { fetchPostsPagination } from '../../libs/contentful';
import PostCard from '../../components/PostCard';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ResponsiveMasonry = dynamic(() => import('react-responsive-masonry').then(mod => mod.ResponsiveMasonry), {
  ssr: false,
});

const POSTS_PER_PAGE = 12;

export default function Home() {

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const router = useRouter();
  const { page = 1, search = '' } = router.query;

  useEffect(() => {
    async function getPosts() {
      const skip = (page - 1) * POSTS_PER_PAGE;
      const { posts: fetchedPosts, total } = await fetchPostsPagination({ skip, limit: POSTS_PER_PAGE, search });
      setPosts(fetchedPosts);
      setTotalPosts(total);
    }
    getPosts();
  }, [page, search]);

  const handleSearch = (term) => {
    router.push(`/posts/?page=1&search=${term}`, undefined, { shallow: true });
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      
      <hr class="hr hr-blurry" />
      <h2 class="text-center p-3" style={{backgroundColor: "white"}}>My Posts</h2>
      <SearchInput onSearch={handleSearch} />
      <hr class="hr hr-blurry" />

      <ResponsiveMasonry columnsCountBreakPoints={breakpointColumnsObj}>
        <Masonry gutter="1rem">
          {posts.map((post) => (
            <PostCard key={post.sys.id} post={post} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
      
      <Pagination
        currentPage={parseInt(page)}
        totalPosts={totalPosts}
        postsPerPage={POSTS_PER_PAGE}
        searchTerm={search}
      />
      
    </>
  );
}
