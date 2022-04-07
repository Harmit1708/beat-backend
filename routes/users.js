var express = require('express');
var router = express.Router();
var { mongodb, MongoClient, dbUrl } = require("../dbConfig");
var {hashPassword, hashCompare,createToken,verifyToken} = require("../Auth");
const {ObjectId} = require("mongodb")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Signup
router.post("/signup", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let db = await client.db("Beatwithmusic");
    let user = await db.collection("users").find({ email: req.body.email });
    if (user.length > 0) {
      res.json({
        statusCode: 400,
        message: "User Already Exists",
      });
    } else {
      let hashedPassword = await hashPassword(req.body.password,req.body.cpassword);
      req.body.password= hashedPassword;
      req.body.cpassword = hashedPassword;

      let user = await db.collection("users").insertOne(req.body);
      res.json({
        statusCode: 200,
        message: "User SignUp Successfull",
      }); 
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});




// Login
router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let db = await client.db("Beatwithmusic");
    let user = await db.collection("users").findOne({ email: req.body.email });
    if (user) {
      let compare = await hashCompare(req.body.password, user.password);
      if (compare) {
        let token  = await createToken(user.email,user.firstname )
        res.json({
          statusCode: 200,
          email: user.email,
          firstname: user.firstname,  
          token
        });
      } else {
        res.json({
          statusCode: 400,
          message: "Invalid Password",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "User Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});



// Add-songs
router.post("/add-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addsongs")
      .find({ name: req.body.name }).sort({name:1})
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 400,
        message: "Song Already Exists",
      });
    } else {
      let addsong = await db.collection("addsongs").insertMany(req.body);
      res.json({
        statusCode: 200,
        message: "Song Add Successful",
        data: addsong,
      });
    }
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// Allsongs
router.get("/all-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addsongs")
      .find().sort({name:1})
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 200,
        message: "Sucessfully",
        data:music
      });
    } 
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});


// trending-songs
router.post("/add-trending-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addtrendingsong")
      .find({ name: req.body.name })
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 400,
        message: "Song Already Exists",
      });
    } else {
      let addsong = await db.collection("addtrendingsong").insertMany(req.body);
      res.json({
        statusCode: 200,
        message: "Song Add Successful",
        data: addsong,
      });
    }
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// all-trending-songs
router.get("/all-trending-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addtrendingsong")
      .find().sort({name:1})
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 200,
        message: "Sucessfully",
        data:music
      });
    } 
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// Add New Song
router.post("/add-new-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addnewsong")
      .find({ name: req.body.name })
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 400,
        message: "Song Already Exists",
      });
    } else {
      let addsong = await db.collection("addnewsong").insertMany(req.body);
      res.json({
        statusCode: 200,
        message: "Song Add Successful",
        data: addsong,
      });
    }
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// get new songs
router.get("/all-new-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addnewsong")
      .find().sort({name:1})
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 200,
        message: "Sucessfully",
        data:music
      });
    } 
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});


// Add old Song
router.post("/add-old-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addoldsong")
      .find({ name: req.body.name })
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 400,
        message: "Song Already Exists",
      });
    } else {
      let addsong = await db.collection("addoldsong").insertMany(req.body);
      res.json({
        statusCode: 200,
        message: "Song Add Successful",
        data: addsong,
      });
    }
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// get old song
router.get("/all-old-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addoldsong")
      .find().sort({name:1})
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 200,
        message: "Sucessfully",
        data:music
      });
    } 
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});


// add-album-song
router.post("/add-album-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addalbumsong")
      .find({ name: req.body.name })
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 400,
        message: "Song Already Exists",
      });
    } else {
      let addsong = await db.collection("addalbumsong").insertMany(req.body);
      res.json({
        statusCode: 200,
        message: "Song Add Successful",
        data: addsong,
      });
    }
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// get album song
router.get("/all-album-songs", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("addalbumsong")
      .find().sort({name:1})
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 200,
        message: "Sucessfully",
        data:music
      });
    } 
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});



// Favorite
router.post("/favorites", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("favorite")
      .find({ name: req.body.name })
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 400,
        message: "Song Already Exists",
      });
    } else {
      delete req.body._id;
      let addsong = await db.collection("favorite").insertOne(req.body);
      res.json({
        statusCode: 200,
        message: "Song Add Successful",
        data: addsong,
      });
    }
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

// get album song
router.get("/all-favorites", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("favorite")
      .find().sort({name:1})
      .toArray();
    if (music.length > 0) {
      res.json({
        statusCode: 200,
        message: "Sucessfully",
        data:music
      });
    } 
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});


router.delete("/delete-favorites/:id", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("Beatwithmusic");
    let music = await db
      .collection("favorite")
      .find({ name: req.body.name })
      .toArray();
    if (music) {
      let addsong = await db.collection("favorite").deleteOne({_id:ObjectId(req.params.id)});
      console.log(addsong)
      res.json({
        statusCode: 200,
        message: "Song Delete Successful",
        
      });
    } 
  } catch {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});


// Auth
router.post("/auth",verifyToken,async(req,res)=>{
  res.json({
    statusCode:200,
    message:req.body.purpose
  })
})


module.exports = router;