import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'primary.main'
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        Not Found
      </Typography>
      <Link to="/">
        <Button
          variant="contained"
          sx={{
            mt: 2,
            color: 'black',
            backgroundColor: '#00ffff',
            '&:hover':  {
              color: 'white',
              backgroundColor: '#00ffff'
            }
          }}
        >
          Back Home
        </Button>
      </Link>
    </Box>
  )
}

export default NotFound
