export interface MyState {
  show?: boolean;
  clickItem?: ClickItem;
  labelData?: any[];
}

interface ClickItem {
  [key: string]: any;
}

const initialState: MyState = {
  show: false,
  clickItem: {},
  labelData: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'toggle-show': {
      const { show } = action.payload;
      return {
        ...state,
        show,
      };
    }
    case 'save-label': {
      const { labelData } = action.payload;
      return {
        ...state,
        labelData,
      };
    }

    case 'save-item': {
      const { clickItem } = action.payload;
      return {
        ...state,
        clickItem,
      };
    }

    default:
      return state;
  }
}
