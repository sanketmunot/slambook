var express = require('express')
require('dotenv').config();
app = express();
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

app.set("view engine", "ejs")
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({ extended: false }))


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', function (req, res) {
    res.render('index')
})

app.get('/loginform', function (req, res) {
    res.render('loginform', { er: "" })
})

app.get('/signup', function (req, res) {
    res.render('signup', { er: "" })
})
// _________________________________________________

var schema = new mongoose.Schema({
    _id: String,
    password: String,
    name: String,
    url:String,
    slam: {
        name: String,
        nickname: String,
        email: String,
        phone: String,
        defineus: String,
        moment: String,
        chill: String,
        defineme: String,
        advice: String,
    }
});

var userModel = mongoose.model('SlamBook', schema);

app.post('/signupcomplete', function (req, res) {
    var email = req.body.signemail;
    var pass = req.body.signpassword;
    var name = req.body.signname;
    var id = mongoose.Types.ObjectId();
    var user = new userModel({ _id: email, password: pass, name: name, url:id });

    user.save(function (err, data) {
        if (err) {
            res.render("signup", { er: '*Email Already Exist' });
        }
        else {
            res.render('loginform',{er:""});
            // res.send(data)
        }
    })

})


app.post('/login', function (req, res) {
    var email = req.body.email;
    var pass = req.body.password;
    userModel.find({ "_id": email }, function (err, data) {

        if (err) {
            res.render('loginform', { er: "*Incorrect Details" });
        }
        else {
            console.log(data)
            if (data[0]["password"] == pass) {
                // mongoose.connection.close()
                res.render('loggedin',{data:data});
            }
            else {
                res.render('loginform', { er: "*Incorrect Details" });
            }
        }
    })
})



app.get('/slambook', function (req, res) {
    var id = req.query.id;
    var name = req.query.name;
    res.render('slam',{id:id,name:name})
    // res.send(name)
})


app.post('/submit',function(req,res){
    // mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    var url = req.body.url;
    var name = req.body.name;
    var nickname = req.body.nickname;
    var email = req.body.email;
    var phone = req.body.phone;
    var defineus = req.body.defineus;
    var moment = req.body.moment;
    var chill = req.body.chill;
    var defineme = req.body.defineme;
    console.log(url)
    userModel.findOneAndUpdate({url: url}, {$push: 
        {'slam':{
            'name':name,
            'nickname':nickname,
            'email':email,
            'phone':phone,
            'defineus':defineus,
            'moment':moment,
            'chill':chill,
            'defineme':defineme,
        }   } 
    }, {new: true}, function (err, data) {
        if (err) {
            res.send('err');
        }
        res.render('index')
    });
//     mongoose.connection.close()
})



app.listen(8080, function () {
    console.log("server started")
})