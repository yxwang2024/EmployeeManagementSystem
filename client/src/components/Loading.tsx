import Portal from './Portal.tsx';
import loadingIcon from '../assets/loading.svg';

const Loading = () => {
  return (
    <Portal>
      <div className="w-full h-full inset-0 fixed flex justify-center items-center flex-col">
        <div className="w-full h-full absolute inset-0 bg-black opacity-20"></div>
        <img src={loadingIcon} className="animate-spin w-32 h-32" alt=''/>
        <p className="text-blue text-lg">Processing...</p>
      </div>
    </Portal>
  );
};

export default Loading;