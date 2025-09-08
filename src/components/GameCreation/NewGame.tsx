import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import "./NewGame.css";
import { submitPoker } from "../../store/gameSlice";
import { SearchUser, ValidateToken } from "../../Services/Services";
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  username: string;
  id:number
}

export interface UserInfo {
  invite:boolean,
  email:string,
  role:number;
  id:number;
  username:string;
}

const CHOICES =['Spectator','Developer','Guest','Manager']

const NewGame: React.FC = () => {
  const dispatch=useDispatch<AppDispatch>();
  const { creating, error, failed_tickets, pokerid,created} = useSelector((state: RootState) => state.game );
  const {email,token} = useSelector((state:RootState)=>state.auth);
  const gameNameRef = useRef<HTMLInputElement>(null);
  const gameDescRef = useRef<HTMLTextAreaElement>(null);
  const apiTokenRef = useRef<HTMLInputElement>(null);
  // const importTypeRef = useRef<HTMLSelectElement>(null);
  const importValueRef = useRef<HTMLInputElement>(null);
  const gameSiteRef = useRef<HTMLInputElement>(null);
  const [importType,setImportType] = useState('');
  const TicketRef = useRef<HTMLInputElement>(null);
  const TicketError = useRef<HTMLParagraphElement>(null);
  const ValidateError = useRef<HTMLParagraphElement>(null);

  const userRef = useRef<HTMLInputElement>(null);
  const [gameUsers, setGameUsers] = useState<Partial<UserInfo>[]>([]);
  const [validateToken,setValidateToken] = useState<boolean>(false);
  const [Ticketlist,setTicketList] = useState<(string|undefined)[]>([]);

  const groupNameRef = useRef<HTMLInputElement>(null);
  const groupUserRef = useRef<HTMLInputElement>(null);
  const [groupUsers, setGroupUsers] = useState<string[]>([]);

  // const emailRef = useRef<HTMLInputElement>(null);
  const [searchResult, setSearchResult] = useState<Partial<User> | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [Hide, setHide] = useState(false)
  const roleRef = useRef<HTMLSelectElement>(null)
  const [loading,setLoading] = useState(false)
  const [loading1,setLoading1] = useState(false)
  const errorEmail = useRef<HTMLInputElement>(null);
  const [first,setFirst] = useState(false)


  const handleAddGameUser = () => {
    const value = userRef.current?.value.trim();
    const role:number = +((roleRef.current?.value.trim()) || "0");
    if (value && !gameUsers.includes({invite:false,email:value,role:role,id:searchResult!.id})) {
      setGameUsers([...gameUsers, {invite:false,email:value,role:role,id:searchResult!.id}]);
      setHide(true)
      if (userRef.current) userRef.current.value = "";
      if (roleRef.current) roleRef.current.value = "";
    }
  };

  const handleAddGroupUser = () => {
    const value = groupUserRef.current?.value.trim();
    if (value && !groupUsers.includes(value)) {
      setGroupUsers([...groupUsers, value]);
      if (groupUserRef.current) groupUserRef.current.value = "";
    }
  };

  const handleSearchUser =  async () => {
    const email = userRef.current?.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailcheck:boolean=emailRegex.test(email|| "");
    if (!emailcheck) {
      return ;
    }
    if (!email) return;
    try {
      setLoading1(true)
      const res = await SearchUser(email,token)
      if (res.status === 200) {
        setSearchResult({ email: res.data.email,username:res.data.username,id:res.data.id});
        setNotFound(false);
        setHide(false)
      } else {
        // setSearchResult({});
        setSearchResult(null);
        setNotFound(true);
        setHide(false)
      }
      setLoading1(false)
    } catch {
      setSearchResult(null);
      setNotFound(true);
      setHide(false)
    }
  };

  const handleDelete = (email: string) => {
    setGameUsers((prev) => prev.filter((u) => u.email !== email));
  };

  const handleTicketDelete = (ticketId:string) => {
     setTicketList((prev) => prev.filter((u) => u !== ticketId));
  }

  const handleInvite = () => {
    const value = userRef.current?.value.trim();
    const role:number = +((roleRef.current?.value.trim()) || "0");
    if (value && !gameUsers.includes({invite:true,email:value,role:role})) {
      setGameUsers([...gameUsers, {invite:true,email:value,role:role}]);
      setHide(true)
      if (userRef.current) userRef.current.value = "";
      if (roleRef.current) roleRef.current.value = "";
    }
  };

  const handleApiValidation = async () => {
    setLoading(true)
    const result = await ValidateToken(apiTokenRef.current?.value || "",gameSiteRef.current?.value || "",token) 
    if(result.status===200){
      setValidateToken(true)
      if(ValidateError.current) ValidateError.current.textContent=''
    }
    else{
      if(ValidateError.current) ValidateError.current.textContent='Invalid Credentials'
    }
    setLoading(false)
  };

  const handleSubmit = async () => {
    // setTicketList([])
    const gameData = {
      email:email,
      game_name: gameNameRef.current?.value || "",
      game_description: gameDescRef.current?.value || "",
      cloudsite:gameSiteRef.current?.value || "",
      apikey: apiTokenRef.current?.value || "",
      import_type: importType || "",
      import_value: importValueRef.current?.value || "",
      users:gameUsers,
      group: {
        name: groupNameRef.current?.value || "",
        users: groupUsers,
      },
      creating:true,
      error:'',
      tickets:Ticketlist,
      pokerid:pokerid,
      token:token
    };
    dispatch(submitPoker(gameData));
    setFirst(true)
  };

  const handleTicketAdd =async () => {
    const newValue = TicketRef.current?.value.trim()||'';
    if (!newValue) return ;
    if(!validateToken && TicketError.current){
      TicketError.current.textContent='First validate token'
      return ;
    }
      setTicketList((prev) => {
         if (prev.includes(newValue)) {
           return prev;
         }
         return [...prev, newValue];
      });
      if(TicketError.current) TicketError.current.textContent=''
  };


    const handleEmail = async (e: React.FormEvent) => {
      e.preventDefault();
      const Email:string=userRef.current?.value || "";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const emailcheck:boolean=emailRegex.test(Email || "");
      if (!emailcheck) {
        if(errorEmail.current) errorEmail.current.textContent = 'Email is not valid'
      } 
      else{
        if(errorEmail.current) errorEmail.current.textContent = ''
      }
    };

  return (
    <div className="new-game-container">
      <h2>Create New Game</h2>
      
      <div className="border-boxing">
      <div className="form-group">
        <label>Game Name</label>
        <input ref={gameNameRef} type="text" placeholder="Enter game name" />
      </div>

      <div className="form-group">
        <label>Game Description</label>
        <textarea
          ref={gameDescRef}
          placeholder="Enter game description"
        ></textarea>
      </div>
      </div>
      
      <div className="border-boxing">
      <div className="form-group">
        <label>Cloud Site</label>
        <input ref={gameSiteRef} type="text" placeholder="Enter jira cloud site" />
      </div>

      <div className="form-group">
        <label>API Token</label>
        <div className="inline-input">
        <input ref={apiTokenRef} type="text" placeholder="Enter API Token" />
        <button className={validateToken?'disable':''} disabled={loading} type="button" onClick={handleApiValidation}>{loading?'Validating':validateToken?'Validated':'Validate'}</button>
        {/* {ErrorType=='validate'?Error:null} */}
        </div>
        <p ref={ValidateError} className="login-error"></p>
      </div>
      </div>

      <div className='border-boxing'>
      <div className="form-group">
        <label>Import</label>
        <select value={importType} onChange={(event)=>setImportType(event.target.value)}>
          <option value="">Select Import Type</option>
          <option value="tickets">Tickets</option>
          <option value="sprintId">Sprint ID</option>
          <option value="jql">JQL</option>
        </select>
        { importType==='tickets' ? (
          <div className="form-group">
            <div className="inline-input">
              <input ref={TicketRef} type="text" placeholder="Enter TicketId" />
              <button onClick={handleTicketAdd}>Add Ticket</button>
            </div>
              <div className="game-users-container">
                <table className="game-users-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th className="action-col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Ticketlist.map((u, i) => (
                      <tr key={i}>
                        <td>{u}</td>
                        <td className="delete-cell">
                          <button
                            className="primary--button--modifier"
                            onClick={() => handleTicketDelete(u || "")}
                            aria-label="Delete Ticket"
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className='flex--center'>{Ticketlist.length==0?'No Tickets Added':null}</p>
              </div>
            <p ref={TicketError} className="login-error"></p>
            {failed_tickets && failed_tickets.length>0 &&
            <>
            <h2>Incorrect TicketId's</h2>
            {/* <div className="tag-container">
              {failed_tickets.map((u, i) => (
                <span key={i} className="tag">
                  {u}
                </span>
              ))} */}
              <div className="game-users-container">
                <table className="game-users-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failed_tickets.map((u, i) => (
                      <tr key={i}>
                        <td>{u}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className='flex--center'>{failed_tickets.length==0?'No failed Tickets':null}</p>
              {/* </div> */}
            </div>
            </>
            }
          </div>
        ) : (
          <input
            ref={importValueRef}
            type="text"
            placeholder="Enter value for selected import type"
          />
        )}
      </div>
      </div>

      <div className="border-boxing">
      <div className="form-group">
        <label>Add Users to Game</label>
        <div className="inline-input">
          <input
            onInput={handleEmail}
            ref={userRef}
            type="text"
            placeholder="Enter user email"
          />
          <button className={loading1?'disable':''} onInput = {handleEmail} type="button" onClick={handleSearchUser}>
            {loading1?'Searching':'Search'}
          </button>
          </div>
          <p className="login-error" ref={errorEmail}>{errorEmail.current?.value}</p>
          {!Hide && searchResult && (
            <div className="result-box">
              <span>{searchResult.email} </span>
              <select className="adduser-select" ref={roleRef}>
                <option value="">Select Role</option>
                <option value="0">Spectator</option>
                <option value="1">Developer</option>
                <option value="2">Guest</option>
                <option value="3">Manager</option>
              </select>
              <button onClick={handleAddGameUser}>
                Add User
              </button>
            </div>
          )}

          {!Hide && notFound && (
            <div className="result-box">
              <span>{userRef.current?.value} </span>
              <select className="adduser-select" ref={roleRef}>
                <option value="">Select Role</option>
                <option value="0">Spectator</option>
                <option value="1">Developer</option>
                <option value="2">Guest</option>
                <option value="3">Manager</option>
              </select>
              <button onClick={handleInvite}>Invite</button>
            </div>
          )}
          <div className="game-users-container">
            <table className="game-users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th className="action-col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {gameUsers.map((u, i) => (
                  <tr key={i}>
                    <td>{u.email}</td>
                    <td>{u.invite?'Invited':'Added'}</td>
                    <td>{CHOICES[+(u.role || '0')]}</td>
                    <td className="delete-cell">
                      <button
                        className="primary--button--modifier"
                        onClick={() => handleDelete(u.email || "")}
                        aria-label="Delete user"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className='flex--center'>{gameUsers.length==0?'No Users Added':null}</p>
          </div>
        </div>
        </div>

        {/* <div className="border-boxing">
          <h3>Create Group</h3>
          <div className="form-group">
            <label>Group Name</label>
            <input ref={groupNameRef} type="text" placeholder="Enter group name" />
          </div> */}
    
          {/* <div className="form-group">
            <label>Add Users to Group</label>
            <div className="inline-input">
              <input
                ref={groupUserRef}
                type="text"
                placeholder="Enter group user email"
              />
              <button type="button" onClick={handleAddGroupUser}>
                Add User
              </button>
            </div>
            <div className="tag-container">
              {groupUsers.map((u, i) => (
                <span key={i} className="tag">
                  {u}
                </span>
              ))}
            </div>
          </div> */}
          {/* </div> */}
          {/* Submit */}
          <div className="form-actions">
            <button className={( gameUsers.length<=0 || !validateToken || !gameNameRef.current?.value || !gameDescRef.current?.value?'disable--blue':'')} type="button" onClick={handleSubmit} disabled={ !validateToken || !gameNameRef.current?.value || !gameDescRef.current?.value}>
              {created?'Game Created':creating ? 'Creating' :'Create Game'}
            </button>
          </div>
          {first && error && <p className="form-error flex--center">{error}</p>}
        </div>
  );
};

export default NewGame;
