import './Profile.css'
import { useState} from "react";
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';


const Pokerlist: React.FC = () => {
    const {pokers} = useSelector((state:RootState)=> state.poker)
    const perPage:number=9;
    const totalPage:number=Math.ceil(pokers.length/perPage);
    const [page, setPage] = useState<number>(0);
  
    return (
   
        <section className="section">
          <h2 className="section-title">Your Pokerboards</h2>
          <ul className="card-list">
            {
            pokers.slice(
              perPage*page,
              page*perPage+((page!==totalPage)?perPage:pokers.length%perPage)
            )
            .map((name, index) => (
              <li key={index} className="card">
                <h3>{name.game_name}</h3>
                <p>{name.game_description}</p>
              </li>
            ))}
          </ul>
          {pokers.length==0?(<p className='flex--center'>'You are not participating in any pokerboard'</p>):null}
          {(totalPage!==1 && pokers.length!==0) ? <div className="button--container flex--center">
            <button  className={page === 0 ? "primary--button disable" : "primary--button"}  onClick={()=>setPage(page-1)} >
              {'<'}
            </button>
            <button  className={page === totalPage-1 ? "primary--button disable" : "primary--button"}   onClick={()=>setPage(page+1)}>
              {'>'}
            </button>
          </div> : null}
        </section>
    );
};

export default Pokerlist;
