const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register

router.post("/register", async (req, res) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SEC_PASS).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }
    catch (error) {
        res.status(500).json(error);
    }

})

// Logn in

router.post("/login", async (req, res) => {
    try {

        !user && res.status(401).json("Wrong Credential");

        const user = await User.findOne({ username: req.body.username });
        const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.SEC_PASS);
        const OriginalPassword = hashPassword.toString(CryptoJS.enc.utf8);

        OriginalPassword !== req.body.password &&
            res.status(401).json("Wrong Credential");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        )

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;