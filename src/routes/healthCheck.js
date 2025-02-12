const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
    });
});

module.exports = router;
