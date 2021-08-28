import { createSlice } from '@reduxjs/toolkit'

export const userReducer = createSlice({
  name: 'User',
  initialState: {
        user: {}
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addUser } = userReducer.actions

export default userReducer.reducer