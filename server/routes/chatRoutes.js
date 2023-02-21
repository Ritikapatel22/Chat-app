const express = require("express")
const protect = require('../middleware/authMiddleware')
const {accessChat ,fetchChats} = require("../controller/chatController")

const router = express.Router()

router.route('/').post(protect,accessChat)
router.route('/').get(protect ,fetchChats)
// router.route('/').post(protect)
// router.route('/').post(protect)
// router.route('/').post(protect)
// router.route('/').post(protect)
module.exports = router