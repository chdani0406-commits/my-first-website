import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/common/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostWritePage from './pages/PostWritePage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { currentUser, login, logout } = useAuth();

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header currentUser={currentUser} onLogout={logout} />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path='/' element={<PostListPage currentUser={currentUser} />} />
            <Route path='/login' element={currentUser ? <Navigate to='/' /> : <LoginPage onLogin={login} />} />
            <Route path='/register' element={currentUser ? <Navigate to='/' /> : <RegisterPage />} />
            <Route path='/posts/write' element={currentUser ? <PostWritePage currentUser={currentUser} /> : <Navigate to='/login' />} />
            <Route path='/posts/:id' element={<PostDetailPage currentUser={currentUser} />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
