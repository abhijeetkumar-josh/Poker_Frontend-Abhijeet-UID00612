import { useEffect } from "react";
import './Profile.css'
import { useRef ,useState} from "react";
import { useSelector } from 'react-redux';
import { RootState } from "../../store/store";
import { GroupInfo } from "../../store/pokerSlice";



const Grouplist: React.FC = () => {
   const {groups} = useSelector((state:RootState)=> state.poker)
    const totalPage:number=Math.ceil(groups.length/9);
    const perPage:number=9;
    const prevRefPoker= useRef<HTMLButtonElement>(null);
    const nextRefPoker= useRef<HTMLButtonElement>(null);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [userGroups,setUserGroups]=useState<GroupInfo[]>([]);
    
  
    useEffect(() => {
      const fetchBoards = async () => {
        setLoading(true);
        try {
          const data:GroupInfo[] =[]
          for(let i=(page-1)*perPage+(page!==totalPage?perPage:groups.length%perPage);i>(page-1)*perPage;--i){
            data.push(groups[i-1])
          }
          setUserGroups(data);
        } catch (err) {
          console.error('Error fetching Boards:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBoards();
    },[page]);
  
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
          <h2 className="section-title">Groups</h2>
          <ul className="tag-list">
            {loading?"loading...." :
            userGroups.map((group, index) => (
              <li key={index} className="tag">
                <h3>{group.name}</h3>
              </li>
            ))}
          </ul>
          <div className="button--container flex--center">
            <button  className={ ( loading || (page === 1)) ? "primary--button disable" : "primary--button"}  ref={prevRefPoker} onClick={handlePrevPoker} >
              prev
            </button>
            <button  className={ (loading || (page === totalPage)) ? "primary--button disable" : "primary--button"}  ref={nextRefPoker} onClick={handleNextPoker}>
              next
            </button>
          </div>
        </section>
    );
};

export default Grouplist;
