import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CreateGame} from '../Services/Services';
import {UserInfo} from '../components/GameCreation/NewGame'
import { AxiosError } from "axios";

export interface GroupInfo {
    name:string;
    users:string[],
}

export interface gameError {
  message:string,
  failed_tickets:string[],
  failed_jql:string,
  failed_sprint:number|string,
  pokerid:number
}

export interface pokerState {
   email:string,
   apikey:string,
   game_description:string,
   game_name:string,
   group:GroupInfo,
   importType:string,
   importValue:string,
   users:Partial<UserInfo>[],
   creating:boolean,
   error:string,
   created:boolean,
   pokerid:number;
   failed_tickets:string[];
   token:string,
   cloudsite:string
}

const initialState: Partial<pokerState> = {
    email:'',
    apikey:'',
    game_description:'',
    game_name:'',
    group:{
      name:'',
      users:[],
    },
    importType:'',
    importValue:'',
    users:[],
    creating:false,
    error:'',
    created:false,
    failed_tickets:[],
    pokerid:0,
    token:"",
    cloudsite:""
};


export const submitPoker = createAsyncThunk(
  'poker/createGame',
  async (Info:Partial<pokerState>, thunkAPI) => {
    try {
      const token=Info.token
      Info.token=""
      const res = await  CreateGame(Info,token);
      console.log(res)
      return {data:res.data};
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
          const errorData = err.response?.data || {};
    
          if (errorData.failed_tickets) {
            return thunkAPI.rejectWithValue({
              message: "Game Not Created",
              failed_tickets: errorData.failed_tickets,
              pokerid: errorData.pokerid || 0,
            });
          }
        
          if (errorData.failed_jql) {
            return thunkAPI.rejectWithValue({
              message: "Game Not Created",
              failed_jql: true,
            });
          }
        
          if (errorData.failed_sprint) {
            return thunkAPI.rejectWithValue({
              message: "Game Not Created",
              failed_sprint: errorData.failed_sprint, 
            });
          }
        
          return thunkAPI.rejectWithValue({
            message: errorData.message || "Game Not Created",
          });
      }
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPoker.pending, (state) => {
        state.creating = true;
        state.error = '';
      })
      .addCase(submitPoker.fulfilled, (state) => {
        state.creating = false;
        state.error='Game Created Successfully'
        state.created=true;     
        state.failed_tickets = [];   
      })
      // .addCase(submitPoker.rejected, (state, action) => {
      //   console.log(action)
      //   state.creating = false;
      //   state.error = 'Game Not Created';
      //   const payload = action.payload as any;

      //  if (payload.failed_tickets) {
      //    state.failed_tickets = payload.failed_tickets;
      //    state.pokerid = payload.pokerid;
      //  } else {
      //    state.failed_tickets = [];
      //    state.pokerid = 0;
      //    state.error ='Game Not Created';
      //  }
      .addCase(submitPoker.rejected, (state, action) => {
        console.log(action);
        state.creating = false;
      
        const payload = action.payload as Partial<gameError>;
      
        if (payload?.failed_tickets) {
          state.error = "Game Not Created: Failed Tickets";
          state.failed_tickets = payload.failed_tickets;
          state.pokerid = payload.pokerid || 0;
      
        } else if (payload?.failed_jql) {
          state.error = "Game Not Created: Failed JQL";
          state.failed_tickets = [];
          state.pokerid = 0;
      
        } else if (payload?.failed_sprint) {
          state.error = "Game Not Created: Failed Sprint";
          state.failed_tickets = [];
          state.pokerid = 0;
      
        } else {
          state.error = "Game Not Created";
          state.failed_tickets = [];
          state.pokerid = 0;
        }
      });
  },
});

export default gameSlice.reducer;
