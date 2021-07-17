
const router = require('express').Router(),
privateMessageController = require("../controllers/privateMessageController");

/* GET users listing. */

// router.get('/message/create',privateMessageController.create);
router.get('/:SecondUserId/chat', privateMessageController.chat);
router.get('/', privateMessageController.home);

module.exports = router;
