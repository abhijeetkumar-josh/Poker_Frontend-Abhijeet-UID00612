import React, { useRef,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { update } from '../../store/pokerSlice'
import './Login.css';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const errorEmail = useRef<HTMLInputElement>(null);
  const errorPassword = useRef<HTMLInputElement>(null);
  const [fieldset, setFieldset] = useState<[number, number]>([0, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const Email = email.current?.value ?? "";
    const pass = password.current?.value ?? "";
    const result = await dispatch(loginUser({ email: Email, password: pass }));
    if (loginUser.fulfilled.match(result)) {
      dispatch(update(result.payload.user.data))
      navigate('/profile');
      if (email.current) email.current.value = '';
      if (password.current) password.current.value = '';
      setFieldset([0,0])
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/signup')
  };
  
  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const Email:string=email.current?.value || "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailcheck:boolean=emailRegex.test(Email || "");
    if (!emailcheck) {
      if(errorEmail.current) errorEmail.current.textContent = 'Email is not valid'
      setFieldset(prev=>[0,prev[1]])
    } 
    else{
      if(errorEmail.current) errorEmail.current.textContent = ''
      setFieldset(prev=>[1,prev[1]])
    }
  };
  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const pass:string=password.current?.value || "";
    if(pass.length<8){
      if(errorPassword.current) errorPassword.current.textContent = 'Password must be aleast 8 characters long'
      setFieldset(prev=>[prev[0],0])
    }
    else{
      if(errorPassword.current) errorPassword.current.textContent = ''
      setFieldset(prev=>[prev[0],1])
    }
  }

  const sum: number = fieldset.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (

    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="login-title">Login</h2>
      <input onInput ={handleEmail} type="text" placeholder="Email" ref={email} className="login-input" />
      <p className="login-error" ref={errorEmail}>{errorEmail.current?.value}</p>
      <input onInput = {handlePassword} type="password" placeholder="Password" ref={password} className="login-input" />
      <p className="login-error" ref={errorPassword}>{errorPassword.current?.value}</p>
      <button
        data-testid="login-Button"
        type="submit"
        className="primary--button"
        disabled={loading || sum!==2}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div >
        don't have an account? <p className="signup" onClick= {handleSignup}>Sign-up</p>
      </div>
      {error && <p className="login-error">{error}</p>}
    </form>
  );
}
export default Login;

