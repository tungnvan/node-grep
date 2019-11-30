const {Router} = require('express');
const router = Router();

const grep_controller = require('../controllers/grep-controller');

router.get('/', grep_controller.grep);

module.exports = router;