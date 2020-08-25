var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;

var chuyenthanhObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { request } = require('http');
const { response } = require('../app');
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'khuyenhoa';
// Passport session setup. 
passport.serializeUser(function(user, done) {
  // console.log(user);
  
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



// facebook
router.get('/auth/fb', passport.authenticate('facebook',{scope: ['email','user_photos','public_profile']}));
router.get('/auth/fb/cb',
  passport.authenticate('facebook', { failureRedirect: '/#form__container' }),
  function(req, res) {
    // Successful authentication, redirect home.   
    var newuser = [req.user._json];
    var newuserchange = newuser.map(function(Newuser){
      return {
        email: Newuser.email,
        displayName: Newuser.name,
        id : Newuser.id
      }
    });
    // console.log(newuserchange);
    req.session.newuser = newuserchange;
    // req.session.newuser.push(newuser);
    console.log(req.session.newuser);
    res.redirect('/');
  }
);

router.get('/logout', function(req, res){
  req.session.newuser = null;
  req.logout();
  res.redirect('/');
});

// google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/#form__container' }),
  function(req, res) {
    // Successful authentication, redirect home.
    var newuser = req.user;
    req.session.newuser = [];
    req.session.newuser.push(newuser);
    // console.log(req.session.newuser);
    res.redirect('/');
  });


// Đăng ký tài khoản
router.post('/registration', function(req, res, next) {
  var duLieu = {
    'displayName': req.body.fullname,
    'email': req.body.email,
    'password': req.body.password
  }
  const findDocuments = function(db, callback) {
    const collection = db.collection('nguoidung');
    collection.find({'email':req.body.email}).toArray(function(err, docs) {
      assert.equal(err, null);
      // console.log(docs);
      if(docs.length == 0){
        const insertDocuments = function(db, callback) {
          // Get the documents collection
          const collection = db.collection('nguoidung');
          // Insert some documents
          collection.insert(duLieu, function(err, result) {
            assert.equal(err, null);
            console.log("Thêm dữ liệu thành công");
            callback(result);
          });
        }
        MongoClient.connect(url, function(err, client) {
          assert.equal(null, err);
          const db = client.db(dbName);
        
          insertDocuments(db, function(data) {
            client.close();
          });
        });
      }
      callback(docs);
    });
  }
  
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
  
    findDocuments(db, function(dulieu) {
      // console.log(dulieu);
      client.close();
    });
  });
  
  res.redirect('/#login');
});


// login bằng form
router.get('/login', function(req, res, next) {
  res.redirect('/#login');
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/#login', failureFlash: true}),
  function(req, res) {
    var newuser = req.user;
    req.session.newuser = [];
    req.session.newuser.push(newuser);
    // console.log(req.session.newuser);
    res.redirect('/');
 }
);


// xác thực người dùng đã login hay chưa
router.post('/checklogin', function(req, res, next){
  var login = false;
  if(req.session.newuser){
    login = true;
  }
  res.send({login});//true là đã login,false là chưa login
});


router.get('/', function(req, res, next) {
  const findDocuments = function(db, callback) {
    const collection = db.collection('bang1');
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
      findDocuments(db, function(dulieu) {
        res.render('index', { title: 'Shop Khuyên Hoa', data:dulieu ,danhsach:req.session.cartAdd, user:req.session.newuser});
        // console.log(user)
        client.close();
      });
    })
});//end in dữ liệu re view



router.get('/chitietsp/*.:idsanpham', function(req, res, next) {
  var idsanpham = req.params.idsanpham;
  res.cookie('idCart', idsanpham , {maxAge:604800});
  if(!req.session.sanphamdaxem){
    req.session.sanphamdaxem = [];
  }
  if(req.session.sanphamdaxem.indexOf(idsanpham) == -1){
    req.session.sanphamdaxem.push(idsanpham);
  }


  console.log(danhsach = req.session.sanphamdaxem)
  const findDocuments = function(db, callback) {
    const collection = db.collection('bang1');
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
      findDocuments(db, function(dulieu) {
        res.render('chitietsp', { title: 'Chi tiết', data:dulieu , danhsachseen:req.session.sanphamdaxem, idsanpham:idsanpham , danhsach:req.session.cartAdd, user:req.session.newuser});
       // console.log(idsanpham)
        client.close();
      });
    })
});

router.get('/listseen', function(req, res, next) {
  res.render('listseen', {danhsachseen :req.session.sanphamdaxem });
});

