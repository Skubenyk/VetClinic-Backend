const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  try {
    res.send('Olla!))))');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: {
        ua: 'Виникли деякі проблеми',
        en: 'There are some problems',
      },
      error: error,
    });
  }
});

router.post('/registration', (req, res) => {
  try {
    //TODO
  } catch (error) {
    res.status(500).json({
      success: false,
      message: {
        ua: 'Виникли деякі проблеми',
        en: 'There are some problems',
      },
      error: error,
    });
  }
});

module.exports = router;
