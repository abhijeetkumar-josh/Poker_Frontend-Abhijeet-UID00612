import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CreateGame} from '../Services/Services';

export interface GroupInfo {
    name:string;
    users:string[],
}

export interface pokerState {
   email:string,
   apiToken:string,
   gameDescription:string,
   gameName:string,
   group:GroupInfo,
   importType:string,
   importValue:string,
   users:string[],
   creating:boolean,
   error:string,
}

const initialState: pokerState = {
    email:'',
    apiToken:'',
    gameDescription:'',
    gameName:'',
    group:{
      name:'',
      users:[],
    },
    importType:'',
    importValue:'',
    users:[],
    creating:false,
    error:'',
};


export const submitPoker = createAsyncThunk(
  'poker/createGame',
  async (Info:pokerState, thunkAPI) => {
    try {
      const res =await  CreateGame(Info);
      return { user: res };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Game Not Created');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // updateUserFields(state, action) {
    //   if (state.user) {
    //     state.user = { ...state.user, ...action.payload };
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPoker.pending, (state) => {
        state.creating = true;
        state.error = '';
      })
      .addCase(submitPoker.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(submitPoker.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      });
  },
});

export default gameSlice.reducer;
