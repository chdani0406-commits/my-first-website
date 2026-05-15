import { useState, useEffect } from 'react';
import {
  Box, Container, Card, CardContent, Typography, Button,
  Divider, TextField, CircularProgress, Alert, Avatar, IconButton, Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * PostDetailPage 컴포넌트
 *
 * Props:
 * @param {object|null} currentUser - 현재 로그인 사용자 [Optional]
 *
 * Example usage:
 * <PostDetailPage currentUser={user} />
 */
function PostDetailPage({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
    if (currentUser) checkLike();
  }, [id, currentUser]);

  const fetchPost = async () => {
    const { data, error: dbError } = await supabase
      .from('aplantgrowing_posts')
      .select('*, aplantgrowing_users(nickname)')
      .eq('id', id)
      .single();

    if (dbError) {
      setError('게시글을 불러올 수 없습니다.');
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('aplantgrowing_comments')
      .select('*, aplantgrowing_users(nickname)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    setComments(data || []);
  };

  const checkLike = async () => {
    const { data } = await supabase
      .from('aplantgrowing_likes')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('post_id', id)
      .single();

    setIsLiked(!!data);
  };

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isLiked) {
      await supabase
        .from('aplantgrowing_likes')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('post_id', id);
      setIsLiked(false);
      setPost((prev) => ({ ...prev, like_count: prev.like_count - 1 }));
    } else {
      await supabase
        .from('aplantgrowing_likes')
        .insert({ user_id: currentUser.id, post_id: id });
      setIsLiked(true);
      setPost((prev) => ({ ...prev, like_count: prev.like_count + 1 }));
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;
    setCommentLoading(true);

    const { error: dbError } = await supabase
      .from('aplantgrowing_comments')
      .insert({
        content: newComment.trim(),
        user_id: currentUser.id,
        post_id: id,
      });

    if (!dbError) {
      setNewComment('');
      fetchComments();
      setPost((prev) => ({ ...prev, comment_count: prev.comment_count + 1 }));
    }
    setCommentLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Alert severity='error'>{ error || '게시글을 찾을 수 없습니다.' }</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          목록으로
        </Button>
      </Container>
    );
  }

  const authorNickname = post.aplantgrowing_users?.nickname || '알 수 없음';
  const createdDate = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth='md'>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
          목록으로
        </Button>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant='h4' sx={{ fontWeight: 700, mb: 2, lineHeight: 1.4 }}>
              { post.title }
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                { authorNickname[0]?.toUpperCase() }
              </Avatar>
              <Box>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>{ authorNickname }</Typography>
                <Typography variant='caption' color='text.secondary'>{ createdDate }</Typography>
              </Box>
            </Box>

            {post.image_url && (
              <Box
                component='img'
                src={post.image_url}
                alt={post.title}
                sx={{
                  width: '100%',
                  maxHeight: 500,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 3,
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}

            <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, mb: 3 }}>
              { post.content }
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography variant='body2' color='text.secondary'>
                { post.like_count || 0 }명이 좋아합니다
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* 댓글 영역 */}
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant='h6' gutterBottom>
              댓글 <Chip label={post.comment_count || 0} size='small' color='primary' />
            </Typography>

            {/* 댓글 입력 */}
            <Box component='form' onSubmit={handleComment} sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={currentUser ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
                disabled={!currentUser || commentLoading}
                fullWidth
                size='small'
                multiline
                maxRows={4}
              />
              <IconButton
                type='submit'
                color='primary'
                disabled={!currentUser || !newComment.trim() || commentLoading}
                sx={{ alignSelf: 'flex-start', bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, '&:disabled': { bgcolor: 'action.disabled' } }}
              >
                <SendIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 댓글 목록 */}
            {comments.length === 0 ? (
              <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', py: 3 }}>
                첫 번째 댓글을 남겨보세요 🌱
              </Typography>
            ) : (
              comments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Avatar sx={{ bgcolor: 'secondary.light', width: 28, height: 28, fontSize: '0.75rem' }}>
                      { comment.aplantgrowing_users?.nickname?.[0]?.toUpperCase() }
                    </Avatar>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      { comment.aplantgrowing_users?.nickname }
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      { new Date(comment.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
                    </Typography>
                  </Box>
                  <Typography variant='body2' sx={{ ml: 4.5, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                    { comment.content }
                  </Typography>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
