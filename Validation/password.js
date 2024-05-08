function passwordValidation(psw) {
  const minLength = 6
  const maxLength = 15
  const specialCharacter = ["@", "#", "!", "£", "$", "%", "&", "[", "]", "{", "}", "§", "/"]

  psw = psw.trim()

  //controllo se la password si trova tra la lunghezza minima e la massima
  if (!(minLength <= psw.length && maxLength >= psw.length)) {
    return false
  }

  //controllo se continene caratteri speciali
  let special = false
  specialCharacter.forEach(value => {
    if (psw.indexOf(value) >= 0) {
      special = true
    }
  })

  if (!special) {
    return false
  }

  //controllo se ha lettere maiuscole
  if (!psw.match(/[A-Z]/)) {
    return false
  }

  //controllo se ha numeri
  if (!psw.match(/[0-9]/)) {
    return false
  }

  return true
}

module.exports = {
  passwordValidation
}