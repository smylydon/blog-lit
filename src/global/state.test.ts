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
  removeSpaces,
  getTimeString,
  State,
} from './state';

const GET_MY_FIRST_ACTION = ' Get My First Action ';
const GET_MY_SECOND_ACTION = ' Get My Second Action ';
const GET_MY_FIRST_ACTION_TYPE = 'GetMyFirstAction';
const GET_MY_SECOND_ACTION_TYPE = 'GetMySecondAction';
describe('state', () => {
  describe('utility functions', () => {
    it('should remove spaces from a string', () => {
      expect(removeSpaces(GET_MY_FIRST_ACTION)).toBe(GET_MY_FIRST_ACTION_TYPE);
      expect(removeSpaces(GET_MY_SECOND_ACTION)).toBe(
        GET_MY_SECOND_ACTION_TYPE
      );
    });

    it('should create a unix time stamp', () => {
      expect(getTimeString()).toMatch(/\d{12,}/);
    });
  });

  describe('createActionGroup', () => {
    let myActions: ActionsList;

    beforeEach(() => {
      myActions = createActionGroup(<ActionGroup>{
        slice: 'mySlice',
        events: {
          getMyFirstAction: emptyPayload(GET_MY_FIRST_ACTION),
          getMySecondAction: propPayload<{payload: number}>(
            GET_MY_SECOND_ACTION
          ),
        },
      });
    });

    it('should create a name for the slice', () => {
      expect(myActions.slice()).toContain('mySlice');
      expect(myActions.slice()).toMatch(/mySlice\d{12,}/);
    });

    it('should create a actions', () => {
      expect(myActions.ace).toBeUndefined();
      expect(myActions.getMyFirstAction).toBeDefined();
      expect(myActions.getMySecondAction).toBeDefined();
      expect(myActions.getMyFirstAction().type).toBe(GET_MY_FIRST_ACTION_TYPE);
      expect(myActions.getMySecondAction().type).toBe(
        GET_MY_SECOND_ACTION_TYPE
      );
    });

    it('should create actions with correct payload props', () => {
      const actionOne: Action = myActions.getMyFirstAction(5);
      const actionTwo = myActions.getMySecondAction(5);
      expect(actionOne.payload).toBeUndefined();
      expect(actionTwo.payload).toBe(5);
    });

    describe('createReducer', () => {
      const initialState = 'initialState';
      let myReducer: State<string>;
      let firstTransform;
      let secondTransform;
      let firstOnClause: Clause;
      let secondOnClause: Clause;

      beforeEach(() => {
        firstTransform = (state, action) => 'firstTransform';
        secondTransform = (state, action) => 'secondTransform';

        firstOnClause = on(myActions.getMyFirstAction, firstTransform);
        secondOnClause = on(myActions.getMySecondAction, secondTransform);

        myReducer = createReducer<string>(
          initialState,
          firstOnClause,
          secondOnClause
        );
      });

      it('should create an initial reducer.', () => {
        expect(myReducer.state).toEqual(initialState);
        expect(myReducer.clauses).toBeDefined();
        expect(
          myReducer.clauses[myActions.getMyFirstAction().type]
        ).toBeDefined();
        expect(
          myReducer.clauses[myActions.getMySecondAction().type]
        ).toBeDefined();
      });

      it('should create an ActionFunction for each "on" function', () => {
        expect(firstOnClause.type).toContain(GET_MY_FIRST_ACTION_TYPE);
        expect(secondOnClause.type).toContain(GET_MY_SECOND_ACTION_TYPE);
        expect(myActions.getMyFirstAction().type).toEqual(firstOnClause.type);
        expect(myActions.getMySecondAction().type).toEqual(secondOnClause.type);
      });

      it('should return the correct state from transform in each "on" clause', () => {
        expect(firstOnClause.result(1, 2)).toContain('firstTransform');
        expect(secondOnClause.result(1, 2)).toContain('secondTransform');
      });

      it('should return the correct state for each reducer clause', () => {
        const clauseOne = myReducer.clauses[firstOnClause.type];
        const clauseTwo = myReducer.clauses[secondOnClause.type];

        expect(clauseOne(1, 2)).toContain('firstTransform');
        expect(clauseTwo(1, 2)).toContain('secondTransform');
      });
    });
  });
});
