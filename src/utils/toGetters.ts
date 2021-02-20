export function toGetters<
  Initial extends Record<string, () => any>,
  Getters = {
    [key in keyof Initial]: ReturnType<Initial[key]>;
  }
>(getters: Initial): Getters {
  return Object.entries(getters).reduce((object, [key, getter]) => {
    Object.defineProperty(object, key, { get: () => getter() });
    return object;
  }, {}) as Getters;
}
