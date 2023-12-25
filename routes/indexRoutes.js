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


    userModel.register(user, req.body.password, (err) => {
      // if (err) {
      //   console.log(err);
      //   return res.send(err.message);
      // }

      passport.authenticate("local")(req, res, async function () {
        const user = await userModel.findOne({
          username: req.session.passport.user,
        });

        res.render("profile", { footer: true, user });
      });
    });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

// profile Route
router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts")
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
  const user = await userModel.findOne({username : req.session.passport.user})
  const posts = await postModel.find().populate("user")
  res.render("feed", { footer: true , posts , user });
});

// UPLOAD ROUTE
router.get("/upload", isLoggedIn, (req, res) => {
  res.render("upload", { footer: true });
});

router.post("/upload", upload.single("uploadImage"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.send(`No file selected <a href = '/upload'>back</a>` )
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

router.get('/username/:name' ,async(req,res)=>{
  const regex = new RegExp(`^${req.params.name}`, 'i')
const users = await userModel.find({username : regex})
console.log(regex);
console.log(users);
res.json(users)
})




// Like route
router.get('/like/post/:id', async(req,res)=>{
  const user = await userModel.findOne({username : req.session.passport.user})
  const post = await postModel.findOne({_id : req.params.id})

  // if already liked then remove the like
  if(post.likes.indexOf(user._id)===-1){
    post.likes.push(user._id)
  }else{
    post.likes.splice(post.likes.indexOf(user.id),1)
  }

  await post.save()
  res.redirect('/feed')

  
  
})

module.exports = router;
