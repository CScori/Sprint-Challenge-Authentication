const router = require('express').Router();
const crypt = require('bycryptjs')
const jwt = require('jsonwebtoken')

const Users = require('../users/users-model.js')
const secrets = require('../config/secret,js')

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body
  const hash = crypt.hashSync(user.password, 10)
  user.password = hash

  Users.add(user)
  .then(saved => {
    res.status(201).jason(saved)
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body

  Users.findBy({ username })
  .first()
  .then(user => {
    if (user && crypt.compareSync) {
      const token = generateToken(user)
      res.status(200).json({ token: token})
    } else {
      res.status(401).json({ message: 'Invalid'})
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

const generateToken = (user) => {
  const payload = {
    username: user.username
  }

  const options = {
    expiresIn: '8h'
  }
  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
