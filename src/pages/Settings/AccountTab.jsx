import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validator'
import { toast } from 'react-toastify'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import MailIcon from '@mui/icons-material/Mail'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

function AccountTab() {
  const currentUser = useSelector(selectCurrentUser)
  const initialGeneralForm = {
    displayName: currentUser?.displayName
  }
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialGeneralForm
  })

  const submitChangeGeneralInformation = (data) => {
    const { displayName } = data
    if (displayName === currentUser?.displayName) return
  }

  const uploadAvatar = (e) => {
    const error = singleFileValidator(e.target.files[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('avatar', e.target.files[0])

    for (const value of reqData.values()) {
      console.log(value)
    }
  }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Avatar
              sx={{ width: 84, height: 84, mb: 1 }}
              alt='KhiemAM'
              src={currentUser?.avatar}
            />
            <Tooltip>
              <Button
                component='label'
                variant='contained'
                size='small'
                startIcon={<CloudUploadIcon />}
              >
                Upload
                <VisuallyHiddenInput type='file' onChange={uploadAvatar}/>
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant='h6'>{currentUser?.displayName}</Typography>
            <Typography sx={{ color: 'grey' }}>@{currentUser?.username}</Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label='Your Email'
                type='text'
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MailIcon fontSize='small'/>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.username}
                fullWidth
                label='Your Username'
                type='text'
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountBoxIcon fontSize='small'/>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label='Your Display Name'
                type='text'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AssignmentIndIcon fontSize='small'/>
                    </InputAdornment>
                  )
                }}
                {...register('displayName', {
                  required: FIELD_REQUIRED_MESSAGE
                })}
                error={!!errors['displayName']}
              />
              <FieldErrorAlert errors={errors} fieldName={'displayName'}/>
            </Box>

            <Box>
              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
              >
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default AccountTab
