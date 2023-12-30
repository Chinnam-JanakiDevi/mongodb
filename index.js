require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const striptags = require('striptags');
const Grid = require("gridfs-stream");
const crypto = require("crypto");

const app = express();
const Router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

const userlogin = require("./model/user");
const adminlogin = require("./model/admin");

const PORT = process.env.PORT || 5000
MONGO_URI = "mongodb+srv://mongodb:4GgsHlwHQK4cox94@cluster0.0fkb1mh.mongodb.net/sample"
// mongodb+srv://chinnamjanakidevi123:bNnaW8MhXAwtlnAe@cluster0.zkix1hk.mongodb.net
//mongodb+srv://mongodb:bNnaW8MhXAwtlnAe@cluster0.0fkb1mh.mongodb.net/?retryWrites=true&w=majority

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


app.get('/', function (req, res) {
  res.set({
    'Access-control-Allow-Origin': '*'
  });
  return res.sendFile(path.join(__dirname, 'index.html'));  // Updated path
})


// Initialize GridFS
Grid.mongo = mongoose.mongo;
express.static('public')
let storage = multer.diskStorage({
  destination: './public/images', //directory (folder) setting
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname) // file name setting
  }
})
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif'

    ) {
      cb(null, true)
    }
    else {
      cb(null, false);
      cb(new Error('Only jpeg,  jpg , png, and gif Image allow'))
    }
  }
})

app.post('/user_signup', upload.array('multiple_input', 3), (req, res) => {
  var name = req.body.username;
  var email = req.body.usermail;
  var password = req.body.userpass;
  var phone_number = req.body.userph_no
  
  // Check if title and content are present
  if (!name || !email) {
    return res.status(400).send('Title and content are required.');
  }

  req.files.forEach((single_image) => {
    userlogin.create({ name: name, email: email, password: password, phone_number: phone_number, image: single_image.filename })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  res.send("success");
});

app.post('/admin_signup', upload.array('multiple_input', 3), (req, res) => {
  var name = req.body.username;
  var email = req.body.usermail;
  var password = req.body.userpass;
  var phone_number = req.body.userph_no
  // Check if title and content are present
  if (!name || !email) {
    return res.status(400).send('Title and content are required.');
  }

  req.files.forEach((single_image) => {
    adminlogin.create({ name: name, email: email, password: password, phone_number: phone_number, image: single_image.filename })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  res.send("success");
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })

})





// const express = require('express')
// const mongoose = require('mongoose')
// const Book = require("./model/books");
// const Insight = require('./model/insights');
// const cors=require("cors");
// const app=express();
// const path = require("path"); 
// const bodyParser=require("body-parser");
// const Router = express.Router(); 

// const PORT = process.env.PORT || 5000
// //mongodb+srv://chinnamjanakidevi123:<password>@cluster0.zkix1hk.mongodb.net/
// mongoose.set('strictQuery', false);
// MONGO_URI="mongodb+srv://chinnamjanakidevi123:bNnaW8MhXAwtlnAe@cluster0.zkix1hk.mongodb.net/sample"
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// }

// //Routes go here


// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname,'index.html'));  // Updated path
// });


// app.get('/api/insights', async (req, res) => {
//     try {
//       const insights = await Insight.find();
//       res.json(insights);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
// //Connect to the database before listening
// connectDB().then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);    })
// })

//mULTIPLE IMAGE UPLODING
// app.post('/multiplepost', upload.array('multiple_input', 3), (req, res) => {
//   req.files.forEach((singale_image) => {
//     image.create({ image: singale_image.filename })
//       .then((x) => {
//         res.redirect('/')
//       })
//       .catch((y) => {
//         console.log(y)
//       })
//   })
// })