import "../index.css";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";
import PurchaseCard from "../components/PurchaseCard";
import FormatDate from "../utils/FormattedDate"

const PurchasesPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (user.is_organization) {
      navigate('/');
    } else {
      fetchPurchases(); 
    }
  }, []);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/transactions/purchases/" + user.user_id
      );
      setPurchases(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const outputPurchaseInfo = (purchase, index) => {
    return (
      <div key={index} className="flex flex-col rounded-lg ">
        {/* Purchase Date and Total Price */}
        <div className="flex justify-between">
          <p className="text-lg font-bold">{FormatDate(purchase.transaction_date)}</p>
          <p className="text-lg font-bold">Total: €{purchase.total_price}</p>
        </div>

        {/* Purchase Cards */}
        <div className="mt-5 grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-5">
          {purchase.items.map((item, index) => (
            <div key={index}>
              <PurchaseCard item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex">
      <Sidebar profileType="user" />

      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <h3 className="text-2xl font-bold mb-6">My Purchases</h3>
        <div className="flex flex-col gap-y-5">
          {isLoading ? (
            <Loading />
          ) : purchases.length === 0 ? (
            <p>No purchases found.</p>
          ) : (
            purchases.map((purchase, index) =>
              outputPurchaseInfo(purchase, index)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasesPage;
