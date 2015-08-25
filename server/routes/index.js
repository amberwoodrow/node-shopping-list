var express = require('express');
var router = express.Router();

// constructor
function ItemLibrary() {
  this.items = [];
  this.id = 0;
}

// methods
ItemLibrary.prototype.addItem = function(name) {
  var newItem = {name: name, id: this.id};
  this.items.push(newItem);
  this.id += 1;
};

// create some instances
var storage = new ItemLibrary();
storage.addItem('Noodles');
storage.addItem('Tomatoes');
storage.addItem('Peppers');

// route handler
router.get('/items', function(req, res) {
  res.json(storage.items);
});

router.post('/items', function(req, res) {
  storage.addItem(req.body.name),
  res.json({message: "success"});
});

router.get('/item/:id', function(req, res, next) {
  var itemID = +req.params.id; // params is in the link
  // console.log(req.params); req.params is {id: 'the id'}
  var item = storage.items.filter(function(theItem){ // filter is like a for loop that returns
    return theItem.id === itemID; // true things
  });
  res.json(item);
});

router.put('/item/:id', function(req, res, next) {
  var itemID = +req.params.id; // + <-- parseInts req.params.id <-- grabs just the number id from the params/link /item/w.e. id
  var item = storage.items.filter(function(theItem){
    return theItem.id === itemID;
  });
  // console.log(item) item is [ { name: 'Peppers', id: 2 } ]
  // console.log(req.body); req.body is {name: 'the name'}
  if (item.length>0){ //checks if item exists
    if (item[0].id === itemID) { // if the item here equals the id entered
      for (var key in req.body) { // httpie request key 
        if (key === 'name') { // finds if the key name equals the key in request...
          item[0].name = req.body.name; // then reassigns it.
        }
      }
      res.send(item[0]);
    }
  }
  else {
    storage.addItem(req.body.name); // adds id by increment no by what is passed into params
    res.json({message: "Added item"});
  }
});

router.delete('/item/:id', function(req, res, next) {
  var itemID = +req.params.id; //grabs id
  var item = storage.items.filter(function(theItem){
    return theItem.id === itemID;
  });
    // console.log(item[0].id);

  if (item.length>0){
    // console.log(item[0]);
    for (var i=0; i<storage.items.length; i++) {
      // console.log(storage.items[i]);
      // console.log(item[0]);

      if (storage.items[i] === item[0]) {
        var tempItems = storage.items.splice(i, 1); // splice matching i index
        res.json({message: "Item deleted", theItem: tempItems}); // shows item deleted in terminal
      }
    }
  }
  else {
    res.json({message: "Item doesn't exist"});
  }
});

// helpful comments
// http DELETE http://localhost:3000/item/4
// http PUT http://localhost:3000/item/1 name='Ketchup'
// http GET http://localhost:3000/items
// http -f POST http://localhost:3000/items name=FROGS

module.exports = router;
