export function toGetters<
  Initial extends Record<string, () => any>,
  Getters = {
    [key in keyof Initial]: ReturnType<Initial[key]>;
  }
>(getters: Initial): Getters {
  return new Proxy(getters as any, {
    get: (...args) => Reflect.get(...args)()
  }) as Getters;
}
