// import axios from 'axios';

// const PORT:number=8000

// const PATH:string='127.0.0.1'
// import { pokerState } from '../store/gameSlice';
// import { EditProfile } from '../screens/Profile/ProfileEdit';
// import JSEncrypt from "jsencrypt";


// type ValidationErrorResponse = {
//   email?: string[];
//   password?: string[];
//   username?: string[];
// };

// const csrftoken = document.cookie
//   .split("; ")
//   .find(row => row.startsWith("csrftoken="))
//   ?.split("=")[1];


// async function loadPublicKey() {
//   const res = await fetch("/public.pem");
//   const key = await res.text();
//   return key;
// }


// const encryptor = new JSEncrypt();
// const key:string =await loadPublicKey();
// encryptor.setPublicKey(key);


// export const SignUser = async (username:string, email: string, password: string,confirm_password:string) => {
//     const encrypted = encryptor.encrypt(JSON.stringify({
//       'username' : username,
//       'email':email,
//       'password':password,
//       'confirm_password':confirm_password
//     }));
//   try{
//     const result =await axios.post(
//     `http://${PATH}:${PORT}/api/user/signup/`,
//     // {
//     //   'username' : username,
//     //   'email':email,
//     //   'password':password,
//     //   'confirm_password':confirm_password
//     // },
//     {
//       credentials:encrypted
//     },
//     {
//       withCredentials: true,
//     }
//   )
//   return {data:result, status: result.status };
// }catch (err: any) {
//     if (axios.isAxiosError(err)) {
//       const errors = err.response?.data as ValidationErrorResponse;
//       if (err.response) {
//         return {data:errors, status: err.response.status };
//       } else if (err.request) {
//         return { data: { error: 'No response from server' }, status: 404 };
//       } else {
//         return { data: { error: err.message }, status: 404 };
//     }
//   }
// }};

// export const LoginUser = async (email: string, password: string) => {
//   const encrypted = encryptor.encrypt(JSON.stringify({
//       'email':email,
//       'password':password
//     }));
//    console.log(encrypted)
//   const result =await axios.post(
//     `http://${PATH}:${PORT}/api/user/login/`,
//     {
//       credentials:encrypted
//     },
//     {
//       withCredentials: true,
//     }
//   );
//   // axios.defaults.withCredentials = true;
//   // axios.defaults.headers.common["X-CSRFToken"] = getCSRFToken();
//   return result;
// };

// export const CreateGame = async (Info:Partial<pokerState>,token:string|undefined)=>{ 
//    const result=await axios.post(
//     `http://${PATH}:${PORT}/api/profile/game/`,
//     Info,
//     {
//       headers: {
//           Authorization: `Token ${token}`,
//         },
//     });
//     return result;
// };

// export const Filter = async (filterType:string,estimateDate:string,token:string|null)=>{ 
//    const result=await axios.post(
//     `http://${PATH}:${PORT}/api/ticket/filter/`,
//     {
//       filterType:filterType,
//       estimateDate:estimateDate?estimateDate:null
//     },
//     {
//       headers: {
//           Authorization: `Token ${token}`,
//         },
//     }
//     );
//     return result.data;
// };

// export const  VerifyEmail= async (token:string) =>{
//   const result = await axios.get(
//     `http://{PATH}:${PORT}/api/user/verify-email/${token}`,
//   );
//   return result;
// };

// export const UpdateUser = async (data:EditProfile)=>{ 
//    const result=await axios.put(
//     `http://${PATH}:${PORT}/api/user/edit/`,
//     {
//       data
//     },
//     {
//       withCredentials: true,
//       headers: {
//         "X-CSRFToken": csrftoken || "",
//       },
//     });
//     // console.log(result.status!=200) 
//     return result;
// };

// export const ValidateToken = async (apikey:string,cloudsite:string,token:string)=>{ 
//   console.log(token)
//   try{
//    const result=await axios.post(
//     `http://${PATH}:${PORT}/api/profile/validate/`,
//       {
//         apikey:apikey,
//         cloudsite:cloudsite,
//       },
//       {
//       headers: {
//           Authorization: `Token ${token}`,
//         },
//       }
//      );
//      return { data: result.data, status: result.status };
//   }catch (err: any) {
//     if (err.response) {
//       console.log(err)
//       return { data: err.response.data, status: err.response.status };
//     } else if (err.request) {
//       return { data: { error: 'No response from server' }, status: 0 };
//     } else {
//       return { data: { error: err.message }, status: 0 };
//     }
//   }
// };

