import './Profile.css'
import { useEffect } from 'react';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { Filter } from "../../Services/Services";
import { useState } from 'react';
import { Estimate } from '../../store/pokerSlice';

const Ticketlist: React.FC = () => {
    const {estimates} = useSelector((state:RootState)=> state.poker)
    const [Estimates,setEstimates] = useState(estimates)
    const perPage:number=6;
    const totalPage:number=Math.ceil(Estimates.length/perPage);
    const [page, setPage] = useState<number>(0);
    const [filterType, setFilterType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [loading,setLoading]= useState(false)

    useEffect(() => {
      const Initial=()=>{
         setEstimates((prev) => prev.filter((u) => u.estimate));
      };
      Initial()
    }, [estimates]);

    const handleSubmit =async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setLoading(true)
        const data = await Filter(filterType,selectedDate);
        const lst:Partial<Estimate>[]=[]
        data.forEach((Ticket: any) => {
        if(Ticket.estimate){
            lst.push({
              estimate:Ticket.estimate,
              summary: Ticket.ticket.summary,
              description: Ticket.ticket.description,
              type : Ticket.ticket.type,
              pokerid:Ticket.ticket.pokerid,
              key:Ticket.ticket.key,
              priority:Ticket.ticket.priority,
            });
        }
        });
        setEstimates(lst)  
        setPage(0);
      } catch (err) {
        console.error('Error Filtering tickets:', err);
      } finally{
        setLoading(false)
      }
    };

    return (
        <section className="section">
           <div className='flex--spaced form-group'>
            <h2 className="section-title">Estimations</h2>
            <div >
              <form className="filter-form" onSubmit={handleSubmit}>
              <label>
                <label htmlFor="ticketType">Type:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Select Type</option>
                    <option value="0">Task</option>
                    <option value="1">Bug</option>
                    <option value="2">Epic</option>
                    <option value="3">Story</option>
                    <option value="4">Subtask</option>
                </select>
              </label>
              <label>
                <label htmlFor="ticketDate">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </label>
              <button type="submit" className="primary--button">
                Apply Filters
              </button>
             </form>
            </div>
          </div>
          {/* <ul className="ticket-list">
            {loading?'loading...':
              Estimates.slice(
              perPage*page,
              page*perPage+((page!==totalPage)?perPage:estimates.length%perPage)
            )
            .map((ticket, index) => (
            <li key={index} className="ticket">
              <span className="ticket-title">{ticket.summary}</span>
              <span className="ticket-title">{ticket.estimate}</span>
              <span className="ticket-desc">{ticket.description}</span>
              <span className="ticket-desc">{ticket.key}</span>
            </li>
          ))}
        </ul>
        {Estimates.length==0?(<p className='flex--center'>'No tickets to show'</p>):null}
         {(totalPage!==1 && Estimates.length!==0)? <div className="button--container flex--center">
            <button  className={page === 0 ? "primary--button disable" : "primary--button"}   onClick={()=>setPage(page-1)} >
              {'<'}
            </button>
            <button  className={page === totalPage-1 ? "primary--button disable" : "primary--button"}  onClick={()=>setPage(page+1)}>
              {'>'}
            </button>
          </div>:null} */}
          <div className="game-users-container">
              <table className="game-users-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Summary</th>
                    <th>Description</th>
                    <th>Estimate</th>
                  </tr>
                </thead>
                <tbody>
                    {
                    loading?
                      <tr>
                        <td colSpan={4}>Loading...</td>
                      </tr>:
                      Estimates.slice(
                      perPage*page,
                      page*perPage+((page!==totalPage)?perPage:estimates.length%perPage)
                    )
                    .map((ticket,index)=>(
                      <tr key={index}>
                      <td>{ticket.key}</td>
                      <td>{ticket.summary}</td>
                      <td>{ticket.description}</td>
                      <td>{ticket.estimate}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {Estimates.length==0?(<p className='flex--center'>'You do not have any Estimates'</p>):null}
              {(totalPage!==1 && Estimates.length!==0)?<div className="button--container flex--center">
                <button  className={ page=== 0 ? "primary--button disable" : "primary--button"}  onClick={()=>setPage(page-1)} >
                  {'<'}
                </button>
                <button  className={page === totalPage-1 ? "primary--button disable" : "primary--button"}  onClick={()=>setPage(page+1)}>
                  {'>'}
                </button>
               </div>:null
            } 
            </div>
        </section>
    );
};

export default Ticketlist;
