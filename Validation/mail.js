function mailValidation(mail) {
  if (mail.indexOf("@") == -1 || (mail.indexOf(".com") == -1 && mail.indexOf(".it") == -1)) {
    return
  }

  if (mail.indexOf("@") == (mail.indexOf(".com") && mail.indexOf(".it")) - 1) {
    return
  }

  if (mail.indexOf("@") == 0 || (mail.indexOf(".com") + 4 && mail.indexOf(".it") + 3) != mail.length) {
    return
  }

  return true
}

module.exports = {
  mailValidation
}