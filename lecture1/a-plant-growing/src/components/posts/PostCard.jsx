import {
  Card, CardContent, CardActionArea, Typography, Box, Chip, Avatar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import { useNavigate } from 'react-router-dom';

/**
 * PostCard 컴포넌트
 *
 * Props:
 * @param {object} post - 게시글 데이터 [Required]
 * @param {string} post.id - 게시글 ID
 * @param {string} post.title - 게시글 제목
 * @param {string} post.created_at - 작성 시간
 * @param {number} post.like_count - 좋아요 수
 * @param {number} post.comment_count - 댓글 수
 * @param {object} post.aplantgrowing_users - 작성자 정보
 *
 * Example usage:
 * <PostCard post={postData} />
 */
function PostCard({ post }) {
  const navigate = useNavigate();
  const authorNickname = post.aplantgrowing_users?.nickname || '알 수 없음';
  const createdDate = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Card sx={{ mb: 2 }}>
      <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {post.image_url && (
            <Box
              component='img'
              src={post.image_url}
              alt={post.title}
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 2,
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, lineHeight: 1.4 }}>
            { post.title }
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.light', width: 24, height: 24, fontSize: '0.7rem' }}>
              { authorNickname[0]?.toUpperCase() }
            </Avatar>
            <Typography variant='body2' color='text.secondary'>{ authorNickname }</Typography>
            <Typography variant='body2' color='text.disabled'>·</Typography>
            <Typography variant='body2' color='text.secondary'>{ createdDate }</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              icon={<FavoriteIcon sx={{ fontSize: '0.9rem !important' }} />}
              label={post.like_count || 0}
              size='small'
              sx={{ bgcolor: 'error.50', color: 'error.main', '& .MuiChip-icon': { color: 'error.main' } }}
            />
            <Chip
              icon={<ModeCommentIcon sx={{ fontSize: '0.9rem !important' }} />}
              label={post.comment_count || 0}
              size='small'
              sx={{ bgcolor: 'primary.50', color: 'primary.main', '& .MuiChip-icon': { color: 'primary.main' } }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
