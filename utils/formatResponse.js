const formatResponse = (code, message, body = null) => {
  return {
    code,
    message,
    body,
  };
};

module.exports = formatResponse;
