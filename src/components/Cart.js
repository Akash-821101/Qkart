import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  const CartItem = [];
  cartData.forEach((cartitem) => {
    let product = productsData.find(
      (product) => product._id === cartitem.productId
    );

    if (product) {
      let cartitemData = {
        name: product.name,
        category: product.category,
        image: product.image,
        cost: product.cost,
        rating: product.rating,
        qty: cartitem.qty,
        productId: cartitem.productId,
      };

      CartItem.push(cartitemData);
    }
  });

  console.log("item", CartItem);

  return CartItem;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  items.forEach((item) => {
    total += item.cost * item.qty;
  });

  return total;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */

export const getTotalCartQuantity = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += item.qty;
  });

  return total;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  if (isReadOnly) {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          Qty: {value}
        </Box>
      </Stack>
    );
  }
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } product;./ks
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {isReadOnly ? (
          <Box bgcolor="white" borderRadius="5px" marginBottom="5px">
            {items.map((item) => (
              <>
                <Box
                  display="flex"
                  alignItems="flex-start"
                  padding="1rem"
                  key={item.productId}
                >
                  <Box className="image-container">
                    <img
                      src={item.image}
                      alt="img"
                      width="100%"
                      height="100%"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="6rem"
                    paddingX="1rem"
                  >
                    <div>{item.name}</div>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <ItemQuantity
                        isReadOnly
                        value={item.qty}
                        handleAdd={() =>
                          handleQuantity(item.productId, item.qty, "add")
                        }
                        handleDelete={() =>
                          handleQuantity(item.productId, item.qty, "delete")
                        }
                      />
                      <Box padding="0.5rem" fontWeight="700">
                        ${item.cost}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            ))}
            <Box
              padding="1rem"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box color="#3C3C3C" alignSelf="center">
                Order total
              </Box>
              <Box
                color="#3C3C3C"
                fontWeight="700"
                fontSize="1.5rem"
                alignSelf="center"
                data-testid="cart-total"
              >
                ${getTotalCartValue(items)}
              </Box>
            </Box>
          </Box>
        ) : (
          <div>
            {items.map((item) => (
              <>
                <Box
                  display="flex"
                  alignItems="flex-start"
                  padding="1rem"
                  key={item.productId}
                >
                  <Box className="image-container">
                    <img
                      src={item.image}
                      alt="img"
                      width="100%"
                      height="100%"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="6rem"
                    paddingX="1rem"
                  >
                    <div>{item.name}</div>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <ItemQuantity
                        value={item.qty}
                        handleAdd={() =>
                          handleQuantity(item.productId, item.qty, "add")
                        }
                        handleDelete={() =>
                          handleQuantity(item.productId, item.qty, "delete")
                        }
                      />
                      <Box padding="0.5rem" fontWeight="700">
                        ${item.cost}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            ))}
            <Box
              padding="1rem"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box color="#3C3C3C" alignSelf="center">
                Order total
              </Box>
              <Box
                color="#3C3C3C"
                fontWeight="700"
                fontSize="1.5rem"
                alignSelf="center"
                data-testid="cart-total"
              >
                ${getTotalCartValue(items)}
              </Box>
            </Box>
          </div>
        )}
        {isReadOnly ? (
          <Box
            display="flex"
            flexDirection="column"
            bgcolor="white"
            borderRadius="5px"
            paddingY="1rem"
          >
            <Box padding="1rem" fontWeight="700">
              Order Details
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="1rem"
            >
              <Box>Products</Box>
              <Box> {getTotalCartQuantity(items)}</Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="1rem"
            >
              <Box>SubTotal</Box>
              <Box> ${getTotalCartValue(items)}</Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="1rem"
            >
              <Box>shipping Charges</Box>
              <Box>$ 0</Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="1rem"
            >
              <Box fontWeight="700">Total</Box>
              <Box>${getTotalCartValue(items)}</Box>
            </Box>
          </Box>
        ) : (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                history.push("/checkout");
                
              }}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Cart;
