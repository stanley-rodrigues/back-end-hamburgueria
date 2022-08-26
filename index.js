const express = require("express"); // importando o express
const uuid = require("uuid"); // importando o uuid para gerar id ramndomico

const port = 3000; //salvando a porta numa variavel
const app = express(); //salvando o express numa variavel
app.use(express.json()); //falar que o formato que esta sendo usado é json
/*
    query params > meu.site.com/users?nome=stanley&age25 // filtros
    route params > /users/2   //    BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFIC0
    request body > {"name":"stanley", "age":25}


    GET > Buscar informação back-end
    POST > cria informação no back-end
    PUT / PATCH > Altera/atualiza informação no back-end
    DELETE > deleta informação no back-end

    middleware => pode parar ou alterar dados da requisição
*/

// /users é uma rota, que recebe uma função/ req é de request ou requisição res é de response ou resposta | retorn é para retornar algo para porta 3000 onde o express está ouvindo.

const orders = [];

//const myFirstMiddleware = (req, res, next) => {
//    console.log('fui chamado')

//    next() // somente após chamar o next o middleware liberada para executar o restante das requisições.

//    console.log("finalizamos ");
//}
//app.use(myFirstMiddleware)

const checkMethodAndUrl = (req, res, next) => {
  const methodAndUrl = {
    method: req.method,
    Url: req.url
  }
  console.log(methodAndUrl);
  next()
}

const checkOrderId = (req, res, next) => {// middleware
  const { id } = req.params; //recebendo o id  que está sendo mandado por route params

  //findindex mostra a localização do dado que sera atualizado comparando o id
  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    //condicional para que se for menor que zero responder que o usuaario n existe
    return res.status(404).json({ message: "User not found" }); // resposta
  }

  req.orderIndex = index;
  req.orderId = id;

  next();
};

app.get("/order", checkMethodAndUrl, (req, res) => {
  return res.json(orders); // respondendo com os usuarios que existem no array

});

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

  return res.json(finishedOrder); // respondendo com os dados atualizados do usuario
});

app.post("/order",checkMethodAndUrl, (req, res) => {
  const { order, clientName, price } = req.body; // rescebendo os dados pelo corpo

  const orderClient = { id: uuid.v4(), order, clientName, price, status:"Em preparação"}; // criando o usuario e adicionando um id

  orders.push(orderClient); //colocando o usuario criado no array que estava vazio

  return res.status(201).json(orderClient); // respondendo com os dados do usuaario criado
});

app.put("/order/:id",checkMethodAndUrl, checkOrderId, (req, res) => {
  const { order, clientName, price } = req.body; // recebendo pelo body, os dados que sera atualizado
  const index = req.orderIndex;
  const id = req.orderId;
  //salvando numa variavel os dados recebidos
  const updateOrder = { id, order, clientName, price, status: "Em preparação" };

  orders[index] = updateOrder; //pegando o array de usuarios e na posição encontrada pelo findindex substituindo por novos dados.

  return res.json(updateOrder); // respondendo com os dados atualizados do usuario
});

app.delete("/order/:id",checkMethodAndUrl, checkOrderId, (req, res) => {
  const index = req.orderIndex;

  orders.splice(index, 1);

  return res.status(204).json(); // respondendo que o usuarios foi deletado do array
});

app.listen(port, () => {
  console.log(`🚀🚀🚀 on port ${port}`);
});
