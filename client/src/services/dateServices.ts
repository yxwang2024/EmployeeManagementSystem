export const calculateRemainingDays = (endTimestampString: string) => {
  const end = Number(endTimestampString);
  const now = Date.now();
  return ((end - now) / (1000 * 3600 * 24)).toFixed(0);
};
export const getDateString = (timestampString: string) => {
  const timestamp = Number(timestampString);
  const date = new Date(timestamp);
  const localDate = date.toLocaleDateString();
  return localDate;
};

export const getLegalName = (
  firstName: string,
  middleName: string,
  lastName: string
) => {
  const legalName = `${firstName} ${
    middleName ? middleName + " " : ""
  }${lastName}`;
  return legalName;
};

export const nextStep: Record<string, Record<string, string>> = {
    "OPT Receipt": {
      Reviewing: "OPT Receipt - Wait for HR approval",
      Approved: "Employee Submit OPT EAD",
    },
    "OPT EAD": {
      Reviewing: "OPT EAD - Wait for HR approval",
      Approved: "Employee Submit the I-983",
    },
    "I-983": {
      Reviewing: "I-983 - Wait for HR approval",
      Approved: "Employee Submit the I20",
    },
    "I20": {
      Reviewing: "I20 - Wait for HR approval",
      Approved: "Finished",
    },
  };