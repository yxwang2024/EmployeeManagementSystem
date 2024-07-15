const generateEncryptedKey = async (hrId, email, name) => {
  const key = await Buffer.from(hrId + "," + email + "," + name).toString('base64');
  return key;
}

const generateToken = async (hrId, email, name) => {
  const key = await generateEncryptedKey(hrId, email, name);

  return key;
}

const decodeToken = async (token) => {
  const decodedString = Buffer.from(token, 'base64').toString('ascii');
  const [hrId, employeeEmail, employeeName] = decodedString.split(',');
  return { hrId, employeeEmail, employeeName };
}
export { generateToken, decodeToken };