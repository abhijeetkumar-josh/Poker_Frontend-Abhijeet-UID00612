import './Profile.css'
import Pokerlist from "./Pokerlist";
import Grouplist from './Grouplist';
import Ticketlist from './Ticketlist';

const Profile: React.FC = () => {


  return (
    <div className="profile-container">
      <Pokerlist></Pokerlist>
      <Grouplist></Grouplist>
      <Ticketlist></Ticketlist>
    </div>
  );
};

export default Profile;
