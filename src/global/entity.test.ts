import {setAll, setState} from './entity';
import {EntityState} from './state';

interface Item {
  id: number;
  name: string;
}

interface ItemState extends EntityState<Item[]> {
  entities: Item[];
  selectedId?: string | number;
  loaded: boolean;
  error?: Error | null;
}

const initialItemState: ItemState = {
  entities: [],
  loaded: false,
  error: null,
};

describe('Entity', () => {
  const checkInitialState = () => {
    expect(initialItemState.entities).toBeDefined();
    expect(initialItemState.entities.length).toBe(0);
    expect(initialItemState.loaded).toBeFalsy();
    expect(initialItemState.error).toBeNull();
  };
  it('should initial state', () => {
    checkInitialState();
  });

  describe('setAll', () => {
    it('should entities', () => {
      const entities: Item[] = [
        {
          id: 1,
          name: 'test1',
        },
        {
          id: 2,
          name: 'test2',
        },
      ];
      const state = setAll(entities, initialItemState);
      checkInitialState();

      expect(state.entities).toBeDefined();
      expect(state.entities.length).toBe(2);
      const item1 = state.entities[0];
      const item2 = state.entities[1];
      expect(item1).toBeDefined();
      expect(item2).toBeDefined();

      expect(item1.id).toBe(1);
      expect(item2.id).toBe(2);

      expect(item1.name).toContain('test1');
      expect(item2.name).toContain('test2');
    });
  });

  describe('setState', () => {
    it('should set state to loading', () => {
      const state = setState(initialItemState, true, null);
      checkInitialState();

      expect(state.entities).toBeDefined();
      expect(state.entities.length).toBe(0);
      expect(state.loaded).toBeTruthy();
      expect(state.error).toBeNull();
      expect(state.selectedId).toBeUndefined();
    });

    it('should set state to error', () => {
      const state = setState(initialItemState, false, new Error('Test'));
      checkInitialState();

      expect(state.entities).toBeDefined();
      expect(state.entities.length).toBe(0);
      expect(state.loaded).toBeFalsy();
      expect(state.error).toBeDefined();
      expect(state.error.message).toContain('Test');
      expect(state.selectedId).toBeUndefined();
    });

    it('should set selectedId to 1', () => {
      const state = setState(initialItemState, false, null, 1);
      checkInitialState();

      expect(state.entities).toBeDefined();
      expect(state.entities.length).toBe(0);
      expect(state.loaded).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.selectedId).toBeDefined();
      expect(state.selectedId).toBe(1);
    });
  });
});
