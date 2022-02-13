import searchTable, { SearchTableState } from './reducer';
import { combineReducers } from 'redux';
export interface ReducerState {
  searchTable: SearchTableState;
}

export default combineReducers({
  searchTable,
});
