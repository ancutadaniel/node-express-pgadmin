const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('Incorrect form submit');
  }

  db.select('email', 'hash')
    .from('login')
    .then((data) => {
      data[0].email === email && bcrypt.compareSync(password, data[0].hash)
        ? db
            .select('*')
            .from('users')
            .where('email', '=', email)
            .then((user) => {
              res.status(200).json(user[0]);
            })
        : res.status(400).json('Unable to get user');
    })
    .catch((err) => {
      res.status(400).json('Wrong credentials');
    });
};

module.exports = {
  handleSignIn,
};
