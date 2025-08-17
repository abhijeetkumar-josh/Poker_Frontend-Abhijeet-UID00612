import { useEffect } from "react";
import './Profile.css'
import { useRef ,useState} from "react";
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { pokerInfo } from "../../store/pokerSlice";


const Pokerlist: React.FC = () => {
    const {pokers} = useSelector((state:RootState)=> state.poker)
    const totalPage:number=Math.ceil(pokers.length/9);
    const perPage:number=9;
    const prevRefPoker= useRef<HTMLButtonElement>(null);
    const nextRefPoker= useRef<HTMLButtonElement>(null);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [pokerboard,setPokerboard]=useState<pokerInfo[]>([]);
  
    useEffect(() => {
      const fetchBoards = async () => {
        setLoading(true);
        try {
          const data:pokerInfo[] =[]
          for(let i=(page-1)*perPage+(page!==totalPage?perPage:pokers.length%perPage);i>(page-1)*perPage;--i){
            data.push(pokers[i-1])
          }
          setPokerboard(data);
        } catch (err) {
          console.error('Error fetching Boards:', err);
        } finally {
          console.log(pokerboard)
          setLoading(false);
        }
      };
      fetchBoards();
      console.log('inside effect');
    },[page,pokers]);
  
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
      console.log('next')
      console.log(page)
      if (page < (totalPage)){
        setPage(page + 1);
        prevRefPoker!.current!.classList.remove('disable');
      }
      else{
        nextRefPoker!.current!.classList.add('disable');
      }
      console.log('next')
      console.log(page)
    };
  
    return (
   
        <section className="section">
          <h2 className="section-title">Your Pokerboards</h2>
          <ul className="card-list">
            {loading?"loading...." :
            pokerboard.map((name, index) => (
              <li key={index} className="card">
                <h3>{name.game_name}</h3>
                <p>{name.game_description}</p>
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

export default Pokerlist;
