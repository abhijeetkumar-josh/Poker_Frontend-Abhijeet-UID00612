import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GroupInfo {
  id: number;
  name: string;
  users: string[];
}

export interface pokerInfo {
  id: number;
  role: number;
  pokerid: number;
  game_name: string;
  game_description: string;
  accept:boolean;
  member_count:number;
}

export interface ticket {
  summary: string;
  description: string;
}

export interface Estimate {
  key:string;
  priority:string;
  estimate: number;
  summary: string;
  description: string;
  type:number;
  pokerid:number;
  ticketid:number;
  estimateid:number;
}

export interface pokerState {
  pokers: pokerInfo[];
  groups: GroupInfo[];
  estimates: Estimate[];
  tickets: ticket[];
  token:string;
}

const initialState: pokerState = {
  pokers: [],
  groups: [],
  estimates: [],
  tickets: [],
  token:""
};

// Shape of the API payload for `update`
interface UpdatePayload {
  PokerInfo?: any[];
  GroupInfo?: any[];
  TicketInfo?: any[];
}

const pokerSlice = createSlice({
  name: 'poker',
  initialState,
  reducers: {
    updatePoker(state, action) {
      state.pokers[action.payload].accept=true;
    },
    updateGroup(state, action: PayloadAction<GroupInfo>) {
      state.groups.push(action.payload);
    },
    updateEstimate(state, action) {
      const {ticketid,estimate}=action.payload;
      console.log(state.estimates.filter(poker => poker.estimateid === ticketid)[0])
      state.estimates.filter(poker => poker.estimateid === ticketid)[0].estimate=estimate;
    },
    update(state, action: PayloadAction<UpdatePayload>) {
      console.log(action.payload)
      const { PokerInfo = [], GroupInfo = [], TicketInfo = []} = action.payload;
      state.pokers=[]
      state.estimates=[]
      state.groups=[]
      PokerInfo.forEach((key:any) => {
        state.pokers.push({
          id: key.id,
          role: key.role,
          pokerid: key.poker?.pokerid,
          game_name: key.poker?.game_name,
          game_description: key.poker?.game_description ,
          accept: key.accept,
          member_count:key.poker.member.length
        });
      });
      GroupInfo.forEach((group: any) => {
        state.groups.push({
          id: group.id,
          name: group.name,
          users: group.users || [],
        });
      });

      TicketInfo.forEach((Ticket: any) => {
        state.estimates.push({
          estimate:Ticket.estimate,
          summary: Ticket.ticket.summary,
          description: Ticket.ticket.description,
          type : Ticket.ticket.type,
          pokerid:Ticket.ticket.pokerid,
          key:Ticket.ticket.key,
          priority:Ticket.ticket.priority,
          ticketid:Ticket.ticket.id,
          estimateid:Ticket.id,
        });
      });
    },
  },
});

export const { updatePoker, updateGroup, updateEstimate, update } = pokerSlice.actions;
export default pokerSlice.reducer;

