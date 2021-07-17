const router = require('express').Router(),
publicMessageController = require("../controllers/publicMessageController");

/* GET users listing. */

router.get('/chat', publicMessageController.chat);

module.exports = router;
