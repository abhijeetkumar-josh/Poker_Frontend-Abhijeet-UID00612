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
}

export interface ticket {
  summary: string;
  description: string;
}

export interface Estimate {
  estimate: number;
  summary: string;
  description: string;
}

export interface pokerState {
  pokers: pokerInfo[];
  groups: GroupInfo[];
  estimates: Estimate[];
  tickets: ticket[];
}

const initialState: pokerState = {
  pokers: [],
  groups: [],
  estimates: [],
  tickets: [],
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
    updatePoker(state, action: PayloadAction<pokerInfo>) {
      state.pokers.push(action.payload);
    },
    updateGroup(state, action: PayloadAction<GroupInfo>) {
      state.groups.push(action.payload);
    },
    updateEstimate(state, action: PayloadAction<Estimate>) {
      state.estimates.push(action.payload);
    },
    update(state, action: PayloadAction<UpdatePayload>) {
        console.log(action.payload)
      const { PokerInfo = [], GroupInfo = [], TicketInfo = [] } = action.payload;

      // Update PokerInfo
      PokerInfo.forEach((key: any) => {
        const obj={
          id: key.id,
          role: key.role,
          pokerid: key.poker?.pokerid || 0,
          game_name: key.poker?.game_name || '',
          game_description: key.poker?.game_description || '',
        }
        console.log('hello')
        console.log(obj)
        state.pokers.push({
          id: key.id,
          role: key.role,
          pokerid: key.poker?.pokerid || 0,
          game_name: key.poker?.game_name || '',
          game_description: key.poker?.game_description || '',
        });
      });

      // Update GroupInfo
      GroupInfo.forEach((group: any) => {
        const obj={
          id: group.id,
          name: group.name,
          users: group.users || [],
        }
        console.log('what')
        console.log(obj)
        state.groups.push({
          id: group.id,
          name: group.name,
          users: group.users || [],
        });
      });

      // Update TicketInfo
      TicketInfo.forEach((Ticket: any) => {
        const obj={
          estimate:Ticket.estimate,
          summary: Ticket.ticket.summary || '',
          description: Ticket.ticket.description || '',
        }
        console.log('what')
        console.log(obj)
        state.estimates.push({
          estimate:Ticket.estimate,
          summary: Ticket.ticket.summary || '',
          description: Ticket.ticket.description || '',
        });
      });
    },
  },
});

export const { updatePoker, updateGroup, updateEstimate, update } = pokerSlice.actions;
export default pokerSlice.reducer;
