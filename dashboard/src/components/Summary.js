import React, { useState, useEffect } from "react";
import axios from "axios";

const Summary = () => {
  const [user, setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user info from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }

        // Fetch holdings data
        const token = localStorage.getItem('token');
        const holdingsResponse = await axios.get("http://localhost:3030/allHoldings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHoldings(holdingsResponse.data);
      } catch (err) {
        console.error('Error fetching summary data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate holdings summary
  let totalInvestment = 0;
  let currentValue = 0;
  let profitLoss = 0;

  holdings.forEach((stock) => {
    const investment = stock.avg * stock.qty;
    const value = stock.price * stock.qty;
    totalInvestment += investment;
    currentValue += value;
    profitLoss += value - investment;
  });

  const profitPercentage = totalInvestment > 0 ? ((profitLoss / totalInvestment) * 100).toFixed(2) : 0;

  return (
    <>
      <div className="username">
        <h6>Hi, {user?.name || 'User'}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={profitLoss >= 0 ? "profit" : "loss"}>
              {Math.abs(profitLoss).toFixed(2)} <small>{profitLoss >= 0 ? '+' : ''}{profitPercentage}%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{currentValue.toFixed(2)}</span>{" "}
            </p>
            <p>
              Investment <span>{totalInvestment.toFixed(2)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;