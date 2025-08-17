import { useEffect } from "react";
import './Profile.css'
import { useRef ,useState} from "react";
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { Estimate } from "../../store/pokerSlice";
import { Filter } from "../../Services/Services";


const Ticketlist: React.FC = () => {
    const {estimates} = useSelector((state:RootState)=> state.poker)
    const [Estimates, setEstimates] = useState<Estimate[]>(estimates);
    const perPage:number=6;
    const totalPage:number=Math.ceil(Estimates.length/perPage) || 1;
    const prevRefPoker= useRef<HTMLButtonElement>(null);
    const nextRefPoker= useRef<HTMLButtonElement>(null);
    const [page, setPage] = useState<number>(1);
    // const [filterType,setFilterType]=useState('Estimated Date');
    const [loading, setLoading] = useState(false);
    const [Tickets,setTickets]=useState<Estimate[]>([]);
    const [filterType, setFilterType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");


  const handleSubmit =async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const data = await Filter(filterType,selectedDate);
        console.log(data)
        setEstimates(data)  
        setPage(1);
      } catch (err) {
        console.error('Error Filtering tcikets:', err);
      } finally {
        setLoading(false);
      }
  };


    useEffect(() => {
      const fetchBoards = async () => {
        setLoading(true);
        try {
          const data:Estimate[] =[]
          for(let i=(page-1)*perPage+(page!==totalPage?perPage:Estimates.length%perPage);i>(page-1)*perPage;--i){
            data.push(Estimates[i-1])
          }
          // const itemsOnPage = (page !== totalPage ? perPage : (Estimates.length % perPage || perPage));
          // for (let i = (page - 1) * perPage + itemsOnPage; i > (page - 1) * perPage; --i) {
          //     data.push(Estimates[i - 1]);
          // }
          setTickets(data);
        } catch (err) {
          console.error('Error fetching Boards:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBoards();
    },[page,Estimates,totalPage]);
  
    const handlePrevPoker = () => {
      if (page >1){
        setPage(page - 1);
        nextRefPoker!.current!.classList.remove('disable');
      }
      else{
        prevRefPoker!.current!.classList.add('disable');
      }
    };
  
    const handleNextPoker = () => {
      if (page < (totalPage)){
        setPage(page + 1);
        prevRefPoker!.current!.classList.remove('disable');
      }
      else{
        nextRefPoker!.current!.classList.add('disable');
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
          <ul className="ticket-list">
            {loading? "loading...":
          Tickets.map((ticket, index) => (
            <li key={index} className="ticket">
              {/* <span className="ticket-id">{ticket.id}</span> */}
              <span className="ticket-title">{ticket.summary}</span>
              <span className="ticket-title">{ticket.estimate}</span>
              <span className="ticket-desc">{ticket.description}</span>
            </li>
          ))}
        </ul>
          <div className="button--container flex--center">
            <button  className={page === 1 ? "primary--button disable" : "primary--button"}  ref={prevRefPoker} onClick={handlePrevPoker} >
              prev
            </button>
            <button  className={page === totalPage ? "primary--button disable" : "primary--button"}  ref={nextRefPoker} onClick={handleNextPoker}>
              next
            </button>
          </div>
        </section>
    );
};

export default Ticketlist;
