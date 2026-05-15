import { useState } from 'react';
import {
  Box, Container, Card, CardContent, Typography,
  TextField, Button, Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * PostWritePage 컴포넌트
 *
 * Props:
 * @param {object} currentUser - 현재 로그인 사용자 [Required]
 *
 * Example usage:
 * <PostWritePage currentUser={user} />
 */
function PostWritePage({ currentUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', image_url: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('aplantgrowing_posts')
        .insert({
          title: form.title,
          content: form.content,
          image_url: form.image_url || null,
          user_id: currentUser.id,
        })
        .select()
        .single();

      if (dbError) {
        setError('게시글 작성 중 오류가 발생했습니다.');
      } else {
        navigate(`/posts/${data.id}`);
      }
    } catch {
      setError('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth='md'>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          목록으로
        </Button>

        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>게시글 작성</Typography>

            {error && <Alert severity='error' sx={{ mb: 2 }}>{ error }</Alert>}

            <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label='제목'
                name='title'
                value={form.title}
                onChange={handleChange}
                required
                fullWidth
                placeholder='게시글 제목을 입력하세요'
              />
              <TextField
                label='내용'
                name='content'
                value={form.content}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={10}
                placeholder='식물에 대한 이야기를 나눠보세요 🌿'
              />
              <TextField
                label='사진 URL (선택사항)'
                name='image_url'
                value={form.image_url}
                onChange={handleChange}
                fullWidth
                placeholder='https://...'
                InputProps={{
                  startAdornment: <AddPhotoAlternateIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                helperText='이미지 URL을 입력하면 사진이 표시됩니다'
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
                <Button variant='outlined' onClick={() => navigate('/')}>취소</Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  sx={{ minWidth: 100 }}
                >
                  { loading ? '작성 중...' : '작성 완료' }
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default PostWritePage;
