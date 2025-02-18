import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Import MUI components digalog confirm
import { ConfirmProvider } from 'material-ui-confirm'

//Import Redux Store
import { store } from '~/redux/stores.js'
import { Provider } from 'react-redux'

//Config React-router-dom
import { BrowserRouter } from 'react-router-dom'

//Redux persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

//Inject store to axios
import { injectStore } from './utils/authorizeAxios.js'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            cancellationButtonProps: { color: 'inherit' },
            confirmationButtonProps: { color: 'primary', variant: 'outlined' }
          }}>
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }}/>
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-left" theme="colored"/>
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
