const handleImage = (req, res, db) => {
  const { id } = req.body;
  db.select('*')
    .returning('entries')
    .from('users')
    .where({ id })
    .increment('entries', 1)
    .then((entries) => {
      entries
        ? res.status(200).json(entries[0])
        : res.status(404).json('Update entries failed');
    })
    .catch((err) => {
      res.status(404).json('Update entries failed');
    });
};

module.exports = {
  handleImage,
};
