import { useState } from 'react';
import {
  Box, Container, Card, CardContent, Typography,
  TextField, Button, Alert, Link,
} from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * RegisterPage 컴포넌트
 *
 * Props:
 * 없음 (독립 페이지)
 *
 * Example usage:
 * <RegisterPage />
 */
function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('aplantgrowing_users')
        .insert({
          username: form.username,
          email: form.email,
          password_hash: form.password,
          nickname: form.nickname,
        });

      if (dbError) {
        if (dbError.code === '23505') {
          setError('이미 사용 중인 아이디 또는 이메일입니다.');
        } else {
          setError('회원가입 중 오류가 발생했습니다.');
        }
      } else {
        navigate('/login');
      }
    } catch {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth='sm'>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LocalFloristIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant='h4' color='primary' gutterBottom>a plant-growing</Typography>
          <Typography variant='body2' color='text.secondary'>식물을 사랑하는 사람들의 커뮤니티</Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>회원가입</Typography>

            {error && <Alert severity='error' sx={{ mb: 2 }}>{ error }</Alert>}

            <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label='아이디'
                name='username'
                value={form.username}
                onChange={handleChange}
                required
                fullWidth
                helperText='영문, 숫자 조합'
              />
              <TextField
                label='이메일'
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label='비밀번호'
                name='password'
                type='password'
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label='닉네임'
                name='nickname'
                value={form.nickname}
                onChange={handleChange}
                required
                fullWidth
                helperText='커뮤니티에서 사용할 이름'
              />
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={loading}
                fullWidth
                sx={{ mt: 1 }}
              >
                { loading ? '가입 중...' : '회원가입 하기' }
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                이미 계정이 있으신가요?{' '}
                <Link
                  component='button'
                  onClick={() => navigate('/login')}
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                >
                  로그인
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default RegisterPage;
