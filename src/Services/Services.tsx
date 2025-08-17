import axios from 'axios';
const PORT:number=8001;
import { pokerState } from '../store/gameSlice';
import { EditProfile } from '../screens/Profile/ProfileEdit';

function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(trimmed.substring(name.length + 1));
        cookieValue = cookieValue.replace(/"/g, ""); // in case Django sets with quotes
        break;
      }
    }
  }
  return cookieValue;
}


export const SignUser = async (username:string, email: string, password: string) => {
  const result =await axios.post(
    `http://127.0.0.1:${PORT}/api/user/signup/`,
    {
      'username' : username,
      'email':email,
      'password':password
    },
    {
      withCredentials: true,
    }
  );
  
  return result;
};

export const LoginUser = async (email: string, password: string) => {
  const result =await axios.post(
    `http://127.0.0.1:${PORT}/api/user/login/`,
    {
      'email':email,
      'password':password
    },
    {
      withCredentials: true,
    }
  );
  return result;
};

export const CreateGame = async (Info:pokerState)=>{ 
   const result=await axios.post(
    `http://127.0.0.1:${PORT}/api/profile/game/`,
    Info,
    {
      withCredentials:true,
    });
    return result;
};


export const GetSite = async (api:string,email:string)=>{ 
  const jiraEmail = import.meta.env.VITE_JIRA_EMAIL;
  const jiraApiKey = import.meta.env.VITE_JIRA_API_KEY;
  const token:string=`${jiraEmail}:${jiraApiKey}`
   const result=await axios.get(
    `https://api.atlassian.com/oauth/token/accessible-resources`,
     {
        withCredentials:true,
        headers: {
          Authorization: `Basic ${token}`,
          Accept: "application/json",
        },
      }
     );
    console.log(result)
    return result;
};

export const Filter = async (filterType:string,estimateDate:string)=>{ 
   const result=await axios.post(
    `http://127.0.0.1:${PORT}/api/ticket/filter/`,
    {
      filterType:filterType,
      estimateDate:estimateDate
    },
    {
      withCredentials:true,
      headers: {
         "X-CSRFToken": getCookie("csrftoken") || "",
      }
    });
    console.log(result.data)
    return result.data;
};

export const  VerifyEmail= async (uid:string, token:string) =>{
  const result = await axios.get(
    `http://127.0.0.1:${PORT}/api/user/verify-email/${uid}/${token}`,
  );
  console.log(result)
  return result;
};

export const UpdateUser = async (data:EditProfile)=>{ 
   const result=await axios.put(
    `http://127.0.0.1:${PORT}/api/user/edit/`,
    {
      data
    },
    {
      withCredentials:true,
    });
    console.log(result)
    return result;
};



