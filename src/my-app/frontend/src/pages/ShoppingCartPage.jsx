import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import ShoppingCartCard from "../components/ShoppingCartCard";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [isDeleteCartModalOpen, setIsDeleteCartModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (user.is_organization) {
      navigate("/");
    } else {
      fetchShoppingCart();
    }
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

  const updateQuantity = async (index, increment) => {
    try {
      const updatedCartItems = [...cartItems];
      updatedCartItems[index].quantity += increment;

      await axios.put(
        `http://localhost:3000/transactions/shopping_cart/${user.user_id}/${index}`,
        { quantity: updatedCartItems[index].quantity }
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (index) => {
    try {
      await axios.delete(
        `http://localhost:3000/transactions/shopping_cart/${user.user_id}/${index}`
      );
      setCartItems(cartItems.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error removing item:", error);
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
          <p
            onClick={() => setIsDeleteCartModalOpen(true)}
            className="cursor-pointer underline"
          >
            Empty Cart
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {cartItems.map((item, index) => (
            <ShoppingCartCard
              key={index}
              item={item}
              removeItem={() => {
                setItemToDelete(item);
                setIsDeleteItemModalOpen(true);
              }}
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

      {isDeleteItemModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="mb-4">
              Are you sure you want to delete this item from your cart?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={() => setIsDeleteItemModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  removeItem(itemToDelete.id);
                  setIsDeleteItemModalOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteCartModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="mb-4">
              Are you sure you want to empty your shopping cart?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={() => setIsDeleteCartModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  emptyCart();
                  setIsDeleteCartModalOpen(false);
                }}
              >
                Empty Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;
