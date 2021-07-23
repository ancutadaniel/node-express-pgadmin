const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submit');
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({ hash, email })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name,
            joined: new Date(),
          })
          .then((data) => {
            res.status(200).json(data[0]);
          })
          .catch((err) => {
            res.status(400).json('Unable to register');
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    res.status(400).json('Unable to register, user already exist')
  );
};

module.exports = {
  handleRegister,
};