// export const SearchUser = async (email:string,token:string)=>{ 
//   try {
//    const result=await axios.get(
//     `http://${PATH}:${PORT}/api/user/search?email=${encodeURIComponent(email)}`,
//     {
//       headers: {
//         Authorization: `Token ${token}`,
//       }
//     });
//     return {data:result.data,status:result.status};
//   }catch(err:any) {
//     if (err.response) {
//       return { data: err.response.data, status: err.response.status };
//     } else if (err.request) {
//       return { data: { error: 'No response from server' }, status: 404 };
//     } else {
//       return { data: { error: err.message }, status: 404 };
//     }
//   }
// };

// export const AcceptInvitation = async (pokerid:number,token:string|null)=>{ 
//   try{
//    const result=await axios.post(
//     `http://${PATH}:${PORT}/api/invite/accept/${pokerid}/`,
//     {},
//     {
//       headers: {
//           Authorization: `Token ${token}`,
//         },
//     }
//      );
//      return { data: result.data, status: result.status };
//   }catch (err: any) {
//     if (err.response) {
//       return { data: err.response.data, status: err.response.status };
//     } else if (err.request) {
//       return { data: { error: 'No response from server' }, status: 404 };
//     } else {
//       return { data: { error: err.message }, status: 404 };
//     }
//   }
// };


// export const UserDetails = async (token:string|null)=>{ 
//    const result=await axios.get(
//     `http://${PATH}:${PORT}/api/profile/`,
//     {
//       headers: {
//           Authorization: `Token ${token}`,
//         },
//     });
//     return result.data;
// };

// // export const get_public_key = async ()=>{ 
// //   const result = await axios.get(`http://${PATH}:${PORT}/api/user/publickey`);
// //   console.log(result)
// //   localStorage.setItem('public_key',result.data.public_key)
// //   return result.data;

// // };

// export const ManagerEstimate = async (ticketid:number,estimate:number,timer:number,email:string,token:string|null)=>{ 
//   try{
//    const result=await axios.patch(
//     `http://${PATH}:${PORT}/api/ticket/ticket/${ticketid}/`,
//     {
//       finalEstimate:estimate,
//       timer:timer,
//       email:email
//     },
//     {
//       headers: {
//           Authorization: `Token ${token}`,
//         },
//     }
//      );
//      return { data: result.data, status: result.status };
//   }catch (err: any) {
//     if (err.response) {
//       return { data: err.response.data, status: err.response.status };
//     } else if (err.request) {
//       return { data: { error: 'No response from server' }, status: 404 };
//     } else {
//       return { data: { error: err.message }, status: 404 };
//     }
//   }
// };

// export const MemberEstimate = async (estimateid:number,estimate:number,email:string,token:string|null)=>{ 
//   try{
//    const result=await axios.patch(
//     `http://${PATH}:${PORT}/api/ticket/estimate/${estimateid}/`,
//     {
//       estimate:estimate,
//       email:email
//     },
//     {
//       headers: {
//           Authorization: `Token ${token}`,
//         },
//     }
//      );
//      return { data: result.data, status: result.status };
//   }catch (err: any) {
//     if (err.response) {
//       return { data: err.response.data, status: err.response.status };
//     } else if (err.request) {
//       return { data: { error: 'No response from server' }, status: 404 };
//     } else {
//       return { data: { error: err.message }, status: 404 };
//     }
//   }
// };

// export const AddComment = async (pokerid:number,body:string|undefined,key:string,email:string,token:string|null)=>{ 
//   try{
//    const result=await axios.post(
//     `http://${PATH}:${PORT}/api/ticket/comment/`,
//     {
//       pokerid:pokerid,
//       body:body,
//       key:key,
//       email:email,
//     },
//     {
//       headers: {
//           Authorization: `Token ${token}`,
//         },
//     }
//      );
//      return { data: result.data, status: result.status };
//   }catch (err: any) {
//     if (err.response) {
//       return { data:err.response.data, status: err.response.status };
//     } else if (err.request) {
//       return { data:'No response from server', status: 404 };
//     } else {
//       return { data:err.message, status: 404 };
//     }
//   }
// };











