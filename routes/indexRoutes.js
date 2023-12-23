const express = require("express");
const passport = require("passport");
const userModel = require("../models/userModel");
const postModel = require("./../models/postModel");
const router = express.Router();
const upload = require("./../utils/multer");

const isLoggedIn = require("../utils/auth");

// Login route (home page)
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })(req, res, next);
});

// REGISTER ROUTE
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { email, fullname, username } = req.body;

  try {
    const user = await new userModel({
      email: email,
      username: username,
      name: fullname,
    });

    console.log(user);

    userModel.register(user, req.body.password, (err) => {
      if (err) {
        console.log(err);
        return res.send("Error during registration");
      }

      passport.authenticate("local")(req, res, async function () {
        const user = await userModel.findOne({
          username: req.session.passport.user,
        });
        console.log(user);

        res.render("profile", { footer: true, user });
      });
    });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});

// profile Route
router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts")
  console.log(user);
  res.render("profile", { footer: true, user });
});

// PROFILE EDIT ROUTE
router.get("/edit", isLoggedIn, (req, res) => {
  res.render("edit", { footer: true });
});

router.post(
  "/edit",
  isLoggedIn,
  upload.single("editImage"),
  async (req, res) => {
    try {
      let updatedFields = {
        username: req.body.username,
        name: req.body.name,
        bio: req.body.bio,
      };

      if (req.file) {
        updatedFields.profileImage = req.file.filename;
      }

      const user = await userModel.findOneAndUpdate(
        { username: req.session.passport.user },
        updatedFields,
        { new: true }
      );

      // Update the session
      req.login(user, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
        res.redirect("/profile");
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// FEED ROUTE
router.get("/feed", isLoggedIn, async(req, res) => {
  const posts = await postModel.find().populate("user")
  res.render("feed", { footer: true , posts });
});

// UPLOAD ROUTE
router.get("/upload", isLoggedIn, (req, res) => {
  res.render("upload", { footer: true });
});

router.post("/upload", upload.single("uploadImage"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      user: user._id,
      username : user.name,
      caption: req.body.caption,
      image: req.file.filename,
    });

    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});

// search route
router.get('/search' ,(req,res)=>{
res.render('search' , {footer:true})
})

module.exports = router;
