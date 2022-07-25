import {
    createEntityAdapter,
    createSlice,
  } from "@reduxjs/toolkit";
  
  
  const courtsAdapter = createEntityAdapter({
    selectId: court => court.place_id
  });
  

  
  const initialState = courtsAdapter.getInitialState({
    status: 'idle',
    nextPageToken: null,
    error: null,
  });


  const courtsSlice = createSlice({
    name: "courts",
    initialState,
    reducers: {
        updateCourts: (state, action) => {
          try {
            const {results, next_page_token} = action.payload
            state.status = 'succeeded';
            state.nextPageToken = next_page_token
            courtsAdapter.setAll(state, results)
          } catch(error){
            state.status = 'failed'
            state.error = {message: error.message}
          }
        }
    },
  });
  
  export const {
      updateCourts
  } = courtsSlice.actions;
  
  export default courtsSlice.reducer;
  
  export const {
    selectAll: selectAllCourts,
    selectById: selectCourtById,
    selectIds: selectCourtIds,
  } = courtsAdapter.getSelectors((state) => state.courts);
  