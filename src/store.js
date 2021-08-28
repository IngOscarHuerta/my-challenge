import { configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/userReducer'
import clientReducer from './redux/clientReducer'

export default configureStore({
  reducer: {
      user: userReducer,
      client: clientReducer
  },
})