const generateEncryptedKey = async (hrId, email, name) => {
  const key = await Buffer.from(hrId + email + name).toString('base64');
  return key;
}

const generateToken = async (hrId, email, name) => {
  const key = await generateEncryptedKey(hrId, email, name);

  return key;
}

const decodeToken = async (token) => {
  const decoded = await Buffer.from(token, 'base64').toString('ascii');
  const { hrId: hrId, email: employeeEmail, name: employeeName } = decoded;
  return { hrId, employeeEmail, employeeName };
}

module.exports = {
  generateToken,
  decodeToken,
};