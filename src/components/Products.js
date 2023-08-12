import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [productList, setProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState(null);
  const [found, setFound] = useState(false);
  const [cartitems, setCartItems] = useState([]);
  const [cart, setCart] = useState([]);

  const debounceTimeout = 1000;

  let productData = [...productList];

  let token = localStorage.getItem("token");


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    setLoading(true);
    try {
      let res = await axios(`${config.endpoint}/products`);
      if (res.status === 200) {
        setProductList(res.data);
        
        
      }
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const inIt = async () => {
      
      await performAPICall();
      if (token) {
        await fetchCart(token);
      
      }
    };

    inIt();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      setFound(false);
      const res = await axios(
        `${config.endpoint}/products/search?value=${text}`
      );
      if (res.status === 200) {
        
        if (text) {
          setProductList(
            res.data.filter((item) => {
              return text && item.category && item.name;
            })
          );
        } else {
          setProductList(res.data);
        }
      }
    } catch (e) {
      if (e.response) {
        setFound(true);
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    setSearch(event.target.value);
    if (debounce) {
      clearTimeout(debounce);
    }
    const timeout = setTimeout(() => {
      performSearch(event.target.value);
    }, debounceTimeout);

    setDebounce(timeout);
  };

  const fetchCart = async (token) => {
    let url = `${config.endpoint}/cart`;
    try {
      let res = await axios(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log(res.data);
        setCartItems(res.data);
       
      }
    } catch (e) {
      console.error(e.response);
    }
  };

  const postCart = (token, data) => {
    let url = `${config.endpoint}/cart`;
    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCartItems(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    let cartProducts = generateCartItemsFrom(cartitems, productData);
    
    setCart(cartProducts);
  }, [cartitems]);

  const addToCart = (id, qty, action) => {

    const isItemInCart = (id) => {
      let itemInCart = [...cartitems];
      return itemInCart.find((item) => item.productId === id);
    };

    if (token) {

      if (isItemInCart(id)) {
       
        if (action === "cart") {
          enqueueSnackbar(
            "Item already in cart. Use the cart sidebar to update quantity or remove item.",
            { variant: "warning" }
          );
        }

        if (action === "add") {
          console.log("clicked to add", id, qty);
          postCart(token, { productId: id, qty: qty + 1 });

        } else if (action === "delete") {
          console.log("clicked to delete", id, qty);
          postCart(token, { productId: id, qty: qty - 1 });
        }

      } else {
        postCart(token, { productId: id, qty: qty });
      }

    } else {
      
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => debounceSearch(event, debounceTimeout)}
          value={search}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event) => debounceSearch(event, debounceTimeout)}
      />
      {token ? (
        <Grid container direction="row">
          <Grid item md={9}>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
            {loading ? (
              <Box
                className="loading"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ width: 1 }}
              >
                <CircularProgress size={25} color="primary" />
                <p>Loading Products</p>
              </Box>
            ) : found ? (
              <Box
                className="loading"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ width: 1 }}
              >
                <SentimentDissatisfied />
                No products found
              </Box>
            ) : (
              <Grid container className="product-grid">
                {productList.map((product) => (
                  <Grid item xs={6} md={3} p={1} key={product.id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={() => addToCart(product._id, 1, "cart")}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {localStorage.getItem("username") && (
            <Grid item md={3} sm={12}>
              <Cart items={cart} handleQuantity={addToCart} />
            </Grid>
          )}
        </Grid>
      ) : (
        <>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
            {loading ? (
              <Box
                className="loading"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ width: 1 }}
              >
                <CircularProgress size={25} color="primary" />
                <p>Loading Products</p>
              </Box>
            ) : found ? (
              <Box
                className="loading"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ width: 1 }}
              >
                <SentimentDissatisfied />
                No products found
              </Box>
            ) : (
              <Grid container className="product-grid">
                {productList.map((product) => (
                  <Grid item xs={6} md={3} p={1} key={product.id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={addToCart}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </>
      )}

      {/* </Grid> */}

      <Footer />
    </div>
  );
};

export default Products;
