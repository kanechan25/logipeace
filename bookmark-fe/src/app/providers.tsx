'use client'

import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { store } from '../stores'
import ThemeProvider from '../components/ThemeProvider'

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
          className='!mt-16'
        />
      </ThemeProvider>
    </Provider>
  )
}