//sô lượng sản phẩm trong giở hàng
router.post('/soluongSp', function(req, res, next) {
  if(req.session.cartAdd){
    var Cart = req.session.cartAdd.slice();
    console.log(Cart)
    var soluong = Cart.length;
    res.send({soluong});
  }
});




router.get('/thanhtoan', function(req, res, next){
  var idsp = req.cookies.idCart;
  console.log(idsp);
  if(!req.session.cartAdd){
    req.session.cartAdd = [];
  }
  if(req.session.cartAdd.indexOf(idsp) == -1){
    req.session.cartAdd.push(idsp);
  }
  console.log(danhsach = req.session.cartAdd);
  
  const findDocuments = function(db, callback) {
    const collection = db.collection('bang1');
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
      findDocuments(db, function(dulieu) {
        res.render('thanhtoan', { title: 'Thanh toán nhanh', data:dulieu, idcart:idsp, danhsach:req.session.cartAdd, user:req.session.newuser});
        console.log(danhsach)
        client.close();
      });
    })
});


router.get('/thanhtoan1', function(req, res, next){
  var idsp = req.cookies.idCart;
  console.log(idsp);
  if(!req.session.cartAdd){
    req.session.cartAdd = [];
  }
  if(req.session.cartAdd.indexOf(idsp) == -1){
    req.session.cartAdd.push(idsp);
  }
  console.log(danhsach = req.session.cartAdd);
  
  const findDocuments = function(db, callback) {
    const collection = db.collection('bang1');
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
      findDocuments(db, function(dulieu) {
        res.render('headercart', { title: 'Chi tiết', data:dulieu, idcart:idsp, danhsach:req.session.cartAdd });
        // console.log(dulieu)
        client.close();
      });
    })
});

router.get('/thanhtoan/xoa.:idcanxoa', function(req, res, next) {
  var idXoa = req.params.idcanxoa;
  console.log(idXoa);
  var danhsach = req.session.cartAdd;
  var lengthdanhsach = danhsach.length;
  for(var i = 0; i < lengthdanhsach; i++){
    if(idXoa == danhsach[i]){
      danhsach.splice(i, 1);
      res.clearCookie('idCart');
    }
  }

  const findDocuments = function(db, callback) {
    const collection = db.collection('bang1');
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server thanh toan");
    const db = client.db(dbName);
      findDocuments(db, function(dulieu) {
        res.render('thanhtoan', { title: 'Thanh toán nhanh', data:dulieu, danhsach:req.session.cartAdd, user:req.session.newuser});
        console.log(danhsach);
        client.close();
      });
    })
});



router.get('/caodenthap', function(req, res, next) { //sắp xếp cao đến thấp
  var mysort = { 'gia': -1 };
  const findDocuments = function(db, callback) {
    const collection = db.collection('bang1');
    collection.find().sort(mysort).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log(docs);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
      findDocuments(db, function(dulieu) {
        res.render('index', { title: 'Shop Khuyên Hoa', data:dulieu ,danhsach:req.session.cartAdd ,user:req.session.newuser});
        // console.log(dulieu)
        client.close();
      });
    })
});

router.get('/thapdencao', function(req, res, next) { //sắp xếp cao đến thấp
  var mysort = { 'gia': 1 };
  const findDocuments = function(db, callback) {
    const collection = db.collection('bang1');
    collection.find().sort(mysort).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log(docs);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
      findDocuments(db, function(dulieu) {
        res.render('index', { title: 'Shop Khuyên Hoa', data:dulieu ,danhsach:req.session.cartAdd, user:req.session.newuser});
        // console.log(dulieu)
        client.close();
      });
    })
});

router.get('/banchaynhat', function(req, res, next) { //sắp xếp bán chạy
  var mysort = { 'sell': -1 };
  const findDocuments = function(db, callback) {
    const collection = db.collection('bang1');
    collection.find().sort(mysort).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log(docs);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
      findDocuments(db, function(dulieu) {
        res.render('index', { title: 'Shop Khuyên Hoa', data:dulieu ,danhsach:req.session.cartAdd, user:req.session.newuser});
        // console.log(dulieu)
        client.close();
      });
    })
});

