export const setState = <T>(
  state: T,
  loaded: boolean,
  error: Error | null = null,
  selectedId: string | number = undefined
): T => {
  return <T>{...state, loaded, error, selectedId};
};

export const setAll = <S, T>(entities: S[], state: T): T => {
  return <T>Object.assign({}, state, {entities});
};
