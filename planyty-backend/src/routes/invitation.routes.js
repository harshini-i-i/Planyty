const express = require('express');
const router = express.Router();

router.post('/send', (req, res) => {
  res.json({ message: 'Send invitation' });
});

module.exports = router;
