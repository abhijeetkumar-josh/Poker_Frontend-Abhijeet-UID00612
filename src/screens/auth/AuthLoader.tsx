import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UpdateAuth ,UpdateAuthFlag} from "../../store/authSlice";
import { UserDetails } from "../../Services/Services";
import { update } from "../../store/pokerSlice";
import {AppDispatch } from '../../store/store';

const AuthLoader = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response =await UserDetails();
        dispatch(update(response))
        dispatch(UpdateAuth(response))
      } catch {
        dispatch(
          UpdateAuthFlag()
        );
      }finally {
      dispatch(UpdateAuthFlag()); 
    }
    };

    fetchProfile();
  }, [dispatch]);

  return null; 
};

export default AuthLoader;
