import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, CircularProgress, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PostCard from '../components/posts/PostCard';

/**
 * PostListPage 컴포넌트
 *
 * Props:
 * @param {object|null} currentUser - 현재 로그인 사용자 [Optional]
 *
 * Example usage:
 * <PostListPage currentUser={user} />
 */
function PostListPage({ currentUser }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from('aplantgrowing_posts')
        .select('*, aplantgrowing_users(nickname)')
        .order('created_at', { ascending: false });

      if (dbError) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } else {
        setPosts(data || []);
      }
    } catch {
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth='md'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 700, color: 'primary.dark' }}>
              🌿 식물 이야기
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              우리 식물들의 성장 일기를 나눠요
            </Typography>
          </Box>
          {currentUser && (
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => navigate('/posts/write')}
            >
              글쓰기
            </Button>
          )}
        </Box>

        {error && <Alert severity='error' sx={{ mb: 3 }}>{ error }</Alert>}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress color='primary' />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant='h6' color='text.secondary' gutterBottom>
              아직 게시글이 없어요 🌱
            </Typography>
            <Typography variant='body2' color='text.disabled'>
              첫 번째 식물 이야기를 공유해보세요!
            </Typography>
            {currentUser && (
              <Button
                variant='contained'
                startIcon={<AddIcon />}
                onClick={() => navigate('/posts/write')}
                sx={{ mt: 3 }}
              >
                첫 글 작성하기
              </Button>
            )}
          </Box>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </Container>
    </Box>
  );
}

export default PostListPage;
