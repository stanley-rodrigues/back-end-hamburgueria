const express = require("express"); 
const uuid = require("uuid"); 
const cors = require("cors"); 

const port = 3001; 
const app = express(); 
app.use(express.json()); 
app.use(cors())


const orders = [];


const checkMethodAndUrl = (req, res, next) => {
  const methodAndUrl = {
    method: req.method,
    Url: req.url
  }
  console.log(methodAndUrl);
  next()
}

const checkOrderId = (req, res, next) => {
  const { id } = req.params; 
  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    
    return res.status(404).json({ message: "User not found" }); 
  }

  req.orderIndex = index;
  req.orderId = id;

  next();
};

app.get("/order", checkMethodAndUrl, (req, res) => {
  return res.json(orders); 
  
});
console.log(orders)

app.get("/order/:id", checkMethodAndUrl,checkOrderId, (req, res) => {
  const index = req.orderIndex;
  const orderId = orders[index]
  return res.json(orderId);
})

app.patch("/order/:id", checkMethodAndUrl, checkOrderId, (req, res) => {
  const index = req.orderIndex;
  const { id, clientName, order, price } = orders[index];
  let status = orders[index].status;
  status = "Pedido Pronto";
  const finishedOrder = { id, order, clientName, price, status };
  orders[index] = finishedOrder;

  return res.json(finishedOrder); 
});

app.post("/order",checkMethodAndUrl, (req, res) => {
  const { order, clientName } = req.body; 

  const orderClient = { id: uuid.v4(), order, clientName, price: Math.random().toFixed(2) , status:"Em preparação"}; 

  orders.push(orderClient); 

  return res.status(201).json(orderClient); 
});

app.put("/order/:id",checkMethodAndUrl, checkOrderId, (req, res) => {
  const { order, clientName, price } = req.body; 
  const index = req.orderIndex;
  const id = req.orderId;
  
  const updateOrder = { id, order, clientName, price, status: "Em preparação" };

  orders[index] = updateOrder; 

  return res.json(updateOrder); 
});

app.delete("/order/:id",checkMethodAndUrl, checkOrderId, (req, res) => {
  const index = req.orderIndex;

  orders.splice(index, 1);

  return res.status(204).json(); 
});

app.listen(port, () => {
  console.log(`🚀🚀🚀 on port ${port}`);
});
