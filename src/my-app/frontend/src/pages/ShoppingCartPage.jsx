import "../index.css";
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import axios from "axios";

// TODO: use login logic to set the following data
const userInfo = {
  id: "11",
  is_organization: false
};

const ShoppingCartPage = () => {

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShoppingCart();
  }, []);

  const fetchShoppingCart = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/transactions/shopping_cart/" + userInfo.id);
      const cartItemsWithId = response.data.map((item, index) => ({ ...item, id: index }));
      setCartItems(cartItemsWithId);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + quantity } : item
      )
    );
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.ticket_price * item.quantity, 0);
  };

  const outputCartItems = () => {
    return(
      <><p className="mb-2">You have {cartItems.length} items in your cart</p><div className="grid grid-cols-1 gap-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex flex-col gap-y-2 mt-3 bg-gray-100 rounded-lg shadow-lg p-4">
            
            {/* EVENT NAME and REMOVE BUTTON*/}
            <div className="flex flex-row justify-between">
              <p className="text-md font-bold">{item.event_name}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"  viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>

            {/* QUANTITY SELECTION and TICKET TYPE*/}
            <div className="flex flex-row justify-between items-end">
              <p className="flex-gow-1 text-sm">{item.ticket_type}</p>

              {/* QUANTITY BUTTONS */}
              <div className="flex items-center">
                <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 mr-2">
                  <svg className="h-4 w-4 text-violet-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <p className="mr-2">{item.quantity}</p>
                <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500">
                  <svg className="h-4 w-4 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {" "}
                    <line x1="12" y1="5" x2="12" y2="19" />{" "}
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <p className="ml-5 text-md font-medium"> ${item.ticket_price * item.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-20 items-end">
        <div className="text-left">
          <h2 className="text-xl font-bold">Summary</h2>
          <p>Total: ${getTotal()}</p>
        </div>
        <button className="bg-[#242565] hover:bg-[#494391] text-white font-normal py-1.5 px-3 rounded">
          Proceed to Checkout
        </button>
      </div>
      </>
    )
  }

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
