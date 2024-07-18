import { ReactNode, FC } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: ReactNode
}

const Portal: FC<PortalProps> = ({ children }) => {
  const root = document.body;
  return ReactDOM.createPortal(children, root);
}

export default Portal;