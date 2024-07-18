import {React,userState} from "react";

import { Typography ,Button} from "@mui/material";

const DetailedView = () => {


  return (
    <>
        <div className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Doe John</h2>
      <div className="mb-4">
        <span className="font-semibold">Work Authorization:</span>
        <div className="ml-4">
          <p>
            <span className="font-semibold">Title:</span> OPT
          </p>
          <p>
            <span className="font-semibold">Start date:</span> 7/1/24
          </p>
          <p>
            <span className="font-semibold">End date:</span> 6/30/25
          </p>
          <p>
            <span className="font-semibold">Num of Days Remaining:</span> 365
          </p>
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Next Step:</span>
        <p className="text-yellow-600">Waiting for HR's approval</p>
      </div>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <i className="fas fa-file-alt mr-2"></i>
          <span>doc1</span>
          <div className="ml-4 space-x-2">
            <button className="text-blue-500">preview</button>
            <button className="text-blue-500">download</button>
          </div>
        </div>
      </div>
      <div className="flex items- mb-2">
        <button className="text-orange-500">Approve</button>
        <button className="text-red-500">reject</button>
      </div>
    </div>

    </>
  )
}

export default DetailedView
