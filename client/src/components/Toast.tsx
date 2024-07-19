import Portal from "./Portal";
import { FC } from "react";

interface ToastProps {
  msg: string;
  type: string
}

const Toast: FC<ToastProps> = ({ msg, type }) => {
  return (
    <Portal>
      <p
        className={`${
          type === "failed" ? "bg-red-500" : "bg-blue-500"
        } text-center px-5 py-2 text-sm font-normal mt-20
      shadow-md text-white rounded absolute top-2 left-1/2 transform -translate-x-1/2`}
      >
        {msg}
      </p>
    </Portal>
  );
};

export default Toast;
