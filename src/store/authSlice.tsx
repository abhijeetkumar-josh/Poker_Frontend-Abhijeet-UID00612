import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { SignUser } from '../Services/Services';
import { LoginUser,UpdateUser} from '../Services/Services';
import { EditProfile } from '../screens/Profile/ProfileEdit';



interface AuthState {
  email:string;
  isAuthenticated: boolean;
  loading: boolean;
  loading1:boolean;
  error: string | null;
  error1:string | null;
  token: string | null;
}

const initialState: AuthState = {
  email:'',
  isAuthenticated: false,
  loading: false,
  loading1:false,
  error: null,
  error1:null,
  token: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string | undefined; password: string | undefined }, thunkAPI) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailcheck:boolean=emailRegex.test(credentials.email|| "");
    const passwordcheck:boolean=!credentials.password || credentials.password.length < 8;
    if(!emailcheck && passwordcheck){
      return thunkAPI.rejectWithValue('Email is not valid and password must be 8 characters long');
    }
    if (!emailcheck) {
      return thunkAPI.rejectWithValue('Email is not valid');
    }

    if (passwordcheck) {
      return thunkAPI.rejectWithValue('Password must be at least 8 characters long');
    }

    try {
      const res =await  LoginUser(credentials.email,credentials.password);
      return { user: res ,email:credentials.email};
    } catch (err: any) {
      let val:string = "";
      if(typeof err.response.data==='object'){
      Object.values(err.response.data).forEach(value => {
      console.log(value);
      val+=value+', ';
      });}
      const errorMessage = val.slice(0, -2);
      return thunkAPI.rejectWithValue(errorMessage || 'Login failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data:EditProfile, thunkAPI) => {
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const emailcheck:boolean=emailRegex.test(credentials.email|| "");
    // const passwordcheck:boolean=!credentials.password || credentials.password.length < 8;
    // if(!credentials.username){ 
    //   return thunkAPI.rejectWithValue('username cannot be null');
    // }
    if (!emailRegex.test(credentials.email|| "")) {
      return thunkAPI.rejectWithValue('Email is not valid');
    }

    if (!credentials.password || credentials.password.length < 8) {
      return thunkAPI.rejectWithValue('Password must be at least 8 characters long');
    }

    // if(!emailcheck && passwordcheck){
    //   return thunkAPI.rejectWithValue('Email is not valid and password must be 8 characters long');
    // }

    if(credentials.password !== credentials.confirmPassword){
      return thunkAPI.rejectWithValue('Passwords do not match');
    }

    try {
      const res = await  UpdateUser(data);
      return { user: res, email:data.email};
    } catch (err: any) {
      let val:string = "";
      if(typeof err.response.data==='object'){
       Object.values(err.response.data).forEach(value => {
       console.log(value);
       val+=value+', ';
      
    });}
      const errorMessage = val.slice(0, -2);
      return thunkAPI.rejectWithValue(errorMessage || 'Signup failed');
    }
  }
);

export const signUser = createAsyncThunk(
  'auth/signUser',
  async (credentials: { username: string | undefined , email: string | undefined; password: string | undefined, confirmPassword: string| undefined }, thunkAPI) => {
    try {
      const res = await  SignUser(credentials.username,credentials.email,credentials.password);
      return { user: res, email:credentials.email};
    } catch (err: any) {
      let val:string = "";
      if(typeof err.response.data==='object'){
       Object.values(err.response.data).forEach(value => {
       console.log(value);
       val+=value+', ';
      
    });}
      const errorMessage = val.slice(0, -2);
      return thunkAPI.rejectWithValue(errorMessage || 'Signup failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.email='';
      state.isAuthenticated = false;
      state.token = null;
    },
    log:(state) =>{
      state.isAuthenticated=true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.token = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.email= action.payload.email;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.token = null;
      })
      .addCase(signUser.pending, (state) => {
        state.loading1 = true;
        state.error1 = null;
        state.token = null;
      })
      .addCase(signUser.fulfilled, (state, action) => {
        state.email= action.payload.email;
        state.isAuthenticated = true;
        state.loading1 = false;
      })
      .addCase(signUser.rejected, (state, action) => {
        state.loading1 = false;
        state.error1 = action.payload as string;
        state.token = null;
      });
  },
});
export const { logout,log} = authSlice.actions;
export default authSlice.reducer;
