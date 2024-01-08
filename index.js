require('dotenv').config();
const express = require('express')
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const striptags = require('striptags');
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const Router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
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

app.post('/user_signup', upload.array('multiple_input', 3), async (req, res) => {
  var name = req.body.username;
  var email = req.body.usermail;
  var password = req.body.userpass;
  var phone_number = req.body.userph_no
  var hashedPassword = await bcrypt.hash(password, 10);

  if (!name || !email) {
    return res.status(400).send('Title and content are required.');
  }

  req.files.forEach((single_image) => {
    userlogin.create({ name: name, email: email, password: hashedPassword, phone_number: phone_number, image: single_image.filename })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  return res.sendFile(path.join(__dirname, 'login.html'));  // Updated path
});

app.post('/admin_signup', upload.array('multiple_input', 3), async (req, res) => {
  var name = req.body.username;
  var email = req.body.usermail;
  var password = req.body.userpass;
  var phone_number = req.body.userph_no
  var hashedPassword = await bcrypt.hash(password, 10);
  // Check if title and content are present
  if (!name || !email) {
    return res.status(400).send('Title and content are required.');
  }

  req.files.forEach((single_image) => {
    adminlogin.create({ name: name, email: email, password: hashedPassword, phone_number: phone_number, image: single_image.filename })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  });
  return res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', function (req, res) {
  res.set({
    'Access-control-Allow-Origin': '*'
  });
  return res.sendFile(path.join(__dirname, 'login.html'));  // Updated path
})

app.post('/user_login', async (req, res) => {
  const { usermail, userpass, userph_no } = req.body;

  try {
    // Check if the user exists in the database by email or phone
    const user = await userlogin.findOne({
      $or: [
        { email: usermail },
        { phone_number: userph_no },
      ],
    });
    console.log(user);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(userpass, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
      console.log(isPasswordValid);
      // Include the token in the redirect URL
      // return res.redirect(`/userinterface.html?token=${token}`);
      return res.redirect(`/userinterface.html?token=${token}&username=${user._id}`);
    } else {
      return res.status(401).send('Invalid password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/userinterface.html', (req, res) => {

  res.redirect('/view');

});
app.set('view engine', 'ejs');

// Assuming you're using Express
app.get('/view', (req, res) => {
  userlogin.find({})
    .then((posts) => {
      // Remove HTML tags from the content field
      const sanitizedPosts = posts.map(post => {
        return {
          _id: post._id,
          title: post.name,
          content: post.email,
          phone_number: post.phone_number,
          Picture: post.image,
          __v: post.__v
        };
      });
      res.render('userprofile', { x: sanitizedPosts });
      console.log(sanitizedPosts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Internal Server Error');
    });
});


app.post('/admin_login', async (req, res) => {
  const { adminmail, adminpass, adminph_no } = req.body;

  try {
    // Check if the user exists in the database by email or phone
    const user = await adminlogin.findOne({
      $or: [
        { email: adminmail },
        { phone_number: adminph_no },
      ],
    });
    console.log(user);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(adminpass, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
      console.log(isPasswordValid);
      // Include the token in the redirect URL
      // return res.redirect(`/userinterface.html?token=${token}`);
      return res.redirect(`/adminuserinterface.html?token=${token}`);
    } else {
      return res.status(401).send('Invalid password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/adminuserinterface.html', (req, res) => {

  res.redirect('/adminview');

});
app.set('view engine', 'ejs');

// Assuming you're using Express
app.get('/adminview', (req, res) => {
  userlogin.find({})
    .then((posts) => {
      // Remove HTML tags from the content field
      const sanitizedPosts = posts.map(post => {
        return {
          _id: post._id,
          name: post.name,
          email: post.email,
          password: post.password,
          phone_number: post.phone_number,
          image: post.image,
          __v: post.__v
        };
      });

      res.render('admindashboard', { x: sanitizedPosts });
      console.log(sanitizedPosts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Internal Server Error');
    });
});
// app.use(methodOverride('_method'));

app.put('/users/update/:useremail', (req, res) => {
  const useremail = req.params.useremail;
  console.log(useremail);
  const newData = req.body;
  console.log(newData);

  userlogin.updateOne({ email: useremail },  { $set: newData }, { upsert: true })
    .then(document => {
      if (document) {
        console.log('updates', document);
        res.json(document);
      } else {
        console.log('no documents found');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err); // Sending the error response to the client
    });
});

app.delete('/users/delete/:usermail', async (req, res) => {
  try {
    const usermail = req.params.usermail;
    console.log(usermail);
    const deletedUser = await userlogin.findOneAndDelete({ email: usermail });

    if (!deletedUser.value) {
      return res.status(404).json({ message: 'User not found' });
    }

    // res.json({ message: 'User deleted successfully' });
    res.render('admindashboard');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })

})