import { useEffect} from "react";
import { useNavigate,useParams} from "react-router-dom";
import { VerifyEmail } from "../../Services/Services";
import {useDispatch} from 'react-redux';
import { AppDispatch } from '../../store/store'
import {log} from "../../store/authSlice"

export default function EmailCheck() {
  const navigate = useNavigate();
  const {uid,token}=useParams();
  const dispatch = useDispatch<AppDispatch>();
  dispatch(log())
    useEffect(() => {
        const checkemail = async () => {
        //   setLoading(true);
          try {
            console.log(uid)
            console.log(token)
            if (!uid || !token) return navigate("/failed", { replace:true } );
            const result = await VerifyEmail(uid,token)
            if(result.status===200){
              dispatch(log())
              return navigate("/profile", { replace:true })
            }
          } catch(err) {
            console.log(err)
            return navigate("/failed", { replace: true });
          } finally {
            // setLoading(false);
          }
        };
        checkemail();
      },[dispatch,navigate,token,uid]);

  return(
      <>
       <h1>Please wait , verifying the email...</h1>
      </>
  ); 
};

