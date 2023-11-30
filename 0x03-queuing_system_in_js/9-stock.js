import express from 'express';
import { createClient } from 'redis'

const app = express();
const client = createClient();

const listProducts = [
  
  {Id: 1, name: 'Suitcase 250', price: 50, stock: 4},
  {Id: 2, name: 'Suitcase 450', price: 100, stock: 10},
  {Id: 3, name: 'Suitcase 650', price: 350, stock: 2},
  {Id: 4, name: 'Suitcase 1050', price: 550, stock: 5}

]

function getItemById(id) {
  return listProducts.find(item => item.Id === id);
}

async function reserveStockById (itemId, stock){
  return promisify(client.SET).bind(client)(`item.${itemId}`, stock);
};

async function getCurrentReservedStockById(itemId){
  return promisify(client.GET).bind(client)(`item.${itemId}`);
};

app.get('/list_products', (req, res) => {
  res.status(200).json(listProducts);
})

app.get('/list_products/:itemId(\\d+)', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId)
    .then((result) => Number.parseInt(result || 0))
    .then((reservedStock) => {
      productItem.currentQuantity = productItem.initialAvailableQuantity - reservedStock;
      res.json(productItem);
    });
});

app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId)
    .then((result) => Number.parseInt(result || 0))
    .then((reservedStock) => {
      if (reservedStock >= productItem.initialAvailableQuantity) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
      }
      reserveStockById(itemId, reservedStock + 1)
        .then(() => {
          res.json({ status: 'Reservation confirmed', itemId });
        });
    });
});

async function resetProductsStock() {
  return Promise.all(
    listProducts.map(
      item => promisify(client.SET).bind(client)(`item.${item.itemId}`, 0),
    )
  );
};


app.listen(1245);
