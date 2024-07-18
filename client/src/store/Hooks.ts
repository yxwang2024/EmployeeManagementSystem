import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { updateLoading, updateMessage } from './global';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useGlobal = () => {
  const dispatch = useAppDispatch();

  const showLoading = (isShow: boolean) => {
    dispatch(updateLoading(isShow));
  };

  const showMessage = (msg: string, type= "failed", delay = 2000) => {
    dispatch(updateMessage({show: true, msg: msg, type: type}));
    setTimeout(() => {
      dispatch(updateMessage({show: false, msg: '', type: type}));
    }, delay);
  };

  return { showLoading, showMessage };
};
