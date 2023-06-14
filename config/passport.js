const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local");
const User = require("../models").user;

passport.serializeUser((user, done) => {
  console.log("serialize使用者...");
  console.log(user);
  done(null, user._id); //將mongodb的id，存在session
  //並將id簽名後，以cookie的形式給使用者
});

passport.deserializeUser(async (_id, done) => {
  console.log(
    "Deserialize使用者...使用serializeUser儲存的id，去找到資料庫內的資料"
  );
  let foundUser = await User.findOne({ _id });
  done(null, foundUser); //將req.user這個屬性設定為foundUser
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://thrift-store.herokuapp.com/api/user/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入Google Strategy的區域");
      //確認googleID是否被註冊過
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log("googleID已經註冊過。無須存入資料庫");
        done(null, foundUser);
      } else {
        console.log("偵測到新用戶。須將資料存入資料庫內");
        let newUser = new User({
          username: profile.displayName,
          googleID: profile.id,
          email: profile.emails[0].value,
        });
        let savedUser = await newUser.save();
        console.log("成功創建新用戶");
        done(null, savedUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async function (username, password, done) {
    let foundUser = await User.findOne({ email: username });
    if (foundUser) {
      foundUser.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(null, false);
        }
        if (isMatch) {
          return done(null, foundUser);
        }
      });
    } else {
      done(null, false);
    }
  })
);