// ------------------------------------------------------------------------

import axios from 'axios';

const PORT:number=8001

const PATH:string='127.0.0.1'
import { pokerState } from '../store/gameSlice';
import { EditProfile } from '../screens/Profile/ProfileEdit';
import JSEncrypt from "jsencrypt";
import Cookies from "js-cookie";


type ValidationErrorResponse = {
  email?: string[];
  password?: string[];
  username?: string[];
};

const csrftoken = document.cookie
  .split("; ")
  .find(row => row.startsWith("csrftoken="))
  ?.split("=")[1];


export const loadPublicKey=async() =>{
  const res = await fetch('public.pem');
  const key = await res.text();
  return key;
}


const encryptor = new JSEncrypt();
const key:string =await loadPublicKey();
encryptor.setPublicKey(key);


export const SignUser = async (username:string, email: string, password: string,confirm_password:string) => {
    const encrypted = encryptor.encrypt(JSON.stringify({
      'username' : username,
      'email':email,
      'password':password,
      'confirm_password':confirm_password
    }));
  try{
    const result =await axios.post(
    `http://${PATH}:${PORT}/api/user/signup/`,
    // {
    //   'username' : username,
    //   'email':email,
    //   'password':password,
    //   'confirm_password':confirm_password
    // },
    {
      credentials:encrypted
    },
    {
      withCredentials: true,
    }
  )
  return {data:result, status: result.status };
}catch (err: any) {
    if (axios.isAxiosError(err)) {
      const errors = err.response?.data as ValidationErrorResponse;
      if (err.response) {
        return {data:errors, status: err.response.status };
      } else if (err.request) {
        return { data: { error: 'No response from server' }, status: 404 };
      } else {
        return { data: { error: err.message }, status: 404 };
    }
  }
}};

export const LoginUser = async (email: string, password: string) => {
  const encrypted = encryptor.encrypt(JSON.stringify({
      'email':email,
      'password':password
    }));
   console.log(encrypted)
  const result =await axios.post(
    `http://${PATH}:${PORT}/api/user/login/`,
    {
      credentials:encrypted
    },
    {
      withCredentials: true,
    }
  );
  // axios.defaults.withCredentials = true;
  // axios.defaults.headers.common["X-CSRFToken"] = getCSRFToken();
  return result;
};

export const CreateGame = async (Info:Partial<pokerState>,token:string|undefined)=>{ 
   const result=await axios.post(
    `http://${PATH}:${PORT}/api/profile/game/`,
    Info,
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    });
    return result;
};

export const Filter = async (filterType:string,estimateDate:string)=>{ 
   const result=await axios.post(
    `http://${PATH}:${PORT}/api/ticket/filter/`,
    {
      filterType:filterType,
      estimateDate:estimateDate?estimateDate:null
    },
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    }
    );
    return result.data;
};

export const  VerifyEmail= async (token:string) =>{
  const result = await axios.get(
    `http://${PATH}:${PORT}/api/user/verify-email/${token}`,
  );
  return result;
};

export const UpdateUser = async (data:EditProfile)=>{ 
   const result=await axios.put(
    `http://${PATH}:${PORT}/api/user/edit/`,
    {
      data
    },
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    });
    // console.log(result.status!=200) 
    return result;
};

export const ValidateToken = async (apikey:string,cloudsite:string,token:string)=>{ 
  console.log(token)
  try{
   const result=await axios.post(
    `http://${PATH}:${PORT}/api/profile/validate/`,
      {
        apikey:apikey,
        cloudsite:cloudsite,
      },
      {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    }
     );
     return { data: result.data, status: result.status };
  }catch (err: any) {
    if (err.response) {
      console.log(err)
      return { data: err.response.data, status: err.response.status };
    } else if (err.request) {
      return { data: { error: 'No response from server' }, status: 0 };
    } else {
      return { data: { error: err.message }, status: 0 };
    }
  }
};


