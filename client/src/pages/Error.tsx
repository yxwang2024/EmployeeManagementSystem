import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <Header/>
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-white w-full h-full md:h-5/6 md:w-11/12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
               stroke="currentColor" className="size-16 md:size-24 text-blue">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
          </svg>
          <p className="text-black-common text-base md:text-3xl font-bold mt-6 mb-9 text-center">Oops, something went
            wrong!</p>
          <button className="bg-blue text-white text-sm font-semibold rounded h-10 px-16"
                  onClick={() => {
                    navigate("/");
                  }}>Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;