// invoke a function call after a delay: eg showLoading(false) after 2 seconds
export const delayFunctionCall = (fn: Function, delay: number, option: boolean) => {
  setTimeout(() => {
    fn(option);
  }, delay);
};