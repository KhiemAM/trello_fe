import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import ListCards from './ListCards/ListCards'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'

import { useConfirm } from 'material-ui-confirm'

import { createNewCardAPI, deleteColumnDetailAPI, updateColumnDetailAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'

function Column({ column }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const orderedCards = column.cards

  //Add new card
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter card title', { position: 'bottom-right' })
      return
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    //API create new card
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const confirmDeleteColumn = useConfirm()

  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete this column?',
      description: 'This action will delete the column and all the cards in it. Are you sure you want to delete this column?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      //API delete column
      const newBoard = { ...board }
      newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
      newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== column._id)
      dispatch(updateCurrentActiveBoard(newBoard))

      deleteColumnDetailAPI(column._id).then((res) => {
        toast.success(res?.deleteResult)
      })
    }).catch(() => {})
  }

  const onUpdateColumnTitle = (newTitle) => {
    updateColumnDetailAPI(column._id, { title: newTitle }).then(() => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(c => c._id === column._id)
      if (columnToUpdate) {
        columnToUpdate.title = newTitle
      }
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <ToggleFocusInput
            value={column?.title}
            onChangedValue={onUpdateColumnTitle}
            data-no-dnd="true"
          />
          <Box>
            <Tooltip title="More options">
              <KeyboardArrowDownIcon
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer'
                }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': { color: 'success.light' }
                  }
                }}
                onClick={toggleOpenNewCardForm}
              >
                <ListItemIcon>
                  <AddCardIcon className='add-card-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'error.light',
                    '& .delete-forever-icon': { color: 'error.light' }
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon className='delete-forever-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <ListCards cards={orderedCards}/>

        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? (
              <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Button
                  startIcon={<AddCardIcon />}
                  onClick={toggleOpenNewCardForm}
                >
                  Add new card
                </Button>
                <Tooltip title="Drag to move">
                  <DragHandleIcon sx={{ cursor: 'pointer' }}/>
                </Tooltip>
              </Box>
            ) : (
              <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TextField
                  label="Enter column title..."
                  type="text"
                  size='small'
                  variant="outlined"
                  autoFocus
                  data-no-dnd="true"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  sx={{
                    '& label': { color: 'text.primary' },
                    '& input': {
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333643' : 'white'
                    },
                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                    }
                  }}
                />
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Button
                    className='interceptor-loading'
                    onClick={addNewCard}
                    variant='contained'
                    color='success'
                    size='small'
                    sx={{
                      boxShadow: 'none',
                      border: '0.5px solid',
                      borderColor: (theme) => theme.palette.success.main,
                      '&:hover': { bgcolor: (theme) => theme.palette.success.main, borderWidth: 1 }
                    }}
                  >
                    Add
                  </Button>
                  <CloseIcon
                    fontSize='small'
                    sx={{
                      color: (theme) => theme.palette.error.main,
                      cursor: 'pointer',
                      '&:hover': { color: (theme) => theme.palette.error.light }
                    }}
                    onClick={toggleOpenNewCardForm}
                  />
                </Box>
              </Box>
            )
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column
