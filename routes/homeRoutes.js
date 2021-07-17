const router = require('express').Router(),
homeController = require("../controllers/homeController")


router.post('/sign-up/create', homeController.validate,homeController.signUp,homeController.redirectView);
router.get('/sign-up', homeController.signUpPage);
router.get('/chat', homeController.chatHome, homeController.redirectView);
router.get('/login', homeController.login);
router.post('/login/authenticate', homeController.authenticate);
router.get('/logout', homeController.logout, homeController.redirectView);



router.get('/', homeController.home);
// router.use()
module.exports = router;
