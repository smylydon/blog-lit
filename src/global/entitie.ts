export const setState = <T>(
  state: T,
  loaded: boolean,
  error: Error | null = null
): T => {
  return <T>{...state, loaded, error};
};

export const setAll = <S, T>(entities: S[], state: T): T => {
  return <T>Object.assign({}, state, {entities});
};
