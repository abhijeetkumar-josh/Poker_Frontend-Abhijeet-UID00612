import './Profile.css'
import Pokerlist from "./Pokerlist";
import Grouplist from './Grouplist';
import Ticketlist from './Ticketlist';
import { useEffect ,useState} from 'react';
import { UserDetails } from '../../Services/Services';
import { useSelector ,useDispatch} from 'react-redux';
import { RootState,AppDispatch } from '../../store/store';
import { update } from '../../store/pokerSlice';
import { UpdateAuth,UpdateAuthFlag } from '../../store/authSlice';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'



const Profile: React.FC = () => {
  const {token,username} = useSelector((state:RootState)=>state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const [loading,setLoading] = useState(false)


  useEffect(() => {
    setLoading(true)
    const Initial = async () => {
      const result =await  UserDetails()
      dispatch(update(result))
      setLoading(false)
    };
    Initial()
  }, [token,dispatch]);

  return (
    loading ? <Skeleton height={30}  count={10} /> :<div className="profile-container">
      <h2>Welcome, {username}</h2>
      <Pokerlist></Pokerlist>
      <Grouplist></Grouplist>
      <Ticketlist></Ticketlist>
    </div>
  );
};

export default Profile;
