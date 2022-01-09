import { combineReducers } from 'redux';
import global, { GlobalState } from './global';
import myState, { MyState } from '../pages/stocks-drama/redux/dramaInfo';
import searchTable, { SearchTableState } from '../pages/menu-table/redux/reducer';
import stepForm, { StepFormState } from '../pages/step-form/redux/reducer';

export interface ReducerState {
  global: GlobalState;
  searchTable: SearchTableState;
  stepForm: StepFormState;
  myState: MyState;
}

export default combineReducers({
  global,
  searchTable,
  stepForm,
  myState,
});
