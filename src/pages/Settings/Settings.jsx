import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'

const TAB = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

function Settings() {
  const location = useLocation()

  const getDefaultTabFromURL = () => {
    if (location.pathname.includes(TAB.ACCOUNT)) {
      return TAB.ACCOUNT
    }
    return TAB.SECURITY
  }

  const [activeTab, setActiveTab] = useState(getDefaultTabFromURL())

  const handleChangeTab = (event, selectedTab) => { setActiveTab(selectedTab) }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab
              label="Account"
              value={TAB.ACCOUNT}
              icon={<PersonIcon />}
              iconPosition='start'
              component={Link}
              to='/settings/account'
            />
            <Tab
              label="Security"
              value={TAB.SECURITY}
              icon={<SecurityIcon />}
              iconPosition='start'
              component={Link}
              to='/settings/security'
            />
          </TabList>
        </Box>
        <TabPanel value={TAB.ACCOUNT}><AccountTab /></TabPanel>
        <TabPanel value={TAB.SECURITY}><SecurityTab /></TabPanel>
      </TabContext>
    </Container>
  )
}

export default Settings
