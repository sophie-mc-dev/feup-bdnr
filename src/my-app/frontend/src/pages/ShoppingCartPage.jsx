import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import ShoppingCartCard from "../components/ShoppingCartCard";

const ShoppingCartPage = () => {
  const { user } = useContext(UserContext);

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShoppingCart();
  }, []);

  const fetchShoppingCart = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/transactions/shopping_cart/${user.user_id}`
      );
      const cartItemsWithId = response.data.map((item, index) => ({
        ...item,
        id: index,
      }));
      setCartItems(cartItemsWithId);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/transactions/shopping_cart/${user.user_id}/${id}`
      );
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = async (id, increment) => {
    try {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity + increment,
          };
        }
        return item;
      });

      await axios.put(
        `http://localhost:3000/transactions/shopping_cart/${user.user_id}/${id}`,
        { quantity: updatedCartItems.find((item) => item.id === id).quantity }
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const emptyCart = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/transactions/shopping_cart/${user.user_id}`
      );
      setCartItems([]);
    } catch (error) {
      console.error("Error emptying cart:", error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.ticket_price * item.quantity,
      0
    );
  };

  const outputCartItems = () => {
    return (
      <>
        <div className="flex justify-between ">
          <p className="mb-2">You have {cartItems.length} items in your cart</p>
          <p onClick={emptyCart} className="cursor-pointer underline">
            Empty Cart
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {cartItems.map((item, index) => (
            <ShoppingCartCard
              key={index}
              item={item}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
        <div className="flex justify-between mt-20 items-end">
          <div className="text-left">
            <h2 className="text-xl font-bold">Summary</h2>
            <p>Total: ${getTotal()}</p>
          </div>
          <a href="/purchases">
            <button className="bg-[#242565] hover:bg-[#494391] text-white font-normal py-1.5 px-3 rounded">
              Proceed to Checkout
            </button>
          </a>
        </div>
      </>
    );
  };

  return (
    <div className="ml-20 mr-20 mb-3 mt-5">
      <div className="flex flex-col gap-y-1 container px-4 py-8">
        <h3 className="text-2xl font-bold">Shopping Cart</h3>
        {isLoading ? (
          <Loading />
        ) : cartItems.length === 0 ? (
          <p className="mb-2">You have no items in your cart</p>
        ) : (
          outputCartItems()
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
