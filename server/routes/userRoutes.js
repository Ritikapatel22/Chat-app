const express = require("express")
const protect = require("../middleware/authMiddleware")
const {register , authUser ,alluser} = require("../controller/userController")
const multer = require('multer')
const path = require('path')

const imageStorage = multer.diskStorage({
    destination: 'images', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
    }
});
const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
  }
}) 

const router = express.Router()

router.route('/').post(imageUpload.single("pic"), register)
router.route('/login').post(authUser)
router.route('/').get(protect,alluser)

module.exports = router