function generateCode(prefix, existingCodes = []) {
  let code;
  do {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    code = `${prefix}-${random}`;
  } while (existingCodes.includes(code));
  return code;
}

module.exports = generateCode;