//ajax Cart
router.post('/thanhtoanInside', function(req, res, next) {
  var Cartlist = req.session.cartAdd.slice();
  var valueAll = req.body.valueAll.split(',');
  req.session.soluongSp = valueAll;//sesseion lưu số lượng mỗi sản phẩm mua
  console.log(valueAll);
  var totalAll = [];
  var CartlistId = Cartlist.map(function(cart){
    return {
      '_id': chuyenthanhObjectId(cart)
    }
  });
  console.log(CartlistId);
  CartlistId.forEach(function(list, index){
    const findDocuments = function(db, callback) {
      // Get the documents collection
      const collection = db.collection('bang1');
      // Find some documents
      collection.find(list).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("tìm thấy bản ghi sau");
        docs.forEach(function(dsCart){
          var totalCart = Number(valueAll[index]) * Number(`${dsCart.priceCurrent.split('.').join('')}`);
          totalAll.push(totalCart);
        });
        if(totalAll.length == CartlistId.length){
          callback(totalAll);
          totalAll = [];
        }
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
        findDocuments(db, function(danhsachCart) {
          console.log(danhsachCart);
          res.send({danhsachCart});
          client.close();
        });
    })
  });
});//end

//kiểm tra tài khoản người dùng đã có địa chỉ chưa nếu chưa thì đến trang thanhtoan2, nếu rồi thì đến trang thanhtoan3
router.post('/checkaddress', function(req, res, next){
  if(req.session.newuser){
    var user = req.session.newuser.slice();
    var emailUser = user[0].email;
    const findDocuments = function(db, callback) {
      const collection = db.collection('nguoidung');
      collection.findOne({ email: emailUser }, function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        callback(docs);
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      findDocuments(db, function(data) {
        console.log(data);
        if(data.diachi){
          if(data.sanphammua){
            res.send({checkAddress: true, payed:true}); //nếu người dùng đã đặt hang trước đó
          }
          else{
            res.send({checkAddress: true, payed:false}); // người dùng chưa từng đặt hàng
          }
        }
        else{
          res.send({checkAddress: false});
        }
        client.close();
      });
    });
  }
  else {
    res.send({checklogin: false});
  }
});

// trang thanh toán 2
router.get('/checkout', function(req, res, next){
  if (req.session.newuser) { //trả về true nếu đã đăng nhập rồi
    res.render('thanhtoan2');
  } else {
    res.redirect('/#login');
  }
});

//lấy địa chỉ từ database đưa ra trang thanh toán 3
router.get('/payproduct', function(req, res, next){
  var dsCartpay = [];
  if(req.session.newuser){
    var user = req.session.newuser.slice();
    var emailUser = user[0].email;
    const findDocuments = function(db, callback) {
      const collection = db.collection('nguoidung');
      collection.findOne({ email: emailUser }, function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        callback(docs);
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      findDocuments(db, function(diachi) {
        // console.log(data);
        if(req.session.cartAdd){
          var cartlist = req.session.cartAdd.slice();
          var cartlistId = cartlist.map(function(cart){
            return {
              '_id' : chuyenthanhObjectId(cart)
            }
          });
          cartlistId.forEach(function(list, index){
            const findDocuments = function(db, callback) {
              // Get the documents collection
              const collection = db.collection('bang1');
              // Find some documents
              collection.find(list).toArray(function(err, docs) {
                assert.equal(err, null);
                console.log("tìm thấy bản ghi sau");
                docs.forEach(function(dscart){
                  dsCartpay.push(dscart);
                })
                if(dsCartpay.length == cartlistId.length){
                  callback(dsCartpay);
                  dsCartpay = [];
                }
              });
            }
            MongoClient.connect(url, function(err, client) {
              var total = 0;
              
              assert.equal(null, err);
              const db = client.db(dbName);
                findDocuments(db, function(danhsachCart) {
                  var soluong = []; 
                  if(req.session.soluongSp){
                    danhsachCart.forEach(function(ds , index){
                      total = total + Number(ds.priceCurrent.split('.').join('')) * Number(req.session.soluongSp[index]);  //tổng tiền phải trả
                    });
                    soluong = req.session.soluongSp;
                  }
                  else{
                    danhsachCart.forEach(function(ds , index){
                      total = total + Number(ds.priceCurrent.split('.').join(''));  //tổng tiền phải trả
                      soluong.push('1');
                    });
                    console.log(soluong);
                  }
                  
                  res.render('thanhtoan3', {diachi: diachi, sanphampay: danhsachCart, tongtien: total.toLocaleString('vi'), soluong: soluong});
                  client.close();
                });
            })
    
          });
        }else{
          res.redirect('/');
        }

        client.close();
      });
    });
  }
  else{
    res.redirect('/');
  }
});//end

