
const router = require('express').Router(),
    privateMessageController = require("../controllers/privateMessageController"),
    {ensureLoggedIn} = require('connect-ensure-login');


/* GET users listing. */

// router.get('/message/create',privateMessageController.create);
router.use(ensureLoggedIn("/login"))
router.get('/:SecondUserId/chat', privateMessageController.chat);
router.get('/', privateMessageController.home);

module.exports = router;
