import './Profile.css'
import { useState} from "react";
import { useSelector } from 'react-redux';
import { RootState } from "../../store/store";

const Grouplist: React.FC = () => {
   const {groups} = useSelector((state:RootState)=> state.poker)
   const perPage:number=9;
   const totalPage:number=Math.ceil(groups.length/perPage);
   const [page, setPage] = useState<number>(0);

  
    return (
   
        <section className="section">
          <h2 className="section-title">Groups</h2>
          <ul className="tag-list">
            {
              groups.slice(
              perPage*page,
              page*perPage+((page!==totalPage)?perPage:groups.length%perPage)
            )
            .map((group, index) => (
              <li key={index} className="tag">
                <h3>{group.name}</h3>
              </li>
            ))}
          </ul>
          {groups.length==0?(<p className='flex--center'>'You are not in any groups'</p>):null}
          { (totalPage!==1 && groups.length!==0)? <div className="button--container flex--center">
            <button  className={ (page === 0) ? "primary--button disable" : "primary--button"} onClick={()=>setPage(page-1)} >
              {'<'}
            </button>
            <button  className={ (page === totalPage-1) ? "primary--button disable" : "primary--button"}  onClick={()=>setPage(page+1)}>
              {'>'}
            </button>
          </div>:null}
        </section>
    );
};

export default Grouplist;
