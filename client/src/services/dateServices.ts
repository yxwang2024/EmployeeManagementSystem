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

export const formatSSN = (ssn: string) => {
  return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
};

export const formatPhoneNumber = (phoneNumber: string) => {
  return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3,6)}-${phoneNumber.slice(6)}`;
};
