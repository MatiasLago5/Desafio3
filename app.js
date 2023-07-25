const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;
const dataFilePath = path.join(__dirname, 'data', 'products.json');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const fileContents = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(fileContents);
    } catch (error) {
      return [];
    }
  }

  getProducts(limit) {
    if (!limit) {
      return this.products;
    } else {
      return this.products.slice(0, limit);
    }
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }
}

const productManager = new ProductManager(dataFilePath);

app.get('/products', (req, res) => {
  const limit = parseInt(req.query.limit);
  const products = productManager.getProducts(limit);

  res.json({ products });
});

app.get('/products/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = productManager.getProductById(pid);

  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});