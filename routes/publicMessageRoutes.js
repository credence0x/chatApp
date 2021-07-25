const router = require('express').Router(),
    publicMessageController = require("../controllers/publicMessageController"),
    {ensureLoggedIn} = require('connect-ensure-login');


router.use(ensureLoggedIn("/login"))
router.get('/chat', publicMessageController.chat);

module.exports = router;
