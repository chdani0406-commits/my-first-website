import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { useNavigate } from 'react-router-dom';

/**
 * Header 컴포넌트
 *
 * Props:
 * @param {object|null} currentUser - 현재 로그인 사용자 정보 [Optional]
 * @param {function} onLogout - 로그아웃 핸들러 [Optional]
 *
 * Example usage:
 * <Header currentUser={user} onLogout={handleLogout} />
 */
function Header({ currentUser, onLogout }) {
  const navigate = useNavigate();

  return (
    <AppBar position='sticky' elevation={0} sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }}
          onClick={() => navigate('/')}
        >
          <LocalFloristIcon sx={{ color: 'secondary.light' }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}
          >
            a plant-growing
          </Typography>
        </Box>

        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.85rem' }}>
              { currentUser.nickname?.[0]?.toUpperCase() }
            </Avatar>
            <Typography variant='body2' sx={{ color: 'white', display: { xs: 'none', sm: 'block' } }}>
              { currentUser.nickname }
            </Typography>
            <Button
              size='small'
              variant='outlined'
              onClick={onLogout}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white' } }}
            >
              로그아웃
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size='small'
              onClick={() => navigate('/login')}
              sx={{ color: 'white' }}
            >
              로그인
            </Button>
            <Button
              size='small'
              variant='contained'
              color='secondary'
              onClick={() => navigate('/register')}
            >
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
