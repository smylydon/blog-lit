import {
  Action,
  ActionGroup,
  ActionsList,
  emptyPayload,
  propPayload,
  createActionGroup,
  createReducer,
  on,
  Clause,
} from './state';

const GET_MY_FIRST_ACTION = 'Get My First Action';
const GET_MY_SECOND_ACTION = 'Get My Second Action';
const GET_MY_FIRST_ACTION_TYPE = 'GetMyFirstAction';
const GET_MY_SECOND_ACTION_TYPE = 'GetMySecondAction';
describe('createActionGroup', () => {
  let myActions: ActionsList;

  beforeEach(() => {
    myActions = createActionGroup(<ActionGroup>{
      slice: 'mySlice',
      events: {
        getMyFirstAction: emptyPayload(GET_MY_FIRST_ACTION),
        getMySecondAction: propPayload<{payload: number}>(GET_MY_SECOND_ACTION),
      },
    });
  });
  it('should create a name for the slice', () => {
    expect(myActions.slice()).toContain('mySlice');
    expect(myActions.slice()).toMatch(/mySlice\d+/);
  });

  it('should create a actions', () => {
    expect(myActions.ace).toBeUndefined();
    expect(myActions.getMyFirstAction).toBeDefined();
    expect(myActions.getMySecondAction).toBeDefined();
    expect(myActions.getMyFirstAction().type).toBe(GET_MY_FIRST_ACTION_TYPE);
    expect(myActions.getMySecondAction().type).toBe(GET_MY_SECOND_ACTION_TYPE);
  });

  it('should create actions with correct payload props', () => {
    const actionOne: Action = myActions.getMyFirstAction(5);
    const actionTwo = myActions.getMySecondAction(5);
    expect(actionOne.payload).toBeUndefined();
    expect(actionTwo.payload).toBe(5);
  });

  describe('createReducer', () => {
    let myReducer;
    let firstTransform;
    let secondTransform;
    let firstOnClause: Clause;
    let secondOnClause: Clause;

    beforeEach(() => {
      firstTransform = (state, action) => 'firstTransform';
      secondTransform = (state, action) => 'secondTransform';

      firstOnClause = on(myActions.getMyFirstAction, firstTransform);
      secondOnClause = on(myActions.getMySecondAction, secondTransform);

      myReducer = createReducer(firstOnClause, secondOnClause);
    });

    it('should create an ActionFunctionf or each "on" function', () => {
      expect(firstOnClause.type).toContain(GET_MY_FIRST_ACTION_TYPE);
      expect(secondOnClause.type).toContain(GET_MY_SECOND_ACTION_TYPE);
    });

    it('should return the correct state from transform', () => {
      expect(firstOnClause.result(1, 2)).toContain('firstTransform');
      expect(secondOnClause.result(1, 2)).toContain('secondTransform');
    });
  });
});
