import React, { useRef ,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUser } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './Signup.css';

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate();
  const { loading1, error1 } = useSelector((state: RootState) => state.auth);
  const Username=useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const errorUsername=useRef<HTMLInputElement>(null);
  const errorEmail = useRef<HTMLInputElement>(null);
  const errorPassword = useRef<HTMLInputElement>(null);
  const errorConfirm = useRef<HTMLInputElement>(null);
  const [fieldset, setFieldset] = useState<[number,number,number,number]>([0,0,0,0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = Username.current?.value;
    const Email = email.current?.value;
    const pass = password.current?.value;
    const confpass= confirmPassword.current?.value;
    const result = await dispatch(signUser({ username:user , email: Email, password: pass ,confirmPassword:confpass }));
    if (signUser.fulfilled.match(result)) {
      navigate('/profile');
      if (email.current) email.current.value = '';
      if (password.current) password.current.value = '';
      setFieldset([0,0,0,0])
    }
  };

    const handleUsername = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!Username.current?.value){ 
        if(errorUsername.current) errorUsername.current.textContent = 'Username cannot be empty'
        setFieldset(prev=>[0,prev[1],prev[2],prev[3]])
      }
      else{
        if(errorUsername.current) errorUsername.current.textContent=''
        setFieldset(prev=>[1,prev[1],prev[2],prev[3]])
      }
    };

    const handleEmail = async (e: React.FormEvent) => {
      e.preventDefault();
      const Email:string=email.current?.value || "";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const emailcheck:boolean=emailRegex.test(Email || "");
      if (!emailcheck) {
        if(errorEmail.current) errorEmail.current.textContent = 'Email is not valid'
        setFieldset(prev=>[prev[0],0,prev[2],prev[3]])
      } 
      else{
        if(errorEmail.current) errorEmail.current.textContent = ''
        setFieldset(prev=>[prev[0],1,prev[2],prev[3]])
      }
    };

    const handlePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      const pass:string=password.current?.value || "";
      if(pass.length<8){
        if(errorPassword.current) errorPassword.current.textContent = 'Password must be aleast 8 characters long'
        setFieldset(prev=>[prev[0],prev[1],0,prev[3]])
      }
      else{
        if(errorPassword.current) errorPassword.current.textContent = ''
        setFieldset(prev=>[prev[0],prev[1],1,prev[3]])
      }
    };

    const handleConfirm = async (e: React.FormEvent) => {
      e.preventDefault();
      const pass:string=confirmPassword.current?.value || "";
      if(pass!==password.current?.value){
        if(errorConfirm.current) errorConfirm.current.textContent = 'Passwords do not match'
        setFieldset(prev=>[prev[0],prev[1],prev[2],0])
      }
      else {
        if(errorConfirm.current) errorConfirm.current.textContent = ''
        setFieldset(prev=>[prev[0],prev[1],prev[2],1])
      }
    };

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      navigate('/login')
    };

    const sum: number = fieldset.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="login-title">Signup</h2>
      <input onInput = {handleUsername} type="text" placeholder="Username" ref={Username} className="login-input" />
      <p className = "login-error" ref={errorUsername}>{errorUsername.current?.value}</p>
      <input onInput = {handleEmail} type="text" placeholder="Email" ref={email} className="login-input" />
      <p className="login-error" ref={errorEmail}>{errorEmail.current?.value}</p>
      <input onInput = {handlePassword} type="password" placeholder="Password" ref={password} className="login-input" />
      <p className="login-error" ref={errorPassword}>{errorPassword.current?.value}</p>
      <input onInput = {handleConfirm} type="password" placeholder="Confirm Password" ref={confirmPassword} className="login-input" />
      <p className="login-error" ref={errorConfirm}>{errorConfirm.current?.value}</p>

      <button
        type='submit' 
        className="primary--button primary--button--modifier"
        disabled={loading1 || sum!==4}
      >
        {loading1 ? 'Signing in...' : 'Signup'}
      </button>
      <div >
        Already have an account? <p className="signup" onClick= {handleLogin}>Login</p>
      </div>
      {error1 && <p className="login-error">{error1}</p>}
    </form>
  );
}

export default Signup;


