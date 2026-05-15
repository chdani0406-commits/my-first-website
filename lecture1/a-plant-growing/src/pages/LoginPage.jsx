import { useState } from 'react';
import {
  Box, Container, Card, CardContent, Typography,
  TextField, Button, Alert, Link,
} from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * LoginPage 컴포넌트
 *
 * Props:
 * @param {function} onLogin - 로그인 성공 시 호출할 함수 [Required]
 *
 * Example usage:
 * <LoginPage onLogin={handleLogin} />
 */
function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data, error: dbError } = await supabase
        .from('aplantgrowing_users')
        .select('id, nickname, email, username')
        .eq('email', form.email)
        .eq('password_hash', form.password)
        .single();

      if (dbError || !data) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        onLogin(data);
        navigate('/');
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
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
            <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>로그인</Typography>

            {error && <Alert severity='error' sx={{ mb: 2 }}>{ error }</Alert>}

            <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={loading}
                fullWidth
                sx={{ mt: 1 }}
              >
                { loading ? '로그인 중...' : '로그인' }
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                계정이 없으신가요?{' '}
                <Link
                  component='button'
                  onClick={() => navigate('/register')}
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                >
                  회원가입
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;
