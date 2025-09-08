import { useState ,useRef} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Estimate } from "../../store/pokerSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import './Pokerboard.css'
import { MemberEstimate,ManagerEstimate, AddComment, AddEstimate } from "../../Services/Services";
import { updateEstimate } from "../../store/pokerSlice";



import useWebSocket, { ReadyState } from 'react-use-websocket';

type userEstimates ={
  type:string,
  user:string,
  estimate:number
}


const PORT:number=8001
const TYPES=['Task','Bug','Epic','Story','Subtask']
// const CHOICES:string[] = ['Spectator','Developer','Guest','Manager']
// const perPage = 10
const fiboCount = 7
const perPageFibo = 7
const count=10;

const fibonacci:number[]=[0, 1, 2, 3, 5, 8, 13]

const Pokerboard = () => {
  const members:string[]=['abhay','ajay','aman','anmol']
  const {pokerid,role} =useParams()
  const {email,username,token} = useSelector((state:RootState)=>state.auth);
  const id:number= +(pokerid||"-1")
  const [currentTicket,setCurrentTicket] = useState<number>(-1)
  const [fiboPage,setFiboPage] = useState<number>(0)
  const {estimates,pokers} = useSelector((state:RootState)=>state.poker)
  const [tickets,setTickets] = useState<Estimate[]>([])
  const [startGame,setStartGame] = useState(false)
  const totalFiboPage = Math.ceil(fiboCount/perPageFibo)
  const timerRef = useRef<HTMLInputElement|null>(null)
  const timerErrorRef = useRef<HTMLInputElement>(null)
  const [currentTicketEstimate,setCurrentTicketEstimate]=useState(-1);
  const [allMembersEstimates,setAllMembersEstimates] = useState<userEstimates[]>([])
  const [first,setFirst] = useState(false)
  const perPageEstimate=5
  const totalEstimatePage=Math.ceil(allMembersEstimates.length/perPageEstimate)
  const [estimatePage,setEstimatePage] = useState(0)
  const [timer,setTimer] = useState(-1)
  const [didEstimate,setDidEstimate] = useState((+(role || '0')==3)?true:false)
  const [managerEstimate,setManagerEstimate] = useState(false)
  const [prevTimer,setPrevTimer] = useState(-1)
  const comment= useRef<HTMLTextAreaElement>(null)
  const commentRef  = useRef<HTMLInputElement>(null)
  const [com,setCom] =useState(true)
  const [activeCount,setActiveCount]= useState(0)
  const [EstimateSubmiting,setEstimatesubmiting] = useState(false)
  const totalEstimatesRef = useRef(allMembersEstimates);
  const [activeMembers,setActiveMembers] = useState<string[]>([])
  const [recentMessage,setRecentMessage] = useState<string>('')
  const [estimateSubmitButton,setEstimateSubmitButton]=useState(false)
  const IntRole = +(role||'0')

  const socketUrl = `ws://127.0.0.1:${PORT}/ws/poker/${id}/`

  const Game = pokers.filter(poker => poker.pokerid === id)[0];

  const {lastMessage, readyState, sendJsonMessage} = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onOpen: () => {
      console.log("Connected to WebSocket");
      setActiveCount(activeCount+1)
    },
    onClose: () => {
      setActiveCount(activeCount-1)
    },

  });

      useEffect(() => {
        const Initial = async () => {
          const lst1:Estimate[]=[];
          estimates.map((key)=> {
             if(key.pokerid===id ){
              lst1.push(key)
             }
           })
           setTickets(lst1)
        };
        Initial()
      }, [id,estimates,pokerid,setTickets]);

      useEffect(() => {
        if (readyState === ReadyState.OPEN) {
          sendJsonMessage({
              type: "chat_joined",
              user: email,
            }
          );
        }
      }, [email,readyState]);


      const handleCurrentEstimate = (index:number)=>{
        // setError('')
        if(timerRef.current) timerRef.current.value = '';
        setFirst(false)
        setTimer(-1)
        setDidEstimate(true)
        setAllMembersEstimates([])
        setCurrentTicketEstimate(-1)
        setCurrentTicket(index)
      }
  
      useEffect(() => {
        if (lastMessage !== null) {
          console.log(lastMessage)
          const data = JSON.parse(lastMessage.data);
          if(data.type=='estimate'){
            setFirst(false)
            console.log('setting up')
            setAllMembersEstimates([])
            setCurrentTicketEstimate(-1)
            setCurrentTicket(data.ticketNo)
          }
          if(data.type=='user_left'){
            console.log('KOKO')
            console.log(!activeMembers.includes(data.user))
            if(activeMembers.includes(data.user)){
              setActiveCount(activeCount-1)
              setActiveMembers((prev)=>prev.filter(prev=>prev!=data.user))
              setRecentMessage(`${data.user} left`)
            }
          }
  // const value = +(timerRef.current?.value.trim() || -1)
          if(data.type=='chat_joined'){
            setActiveMembers(data.user_list)
            setActiveCount(data.user_list.length)
            setRecentMessage(`${data.user} joined`)
            if(timer>0){
              sendJsonMessage({
              type: "timer",
              user: email,
              timer: timer,
              })
              sendJsonMessage({
              type: "estimate",
              user: email,
              ticketNo: currentTicket,
              });
            ;
            } 
          }

          if((+(role || '0')!=3) && data.type=='timer'){
            setFirst(false)
            setDidEstimate(false)
            setTimer(data.timer)
          }
          if((+(role || '0')==3) && data.type=='estimated'){
            console.log('putting')
            console.log(data)
            setAllMembersEstimates((prev)=>[...prev,data])
            console.log(allMembersEstimates)
          }

          if((+(role || '0')!=3) && data.type=='estimate_end'){
            setAllMembersEstimates(data.estimates)
          }
          
        }
      }, [lastMessage,role]);
      
      const handleEstimation = ()=>{
        // setCurrentTicket(currentTicket)
          const value = +(timerRef.current?.value.trim() || -1) 
          setDidEstimate(true)
          setTimer(value)
          setPrevTimer(value)
          if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              type: "estimate",
              user: email,
              ticketNo: currentTicket,
            });
            sendJsonMessage({
              type: "timer",
              user: email,
              timer: value,
            });
          }
          else{
            console.log('Connection is not ready!!!')
          }
      }
      
      const handleEstimate = async (estimate:number)=>{
        setCurrentTicketEstimate(estimate)
        setEstimatesubmiting(true)
        if( (+(role||'0')==3)  ){
          console.log('request passing')
          const result = await ManagerEstimate(tickets[currentTicket].ticketid,estimate,prevTimer,email,token)
          updateEstimate({estimate:estimate,ticketid:tickets[currentTicket].estimateid})
          const answer = await AddEstimate(id,email,currentTicketEstimate,tickets[currentTicket].key)
          console.log(result)
          console.log(answer)
          setDidEstimate(true)
        }
        else{
           const result = await MemberEstimate(tickets[currentTicket].estimateid,currentTicketEstimate)
           updateEstimate({estimate:currentTicketEstimate,ticketid:tickets[currentTicket].estimateid})
           console.log(result)
        }
        setEstimatesubmiting(false)
      }

      useEffect( ()=>{
        totalEstimatesRef.current = allMembersEstimates
      },[allMembersEstimates])

      useEffect( () => {
          const runasync = async ()=>{
            if(timer==0 && currentTicketEstimate!=-1 && !first){
             const result = await MemberEstimate(tickets[currentTicket].estimateid,currentTicketEstimate)
             updateEstimate({estimate:currentTicketEstimate,ticketid:tickets[currentTicket].estimateid})
             console.log(result)
            }
          }
          if(timer==0 && (+(role || '0')==3)) setDidEstimate(false)
          
          runasync()
          if (timer == 0 && !first ) {
            setFirst(true)
            // if((+(role || '0')==3)){
            //   setDidEstimate(false)
            // }
            if((+(role || '0')!=3) ){
              setDidEstimate(true)
              if(currentTicketEstimate!=-1){
              sendJsonMessage({
                type:"estimated",
                user:email,
                estimate:currentTicketEstimate
            })}}
            if((+(role || '0')==3)){
              setTimeout(function(){
                console.log('send after 5')
                console.log(allMembersEstimates)
              sendJsonMessage({
                type:"estimate_end",
                user:email,
                estimates:totalEstimatesRef.current
              })},5000);
            return ;
          }
        }
        if(timer<=0) return;
      
        const timerID=setInterval(() => {
          setTimer((prevSeconds) => prevSeconds - 1);
        }, 1000);
    
        return () =>{
          clearInterval(timerID); 
        }
           
      }, [timer,email,sendJsonMessage,currentTicketEstimate,role,allMembersEstimates,first]);

    const handleAddComment = async ()=>{
      if(id==-1 ) return;
      const value = comment.current?.value.trim()
      const key = tickets[currentTicket].key
      setCom(true)
      const result = await AddComment(id,value,key,email,token)
      if(result.status==201){
        // setError(result.data)
        if(commentRef.current) commentRef.current.textContent=result.data.message

      }
      else{
        if(commentRef.current) commentRef.current.textContent=result.data.message
      }
      setCom(false)
    }

    const handleComment = (event)=>{
      const value = event.target.value.trim()
      if(!value){
        setCom(true)
        if(commentRef.current) commentRef.current.textContent='Comment cannot be empty'
      }
      else{
        setCom(false)
        if(commentRef.current) commentRef.current.textContent=''
      }
    }
    
    const handleSkip = ()=>{
      setCurrentTicket(-1)
    }

    const handleShowEstimate = (estimate:number)=>{
      setEstimateSubmitButton(true)
      setCurrentTicketEstimate(estimate)
    }

  const timerValidation=()=>{
    const timerValue=timerRef.current?.value || '1'
    const timer = parseInt(timerValue, 10);

    if (isNaN(timer)) {
        if(timerErrorRef.current) timerErrorRef.current.textContent = "Timer must be a number";
        return false;
    }

    if (timer <= 0) {
        if(timerErrorRef.current) timerErrorRef.current.textContent = "Timer must be greater than 0";
        return false;
    }

    if (timer > 300) {
        if(timerErrorRef.current) timerErrorRef.current.textContent = "Timer must be 300 or less";
        return false;
    }

    if(timerErrorRef.current) timerErrorRef.current.textContent = "";
    return true;
}

        
  return (
    <>
        <div className="flex--between ">
            <div className='margin-lr10'>
                <div className='poker-summary border-boxing'>
                    <h2 className='flex--center'>Game Summary</h2>   
                    <p >
                        {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. */}
                        {Game.game_name}
                    </p>
                </div>
                <div className='poker-desc border-boxing'>
                    <h2 className='flex--center'>Game Description</h2>
                    {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis fugit suscipit nesciunt odit nostrum possimus delectus? Nobis temporibus fuga tempora. Corrupti, ducimus nihil!</p> */}
                    <p>{Game.game_description}</p>
                </div>
            </div>
            <div className='border-boxing'>
                <p>
                    Total members : {Game.member_count}
                </p>
                   <h2> Active Members : {activeCount}</h2>
                <h2>Online :</h2>
                <ul className='green-bullets'>
                    {activeMembers.map((key,index)=>(
                       <li key={index}>{key}</li>
                    ))
                    }
                </ul>
                { recentMessage!='' && 
                <>
                <h2>Recent Activity: </h2>
                <p>{recentMessage}</p>
                </>}
                { (+(role || '0')==3) && <button onClick={()=>setStartGame(true)} className={!startGame?'primary--button':`primary--button disable`}>
                    start game
                </button>}

            </div>
        </div>  
        {currentTicket!==-1?
         <div className="border-boxing">
           <div className="border-boxing">
              <div className="flex--between">
                <h2 className="flex--center">{tickets[currentTicket].key}</h2>
                {timer>0?<button>{timer}</button>:null}
                {/* {
                  timer>0 && 
                  <>
                  <h1 className="border-boxing flex--middle fibonacci">{managerEstimate}</h1>
                  </>
                } */}
              </div>
              <p>{tickets[currentTicket].description}</p>
              <h4>Priority:{tickets[currentTicket].priority}</h4>
              <h4>Type:{TYPES[tickets[currentTicket].type]}</h4>
              {(+(role || '0')==3) && <div className="flex--spaced">
                <input className="" onInput={timerValidation} ref={timerRef} type="number" placeholder="Set Timer" />
                {/* <button className="margin-lr10" onClick={handleLocalTime} >Set Timer</button> */}
                {first && <button className="margin-lr10" onClick={handleSkip}>Skip</button>}
                <button className="margin-lr10" type="button" onClick={handleEstimation} >Start Estimation</button>
              </div>}
              <p className="login-error" ref={timerErrorRef}>{timerErrorRef.current?.value}</p>
              {(+(role || '0')==3) && !didEstimate &&
              <div>
              <label><h3 className="flex--center">Comment</h3></label>
              <textarea  ref={comment} onInput={handleComment} placeholder="Enter comment"></textarea>
              <div className="flex--middle"><button  className={!com?'primary--button':'primary--button disable'} onClick={handleAddComment}>Submit</button></div>
              {/* {error && <p className="form-error flex--center">{error}</p>} */}
              <p className="login-error" ref={commentRef}>{commentRef.current?.value}</p>
              </div>}
           </div>
           {  ( (IntRole==3 && first) || (IntRole!=3 && !first) ) && currentTicketEstimate>-1 &&<>
           {estimateSubmitButton && <h1 className="flex--middle">{currentTicketEstimate}</h1>}
           {estimateSubmitButton && <div className="flex--middle"><button className={EstimateSubmiting?'flex--middle disable--blue':'flex--middle'} type='button' onClick={()=>handleEstimate(currentTicketEstimate)}>Submit Estimate</button></div>}
           </>}
           <div className="flex--wrap">
            { ( (IntRole==3 && timer>=0) || (IntRole!=3 && !first) ) && 
                fibonacci.slice(
                        perPageFibo*fiboPage,
                        fiboPage*perPageFibo+((fiboPage!==totalFiboPage)?perPageFibo:fibonacci.length%perPageFibo)

                )
                .map((key,index)=>(
              <div key={index} onClick={()=>handleShowEstimate(key)} className="border-boxing flex--middle wrap fibonacci margin-10 margin-lr10">
                <h1 key={index} >{key}</h1>
              </div>
            ))}
           </div>
           {first && totalFiboPage>1 &&  <div className="flex--center">
            <button className= {fiboPage==0?'primary--button disable':'primary--button'} onClick={()=>setFiboPage(fiboPage-1)}>
             {'<'}
            </button>
            <button className={fiboPage==totalFiboPage-1?'primary--button disable':'primary--button'}  onClick={()=>{setFiboPage(fiboPage+1)}}>
             {'>'}
            </button>
           </div>}
           <div className="flex">
            {  first && 
              allMembersEstimates.slice(
                      perPageEstimate*estimatePage,
                      estimatePage*perPageEstimate+((estimatePage!==totalEstimatePage)?perPageEstimate:allMembersEstimates.length%perPageEstimate)
              )
              .map((key,index)=>(
              <div key={index} className="border-boxing flex--middle fibonacci margin-lr10">
                <p>{key.user}--</p>
                <p>{key.estimate}</p>
              </div>
            ))}
           </div>
           {totalEstimatePage>1 && <div className="flex--center">
            <button className= {estimatePage==0?'primary--button disable':'primary--button'} onClick={()=>setEstimatePage(estimatePage-1)}>
             {'<'}
            </button>
            <button className={estimatePage==totalEstimatePage-1?'primary--button disable':'primary--button'}  onClick={()=>{setEstimatePage(estimatePage+1)}}>
             {'>'}
            </button>
           </div>}
         </div>:null

        }
        <div className="game-users-container">
              <table className="game-users-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Priority</th>
                    <th>Summary</th>
                    <th>Type</th>
                    <th>Estimate</th>
                    {(+(role || '0')==3)  && <th className="action-col">status</th>}
                  </tr>
                </thead>
                <tbody>
                    {
                    tickets.map((ticket,index)=>(
                      
                      <tr key={index}>
                      <td>{ticket.key}</td>
                      <td>{ticket.priority}</td>
                      <td>{ticket.summary}</td>
                      {/* <td>{key.description}</td> */}
                      <td>{TYPES[ticket.type]}</td>
                      <td>{ticket.estimate?ticket.estimate:'Not estimated'}</td>
                      {/* <td>{pokers[u].manager}</td> */}
                      <td className="delete-cell">
                      {(+(role || '0')==3)  && <button
                        className={!ticket.estimate && startGame?'primary--button':`primary--button disable`}
                        aria-label="Delete user"
                        onClick={()=>handleCurrentEstimate(index)}
                      >   
                      {ticket.estimate?'Estimated':'Estimate'}
                      </button>}
                    </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>

    </>
  )
}

export default Pokerboard