// dữ liệu từ form address
router.post('/checkout/diachi', function(req, res, next){
  var diachi = {
    'hoten': req.body.hoten,
    'sdt': req.body.sdt,
    'city': req.body.city,
    'huyen': req.body.huyen,
    'xa': req.body.xa,
    'diachi': req.body.diachi
  }
  console.log(diachi);
  var idUpdate;
  var dsCartpay = [];
  var User = req.session.newuser.slice();
  User.forEach(function(user){
    idUpdate = user.email;
  })

  const updateDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ 'email' : idUpdate }
      , { $set: diachi }, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
  
    updateDocument(db, function() {
      var cartlist = req.session.cartAdd.slice();
      var cartlistId = cartlist.map(function(cart){
        return {
          '_id' : chuyenthanhObjectId(cart)
        }
      });
      cartlistId.forEach(function(list, index){
        const findDocuments = function(db, callback) {
          // Get the documents collection
          const collection = db.collection('bang1');
          // Find some documents
          collection.find(list).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("tìm thấy bản ghi sau");
            docs.forEach(function(dscart){
              dsCartpay.push(dscart);
            })
            if(dsCartpay.length == cartlistId.length){
              callback(dsCartpay);
              dsCartpay = [];
            }
          });
        }

        MongoClient.connect(url, function(err, client) {
          var total = 0;
          
          assert.equal(null, err);
          const db = client.db(dbName);
            findDocuments(db, function(danhsachCart) {
              var soluong = []; 
              if(req.session.soluongSp){
                danhsachCart.forEach(function(ds , index){
                  total = total + Number(ds.priceCurrent.split('.').join('')) * Number(req.session.soluongSp[index]);  //tổng tiền phải trả
                });
                soluong = req.session.soluongSp;
              }
              else{
                danhsachCart.forEach(function(ds , index){
                  total = total + Number(ds.priceCurrent.split('.').join(''));  //tổng tiền phải trả
                  soluong.push('1');
                });
                console.log(soluong);
              }
              
              res.render('thanhtoan3', {diachi: diachi, sanphampay: danhsachCart, tongtien: total.toLocaleString('vi'), soluong: soluong});
              client.close();
            });
        })
      });
      client.close();
    });
  });
});//end

