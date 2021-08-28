import { createSlice } from '@reduxjs/toolkit'

export const clientReducer = createSlice({
  name: 'Client',
  initialState: {
    client: []
  },
  reducers: {
    addClient: (state, action) => {
      state.client.push(action.payload)
    },
    addClients: (state, action) => {
      state.client = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { addClient, addClients } = clientReducer.actions

export default clientReducer.reducer