import { Typography, Container, Box } from '@mui/material'

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          My React App
        </Typography>
        <Typography variant="body1">
          MUI + React + Vite 개발 환경 준비 완료!
        </Typography>
      </Box>
    </Container>
  )
}

export default App
