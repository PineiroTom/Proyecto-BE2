import express from 'express';
import { authorize } from '../middleware/auth.js';

const productsRouter = express.Router();

// solo admins pueden crear productos
productsRouter.post('/', authorize(['admin']), (req, res) => {
  res.send('Creating a product (Admin only)');
});

// solo admins pueden crear productos
productsRouter.put('/:pid', authorize(['admin']), (req, res) => {
  res.send('Updating a product (Admin only)');
});

// solo admins delete productos
productsRouter.delete('/:pid', authorize(['admin']), (req, res) => {
  res.send('Deleting a product (Admin only)');
});

export default productsRouter;