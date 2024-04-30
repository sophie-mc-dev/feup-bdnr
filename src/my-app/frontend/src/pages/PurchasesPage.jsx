import "../index.css";
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import axios from "axios";

// TODO: use login logic to set the following data
const isLoggedIn = true;
const userInfo = {
  id: "10",
  is_organization: false
};

const PurchasesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/transactions/purchases/" + userInfo.id);
      setPurchases(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const outputPurchaseInfo = (purchase, index) => {
    return(
      <div key={index} className="flex flex-col rounded-lg gap-y-5 px-7 py-5 bg-gray-200">
        <p>Date:{purchase.transaction_date}</p>
        <p>Total: €{purchase.total_price}</p>

        {purchase.items.map((item, index) => (
          <div key={index}>
            <p className="font-medium">{item.event_name}</p>
            <p>Ticket Type:{item.ticket_type} </p>
            <p>Ticket Price:€{item.ticket_price} </p>
            <p>Quantity:{item.quantity}</p>
          </div>
        ))}

      </div>
    );
  }

  // TODO: update cards display and add transactions card

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Purchases</h2>
      <div className="flex flex-col gap-y-5">
        {isLoading ? (
          <Loading />
        ) : purchases.length === 0 ? (
          <p>No purchases found.</p>
        ) : ( 
          purchases.map((purchase, index) => (
            outputPurchaseInfo(purchase, index)
          ))
        )}
      </div>
    </div>
  );
};

export default PurchasesPage;
