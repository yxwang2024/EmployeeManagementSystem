export const nextStep: Record<string, Record<string, string>> = {
    "OPT Receipt": {
      Pending:"Employee Submit OPT Receipt",
      Reviewing: "OPT Receipt - Wait for HR approval",
      Approved: "Employee Submit OPT EAD",
      Rejected: "Employee Reupload OPT Receipt",
    },
    "OPT EAD": {
      Pending:"Employee Submit OPT EAD",
      Reviewing: "OPT EAD - Wait for HR approval",
      Approved: "Employee Submit the I-983",
      Rejected: "Employee Reupload OPT EAD",
    },
    "I-983": {
      Pending:"Employee Submit I-983",
      Reviewing: "I-983 - Wait for HR approval",
      Approved: "Employee Submit the I20",
      Rejected: "Employee Reupload I-983",
    },
    "I20": {
      Pending:"Employee Submit I20",
      Reviewing: "I20 - Wait for HR approval",
      Approved: "Finished",
      Rejected: "Employee Reupload I20",
    },
  };