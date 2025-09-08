import { useEffect} from "react";
import { useNavigate,useParams} from "react-router-dom";
import { VerifyEmail } from "../../Services/Services";
import {useDispatch} from 'react-redux';
import { AppDispatch } from '../../store/store'
import {log} from "../../store/authSlice"
// import { update } from "../../store/pokerSlice";

export default function EmailCheck() {
  const navigate = useNavigate();
  const {token}=useParams();
  const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const checkemail = async () => {
        //   setLoading(true);
          try {
            if (!token) return navigate("/failed", { replace:true } );
            const result = await VerifyEmail(token)
            if(result.status===200){
              // dispatch(log())
              return navigate("/profile", { replace:true })
            }
            else {
              return navigate("/failed", { replace: true })
            }
          } catch {
            return navigate("/failed", { replace: true });
          } finally {
            // setLoading(false);
          }
        };
        checkemail();
      },[dispatch,navigate,token]);

  return(
      <>
       <h1>Please wait , verifying the email...</h1>
      </>
  ); 
};

