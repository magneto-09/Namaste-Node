const profileUpdateHelper = (dataObj) => {
  const { firstName, lastName, password } = dataObj;

  //   2. firstName and lastName should contains only alphabets.
  const nameRegex = /^[A-Za-z]+$/;
  // from this regex we've made the allowed value for firstName & lastName more strict.
  // due to this now spaces can't present.

  if (
    !firstName ||
    !lastName ||
    !nameRegex.test(firstName) ||
    !nameRegex.test(lastName)
  )
    return 0;

  // 3. password must contain (other than alphabets):-
  //    3.1 -> Any of these --> @  -  .  _  --> (atleast 1)
  //    3.2 -> digits --> 0-9 --> (atleast 1)
  const passRegex = /^(?=.*[0-9])(?=.*[@._\-])[A-Za-z0-9@._\-]+$/; // we don't follow this for password.
  // cuz we write regex for simple logic. this password logic is complex. hence, no need at all usually.

  if (!password || !passRegex.test(password)) return 0;

  return 1;
};

module.exports = {
  profileUpdateHelper,
};

// Go through this link for regex used:- https://chatgpt.com/share/67f93c8c-3abc-8005-949b-25ea282e746a