// khi người dùng xác nhận mua hàng khi trong đơn hàng  chưa có gì
router.post('/payend', function(req, res, next) {
  var date = new Date();
  var time = `${date.getHours()}:${date.getMinutes()}/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  var user = req.session.newuser.slice();
  var emailUser = user[0].email;
  var cartlist = req.session.cartAdd.slice();
  var listSp = [];
  var cartlistId = cartlist.map(function(cart){
    return {
      '_id' : chuyenthanhObjectId(cart)
    }
  });
  cartlistId.forEach(function(list, index){
    const findDocuments = function(db, callback) {
      // Get the documents collection
      const collection = db.collection('bang1');
      // Find some documents
      collection.find(list).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("tìm thấy bản ghi sau");
        sanphamPay = docs.map(function(dataCart){
          var soluong = 1;
          if(req.session.soluongSp){
            soluong = req.session.soluongSp[index];
          }
          return {
            _id: dataCart._id,
            tensanpham: dataCart.tenSanPham,
            gia: dataCart.gia,
            soluong: soluong,
            time: time
          }
        });
        listSp.push(sanphamPay[0]);
        if(listSp.length == cartlistId.length){
          callback(listSp);
        }
        
      });
    }

    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
    
      const db = client.db(dbName);
    
      findDocuments(db, function(sanphammua) {
        console.log(sanphammua);
        //update những hàng mà tài khoản này mua
        const updateDocument = function(db, callback) {
          // Get the documents collection
          const collection = db.collection('nguoidung');
          // Update document where a is 2, set b equal to 1
          collection.updateOne({ email : emailUser }
            , { $set: {sanphammua} }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            req.session.cartAdd = null;
            callback(result);
          });
        }
        MongoClient.connect(url, function(err, client) {
          assert.equal(null, err);
          const db = client.db(dbName);
          updateDocument(db, function() {
            res.send({paydone:true});
            
            client.close();
          });
        });
        
        client.close();
      });
    });
  });
});//end

//người dùng mua hàng mới khi đang có đơn hàng cũ
router.post('/paytimeone', function(req, res, next) {
  var date = new Date();
  var time = `${date.getHours()}:${date.getMinutes()}/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  var user = req.session.newuser.slice();
  var emailUser = user[0].email;
  var cartlist = req.session.cartAdd.slice();
  var listSp = [];
  var cartlistId = cartlist.map(function(cart){
    return {
      '_id' : chuyenthanhObjectId(cart)
    }
  });
  cartlistId.forEach(function(list, index){
    const findDocuments = function(db, callback) {
      // Get the documents collection
      const collection = db.collection('bang1');
      // Find some documents
      collection.find(list).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("tìm thấy bản ghi sau");
        sanphamPay = docs.map(function(dataCart){
          var soluong = 1;
          if(req.session.soluongSp){
            soluong = req.session.soluongSp[index];
          }
          return {
            _id: dataCart._id,
            tensanpham: dataCart.tenSanPham,
            gia: dataCart.gia,
            soluong: soluong,
            time: time
          }
        });
        listSp.push(sanphamPay[0]);
        if(listSp.length == cartlistId.length){
          callback(listSp);
        }
        
      });
    }

    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      findDocuments(db, function(sanphammua) {
        console.log(sanphammua);
        //tìm sản phẩm người đó mua trước đó
        const findDocuments2 = function(db, callback) {
          const collection = db.collection('nguoidung');
          collection.findOne({ email: emailUser }, function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records 2");
            console.log(docs.sanphammua);
            var spUpdateNew = docs.sanphammua; //chứa cả sản phẩm mới mua và mua trước đó
            sanphammua.forEach(function(Sanphammua){
              spUpdateNew.push(Sanphammua);
            });
            callback(spUpdateNew);
          });
        }
        MongoClient.connect(url, function(err, client) {
          assert.equal(null, err);
          const db = client.db(dbName);
          findDocuments2(db, function(sanphammua) {
            console.log(sanphammua);
            //update những hàng mà tài khoản này mua
            const updateDocument = function(db, callback) {
              // Get the documents collection
              const collection = db.collection('nguoidung');
              // Update document where a is 2, set b equal to 1
              collection.updateOne({ email : emailUser }
                , { $set: {sanphammua} }, function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("Updated the document with the field a equal to 2");
                req.session.cartAdd = null;
                callback(result);
              });
            }
            MongoClient.connect(url, function(err, client) {
              assert.equal(null, err);
              const db = client.db(dbName);
              updateDocument(db, function() {
                res.send({paydone:true});
                client.close();
              });
            });
            client.close();
          });
        });
        
        client.close();
      });
    });
  });
});//end

//trang thông tin về người dùng
router.get('/infouser', function(req, res, next){
  if (req.session.newuser) { //trả về true nếu đã đăng nhập rồi
    var user = req.session.newuser.slice();
    var emailUser = user[0].email;
    const findDocuments = function(db, callback) {
      const collection = db.collection('nguoidung');
      collection.findOne({ email: emailUser }, function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        callback(docs);
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      findDocuments(db, function(data) {
        console.log(data);
        res.render('infouser', {title:'Đơn hàng của bạn', payproduct: data, user:req.session.newuser, danhsach:req.session.cartAdd});
        client.close();
      });
    });

  } else {
    res.redirect('/#login');
  }
});//end

//khi người dùng muốn hủy đơn hàng
router.post('/infouser/productcancel', function(req, res, next){
  var indexRemove = req.body.indexRemove;//vị trí cần xóa trong mảng sanphammua
  // var listPayNew = [];
  console.log(req.body.indexRemove);
  if (req.session.newuser){
    var user = req.session.newuser.slice();
    var emailUser = user[0].email;
    const findDocuments = function(db, callback) {
      const collection = db.collection('nguoidung');
      collection.findOne({ email: emailUser }, function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        callback(docs);
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      findDocuments(db, function(data) {
        var listPayNew = [];
        // console.log(data.sanphammua);
        data.sanphammua.forEach(function(sanpham, index){
          if(!(index == Number(indexRemove))){
            listPayNew.push(sanpham);
          }
        });
        console.log(listPayNew);
        //update những hàng mà tài khoản này mua
        const updateDocument = function(db, callback) {
          // Get the documents collection
          const collection = db.collection('nguoidung');
          // Update document where a is 2, set b equal to 1
          collection.updateOne({ email : emailUser }
            , { $set: {sanphammua: listPayNew} }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
          });
        }
        MongoClient.connect(url, function(err, client) {
          assert.equal(null, err);
          const db = client.db(dbName);
          updateDocument(db, function() {
            res.send({update: true});
            client.close();
          });
        });
        client.close();
      });
    });

  }
  else{
    res.redirect('/');
  }
})




module.exports = router;
