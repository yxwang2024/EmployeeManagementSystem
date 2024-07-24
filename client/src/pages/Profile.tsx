import React, { useEffect, useState } from "react";
import PersonalInfoStep from "../components/multiStepForm/PersonalInfo";
import AddressStep from "../components/multiStepForm/Address";
import ContactInfoStep from "../components/multiStepForm/ContactInfo";
import DocumentStep from "../components/multiStepForm/Document";
import EmergencyContactStep from "../components/multiStepForm/EmergencyContact";
import { RootState } from "../store/store";
import { useAppSelector, useGlobal } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import Documents from "../components/multiStepForm/Documents";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("name");
  const oaInfo = useAppSelector((state: RootState) => state.oaInfo);
  const { showLoading, showMessage } = useGlobal();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (oaInfo.status !== "Approved") {
      showMessage("You are not approved to view this page", "error", 2000);
      navigate("/onboardingapplication");
    }
  }, [oaInfo.status]);

  const renderSection = () => {
    switch (activeSection) {
      case "name":
        return <PersonalInfoStep />;
      case "address":
        return <AddressStep />;
      case "contact":
        return <ContactInfoStep />;
      case "employment":
        return <DocumentStep />;
      case "emergency":
        return <EmergencyContactStep />;
      case "documents":
        return <Documents />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center mt-16">
      {/* Horizontal tabbar instead of sidebar */}
      <div className="w-full flex justify-center items-start mt-2 overflow-x-auto">
        <div className="justify-center items-start space-x-0 mt-6 bg-slate-50 border-2 rounded-2xl hidden md:flex">
          <div
            className={`cursor-pointer ${
              activeSection === "name" ? "font-bold" : ""
            } hover:bg-blue-400 rounded-s-2xl hover:text-white py-4 px-4`}
            onClick={() => setActiveSection("name")}
          >
            Name
          </div>
          <div
            className={`cursor-pointer ${
              activeSection === "address" ? "font-bold" : ""
            } hover:bg-blue-400 hover:text-white py-4 px-4`}
            onClick={() => setActiveSection("address")}
          >
            Address
          </div>
          <div
            className={`cursor-pointer ${
              activeSection === "contact" ? "font-bold" : ""
            } hover:bg-blue-400 hover:text-white py-4 px-4`}
            onClick={() => setActiveSection("contact")}
          >
            Contact Info
          </div>
          <div
            className={`cursor-pointer ${
              activeSection === "employment" ? "font-bold" : ""
            } hover:bg-blue-400 hover:text-white py-4 px-4`}
            onClick={() => setActiveSection("employment")}
          >
            Employment
          </div>
          <div
            className={`cursor-pointer ${
              activeSection === "emergency" ? "font-bold" : ""
            } hover:bg-blue-400 hover:text-white py-4 px-4`}
            onClick={() => setActiveSection("emergency")}
          >
            Emergency Contact
          </div>
          <div
            className={`cursor-pointer ${
              activeSection === "documents" ? "font-bold" : ""
            } hover:bg-blue-400 rounded-e-2xl hover:text-white py-4 px-4`}
            onClick={() => setActiveSection("documents")}
          >
            Documents
          </div>
        </div>
      </div>
      {/* Dropdown for mobile */}
      <div className="relative inline-flex md:hidden">
        <button
          id="hs-dropdown-default"
          type="button"
          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Dropdown"
          onClick={() => setOpen(!open)}
        >
          Actions
          <svg
            className={`hs-dropdown-open:rotate-180 w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div
          className={`transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          } ${open ? "block" : "hidden"} min-w-60 bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="hs-dropdown-default"
        >
          <div
            className="cursor-pointer py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            onClick={() => {
              setActiveSection("name");
              setOpen(false);
            }}
          >
            Name
          </div>
          <div
            className="cursor-pointer py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            onClick={() => {
              setActiveSection("address");
              setOpen(false);
            }}
          >
            Address
          </div>
          <div
            className="cursor-pointer py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            onClick={() => {
              setActiveSection("contact");
              setOpen(false);
            }}
          >
            Contact Info
          </div>
          <div
            className="cursor-pointer py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            onClick={() => {
              setActiveSection("employment");
              setOpen(false);
            }}
          >
            Employment
          </div>
          <div
            className="cursor-pointer py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            onClick={() => {
              setActiveSection("emergency");
              setOpen(false);
            }}
          >
            Emergency Contact
          </div>
          <div
            className="cursor-pointer py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            onClick={() => {
              setActiveSection("documents");
              setOpen(false);
            }}
          >
            Documents
          </div>
        </div>
      </div>
      <div className="w-full lg:w-3/4 p-4">{renderSection()}</div>
    </div>
  );
};

export default Profile;
