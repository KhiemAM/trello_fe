import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Board from './pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import Boards from '~/pages/Boards/'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace={true}/>
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path='/' element={
        <Navigate to='/boards/67a723a732097956604f1eb3' replace={true}/>
      }/>

      <Route element={<ProtectedRoute user={currentUser}/>}>
        <Route path='/boards/:boardId' element={<Board />}/>
        <Route path='/boards' element={<Boards />}/>

        <Route path='/settings/account' element={<Settings />}/>
        <Route path='/settings/security' element={<Settings />}/>
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth />}/>
      <Route path='/register' element={<Auth />}/>
      <Route path='/account/verification' element={<AccountVerification />}/>

      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App
