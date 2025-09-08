import React, { useRef ,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { SignUser } from '../../Services/Services';
import './Login.css';
import './Signup.css';

const Signup: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate();
  // const { loading1, error1 } = useSelector((state: RootState) => state.auth);
  const Username=useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const errorUsername=useRef<HTMLInputElement>(null);
  const errorEmail = useRef<HTMLInputElement>(null);
  const errorPassword = useRef<HTMLInputElement>(null);
  const errorConfirm = useRef<HTMLInputElement>(null);
  const [fieldset, setFieldset] = useState<[number,number,number,number]>([0,0,0,0]);
  const [loading,setLoading]= useState(false)
  const [error,setError] = useState("")
  const [first,setFirst] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    const user = Username.current?.value || "";
    const Email = email.current?.value || "";
    const pass = password.current?.value || "";
    const confpass= confirmPassword.current?.value || "";
    const result = await SignUser( user , Email,pass ,confpass );
    setFirst(true)
    setLoading(false)
    if(result?.status==400){
         let flag:boolean=false;
         if(result.data.email){
          flag=true
          if(errorEmail.current) errorEmail.current.textContent = result.data.email
         }
         if(result.data.password){
          flag=true
          if(errorPassword.current) errorPassword.current.textContent = result.data.password
         } 
         if(result.data.username){
          flag=true
          if(errorUsername.current) errorUsername.current.textContent = result.data.username
         } 
         console.log(flag)
         if(!flag){
          setError('Signup failed Try again')
         }

    }
    
    if(result?.status==201){
      navigate('/SignupSuccessfull');
      if (email.current) email.current.value = '';
      if (password.current) password.current.value = '';
      if (Username.current) Username.current.value = '';
      if (confirmPassword.current) confirmPassword.current.value = '';
      setFieldset([0,0,0,0])
    }
  };

    const handleUsername = async (e: React.FormEvent) => {
      e.preventDefault();
      if(error) setError('')
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
      if(error) setError('')
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
      if(error) setError('')
      const pass:string=password.current?.value || "";
      const conf:string=confirmPassword.current?.value || "";
      if(pass==conf){
        if(errorConfirm.current) errorConfirm.current.textContent = ''
        setFieldset(prev=>[prev[0],prev[1],prev[2],1])
      }
      else{
        if(conf!='' && errorConfirm.current){
          errorConfirm.current.textContent = 'Passwords do not match'
          setFieldset(prev=>[prev[0],prev[1],prev[2],0])
        }
      }
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
      if(error) setError('')
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
      <img
        src="src/assets/jtg_logo.png" 
        alt="Company Logo"
        className="nav-logo"
      />
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
        className={(loading|| sum!==4)?"primary--button primary--button--modifier disable":"primary--button primary--button--modifier"}
      >
        {loading ? 'Signing in...' : 'Signup'}
      </button>
      <div >
        Already have an account? <p className="signup" onClick= {handleLogin}>Login</p>
      </div>
      {first && error && <p className="login-error">{error}</p>}
    </form>
  );
}

export default Signup;


