import express from 'express';
import { authorize } from '../middleware/auth.js';
import { Product } from '../models/productModel.js';
import { Cart } from '../models/cartModel.js';
import { Ticket } from '../models/ticketModel.js';
import mongoose from 'mongoose';

const cartRouter = express.Router();


cartRouter.post('/:cid/products/:pid', authorize(['user']), (req, res) => {
  res.send('Adding a product to the cart (User only)');
});

cartRouter.post('/:cid/purchase', authorize(['user']), async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await Cart.findById(cartId).populate('products.product');

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    let totalAmount = 0;
    const purchasedProducts = [];
    const productsNotPurchased = [];
    const notPurchasedProductIds = [];

    // Iterar sobre los productos en el carrito
    for (const cartProduct of cart.products) {
      const product = cartProduct.product;
      const quantity = cartProduct.quantity;

      if (!product) {
        productsNotPurchased.push(cartProduct);
        notPurchasedProductIds.push(cartProduct.product);
        continue;
      }

      // Check si hay stock
      if (product.stock >= quantity) {
        // Update the stock
        product.stock -= quantity;
        await product.save();

        totalAmount += product.price * quantity;
        purchasedProducts.push({ product: product._id, quantity });
      } else {
        productsNotPurchased.push(cartProduct);
        notPurchasedProductIds.push(product._id);
      }
    }

    // Crear un ticket
    const ticketData = {
      amount: totalAmount,
      purchaser: req.user.email,
    };

    
    const ticket = await Ticket.create(ticketData);


    cart.products = productsNotPurchased;
    await cart.save();

    if (notPurchasedProductIds.length > 0) {
      return res.send({
        message: 'Purchase completed with some items unavailable',
        ticket,
        cart,
        unavailableProducts: notPurchasedProductIds,
      });
    }

    res.send({ message: 'Purchase completed', ticket, cart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error processing purchase', error: error.message });
  }
});

export default cartRouter;