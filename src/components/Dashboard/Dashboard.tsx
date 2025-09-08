import './Dashboard.css'
import '../GameCreation/NewGame.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from 'react-redux';
import { AcceptInvitation } from '../../Services/Services';
import { AppDispatch } from '../../store/store';
import { updatePoker } from '../../store/pokerSlice';


const perPage = 10
const CHOICES:string[] = ['Spectator','Developer','Guest','Manager']
let lst1:number[]=[];
let lst2:number[]=[];
let currentPokerType:string=''

const Dashboard = () => {
    const [pokerboardPage,setPokerboardPage] = useState(0)
    const [invitationPage,setInvitationPage] = useState(0)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const {pokers} = useSelector((state:RootState)=>state.poker)
    const {token} = useSelector((state:RootState)=>state.auth)
    const [pokerboard,setPokerboard] = useState<number[]>([])
    const [invitation,setInvitation] = useState<number[]>([])
    const totalPokerboardPages = Math.ceil(pokerboard.length/perPage)
    const totalInvitationPages = Math.ceil(invitation.length/perPage)
    const [pokerFilterType,setPokerFilterType] = useState(currentPokerType || '')
    const [invitationFilterType,setInvitationFilterType] = useState('')

    useEffect(() => {
      const Initial = async () => {
        lst1=[];
        lst2=[];
        pokers.map((key,index)=> {
           if(key.accept){
            lst1.push(index)
           }
           else{
            lst2.push(index)
           }
         })
         if(currentPokerType) handlePokerFilter()
         else setPokerboard(lst1)
         setInvitation(lst2)
      };
      Initial()
  
    }, [pokers]);

    const handleAccept = async (u:number)=>{
        const result = await AcceptInvitation(pokers[u].id,token)
        if(result.status==200){
            dispatch(updatePoker(u))
        }
    }

    const handlePokerLink = (index:number,role:number)=>{
       navigate(`/poker/${index}/${role}`)
    }

    const handlePokerFilter = ()=>{
      if(pokerFilterType=='') return;
      setPokerboard(lst1)
      setPokerboardPage(0)
      currentPokerType=pokerFilterType
      setPokerboard(prev=>prev.filter((u)=>pokers[u].role ===(+pokerFilterType)))
    }

    const handleInvitationFilter = ()=>{
      if(invitationFilterType=='') return;
      setInvitationPage(0)
      setInvitation(lst2)
      setInvitation(prev=>prev.filter((u)=>pokers[u].role ===(+invitationFilterType)))
    }
   
    const handleRemovePokerFilter = ()=>{
      setPokerFilterType('')
      setPokerboard(lst1)
    }

    const handleRemoveInvitationFilter = ()=>{
      setInvitationFilterType('')
      setInvitation(lst2)
    }
    

    return (
      <>
      <div className='border-boxing'>
        <div className='flex--spaced'>
          <h2>Your Pokerboard's</h2>
          <div>
            <select  className="adduser-select"  value={pokerFilterType} onChange={(event)=>setPokerFilterType(event.target.value)}>
              <option value="">Select Role</option>
              <option value="0">Spectator</option>
              <option value="1">Developer</option>
              <option value="2">Guest</option>
              <option value="3">Manager</option>
              {/* <option value="default">Remove filters</option> */}
            </select>
            <button className ='margin-lr10' onClick={handlePokerFilter}>filter</button>
            {pokerFilterType!='' && <button className ='margin-lr10' onClick={handleRemovePokerFilter}>Remove filter</button>}
          </div>
        </div>
        <div className="game-users-container">
              <table className="game-users-table">
                <thead>
                  <tr>
                    <th>Game Summary</th>
                    <th>Game Description</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    pokerboard.slice(
                        perPage*pokerboardPage,
                        pokerboardPage*perPage+((pokerboardPage!==totalPokerboardPages)?perPage:pokerboard.length%perPage)

                    )
                    .map((key,index)=>(
                        <tr className='cursor' onClick={()=>handlePokerLink(pokers[key].pokerid,pokers[key].role)} key={index}>
                        <td>{pokers[key].game_name}</td>
                        <td>{pokers[key].game_description}</td>
                        <td>{CHOICES[pokers[key].role]}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
              {pokerboard.length==0?(<p className='flex--center'>'You are not participating in any pokerboard'</p>):null}
              {(totalPokerboardPages!==1 && pokerboard.length!==0)?<div className="button--container flex--center">
                <button  className={ (pokerboardPage=== 0)? "primary--button disable" : "primary--button"}  onClick={()=>setPokerboardPage(pokerboardPage-1)} >
                  {'<'}
                </button>
                <button  className={pokerboardPage === totalPokerboardPages-1 ? "primary--button disable" : "primary--button"}  onClick={()=>setPokerboardPage(pokerboardPage+1)}>
                  {'>'}
                </button>
               </div>:null}
            </div>
      </div>
      <div className='border-boxing'>
        <div className='flex--spaced'>
          <h2>Invitations</h2>
          <div>
            <select  className="adduser-select"  value={invitationFilterType} onChange={(event)=>setInvitationFilterType(event.target.value)}>
              <option value="">Select Role</option>
              <option value="0">Spectator</option>
              <option value="1">Developer</option>
              <option value="2">Guest</option>
              <option value="3">Manager</option>
            </select>
            <button className='margin-lr10' onClick={handleInvitationFilter}>filter</button>
            {invitationFilterType!='' && <button className ='margin-lr10' onClick={handleRemoveInvitationFilter}>Remove filter</button>}
          </div>
        </div>
        <div className="game-users-container">
              <table className="game-users-table">
                <thead>
                  <tr>
                    <th>Game Summary</th>
                    <th>Game Description</th>
                    <th>Role</th>
                    <th className="action-col">Status</th>
                  </tr>
                </thead>
                <tbody>
                    {
                    invitation.slice(
                        perPage*invitationPage,
                        invitationPage*perPage+((invitationPage!==totalInvitationPages)?perPage:invitation.length%perPage)

                    )
                    .map((key,index)=>(
                      <tr key={index}>
                      <td>{pokers[key].game_name}</td>
                      <td>{pokers[key].game_description}</td>
                      <td>{CHOICES[pokers[key].role]}</td>
                      {/* <td>{pokers[u].manager}</td> */}
                      <td className="delete-cell">
                      <button
                        className="primary--button"
                        onClick={() => handleAccept(key)}
                        aria-label="Delete user"
                      >   
                      Accept
                      </button>
                    </td>
                    </tr>
                    ))}
                </tbody>
              </table>
              {invitation.length==0?(<p className='flex--center'>'You are not Invited in any pokerboard'</p>):null}
              {(totalInvitationPages!==1 && invitation.length!==0)?<div className="button--container flex--center">
                <button  className={ invitationPage=== 0 ? "primary--button disable" : "primary--button"}  onClick={()=>setInvitationPage(invitationPage-1)} >
                  {'<'}
                </button>
                <button  className={invitationPage === totalInvitationPages-1 ? "primary--button disable" : "primary--button"}  onClick={()=>setInvitationPage(invitationPage+1)}>
                  {'>'}
                </button>
               </div>:null
            } 
            </div>
  
      </div>
      </>
    )
}  
  
export default Dashboard

