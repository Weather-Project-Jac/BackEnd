function mailValidation(mail) {
  const atIndex = mail.indexOf("@");
  const dotComIndex = mail.indexOf(".com");
  const dotItIndex = mail.indexOf(".it");

  // Check if "@" exists and ".com" or ".it" exists
  if (atIndex === -1||(dotComIndex === -1 && dotItIndex === -1)) {
    return false;
  }

  // Check if "@" is not at the beginning or "@" is immediately followed by ".com" or ".it"
  if (atIndex === 0 || atIndex + 1 === dotComIndex || atIndex + 1 === dotItIndex) {
    return false;
  }

  // Check if either ".com" or ".it" is at the end of the email
  if (dotComIndex !== -1 && dotComIndex + 4 === mail.length) {
    return true;
  }

  if (dotItIndex !== -1 && dotItIndex + 3 === mail.length) {
    return true;
  }

  return false;
}

module.exports = {
  mailValidation,
}