export const SearchUser = async (email:string,token:string)=>{ 
  try {
   const result=await axios.get(
    `http://${PATH}:${PORT}/api/user/search?email=${encodeURIComponent(email)}`,
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    });
    return {data:result.data,status:result.status};
  }catch(err:any) {
    if (err.response) {
      return { data: err.response.data, status: err.response.status };
    } else if (err.request) {
      return { data: { error: 'No response from server' }, status: 404 };
    } else {
      return { data: { error: err.message }, status: 404 };
    }
  }
};


export const AcceptInvitation = async (pokerid:number,token:string|null)=>{ 
  try{
   const result=await axios.post(
    `http://${PATH}:${PORT}/api/invite/accept/${pokerid}/`,
    {},
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    }
     );
     return { data: result.data, status: result.status };
  }catch (err: any) {
    if (err.response) {
      return { data: err.response.data, status: err.response.status };
    } else if (err.request) {
      return { data: { error: 'No response from server' }, status: 404 };
    } else {
      return { data: { error: err.message }, status: 404 };
    }
  }
};


export const UserDetails = async ()=>{ 
   const result=await axios.get(
    `http://${PATH}:${PORT}/api/profile/`,
    {
      withCredentials: true,
    });
    console.log(result)
    return result.data;
};

// export const get_public_key = async ()=>{ 
//   const result = await axios.get(`http://${PATH}:${PORT}/api/user/publickey`);
//   console.log(result)
//   localStorage.setItem('public_key',result.data.public_key)
//   return result.data;
// };

export const ManagerEstimate = async (estimateid:number,estimate:number,timer:number)=>{ 
  try{
   const result=await axios.patch(
    `http://${PATH}:${PORT}/api/ticket/estimate/${estimateid}/`,
    {
      estimate:estimate,
      timer:timer,
    },
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    }
     );
     return { data: result.data, status: result.status };
  }catch (err: any) {
    if (err.response) {
      return { data: err.response.data, status: err.response.status };
    } else if (err.request) {
      return { data: { error: 'No response from server' }, status: 404 };
    } else {
      return { data: { error: err.message }, status: 404 };
    }
  }
};

export const MemberEstimate = async (estimateid:number,estimate:number)=>{ 
  try{
   const result=await axios.patch(
    `http://${PATH}:${PORT}/api/ticket/estimate/${estimateid}/`,
    {
      estimate:estimate,
    },
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    }
     );
     return { data: result.data, status: result.status };
  }catch (err: any) {
    if (err.response) {
      return { data: err.response.data, status: err.response.status };
    } else if (err.request) {
      return { data: { error: 'No response from server' }, status: 404 };
    } else {
      return { data: { error: err.message }, status: 404 };
    }
  }
};

export const AddComment = async (pokerid:number,body:string|undefined,key:string,email:string,token:string|null)=>{ 
  try{
   const result=await axios.post(
    `http://${PATH}:${PORT}/api/ticket/comment/`,
    {
      pokerid:pokerid,
      body:body,
      key:key,
      email:email,
    },
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    }
     );
     return { data: result.data, status: result.status };
  }catch (err: any) {
    if (err.response) {
      return { data:err.response.data, status: err.response.status };
    } else if (err.request) {
      return { data:'No response from server', status: 404 };
    } else {
      return { data:err.message, status: 404 };
    }
  }
};



export const HandleLogout = async ()=>{ 
  try{
   const result=await axios.post(
    `http://${PATH}:${PORT}/api/user/logout/`,
    {
    },
    {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    }
     );
     return { data: result.data, status: result.status };
  }catch (err: any) {
    if (err.response) {
      return { data:err.response.data, status: err.response.status };
    } else if (err.request) {
      return { data:'No response from server', status: 404 };
    } else {
      return { data:err.message, status: 404 };
    }
  }
};

export const AddEstimate = async (pokerid:number,email:string,estimate:number,key:string)=>{ 
  try{
   const result=await axios.post(
    `http://${PATH}:${PORT}/api/ticket/add/`,
    {
      estimate:estimate,
      pokerid:pokerid,
      email:email,
      issue_key:key,
    },
     {
      withCredentials: true,
      headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
      },
    }
     );
     return { data: result.data, status: result.status };
  }catch (err: any) {
    if (err.response) {
      return { data: err.response.data, status: err.response.status };
    } else if (err.request) {
      return { data: { error: 'No response from server' }, status: 404 };
    } else {
      return { data: { error: err.message }, status: 404 };
    }
  }
};


