import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { getIncomeDataService } from "../../utils/api/pay";

const formatNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DATA = {
  ALL_TIME: "all_time",
  YEAR: "year",
  MONTH: "month"
};

const Income = () => {
  const [data, setData] = useState({ all_time: 0, year: 0, month: 0 });
  const [selected, setSelected] = useState(DATA.ALL_TIME);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    const {res, err} = await getIncomeDataService();
    if (res) setData(res);
  };

  return (
    <Card className="income">
      <div className="income__header">
        <h4>Total Income</h4>
        <div className="income__buttons">
          <button onClick={() => setSelected(DATA.ALL_TIME)} className={selected === DATA.ALL_TIME ? "active" : ""}>All time</button>
          <button onClick={() => setSelected(DATA.YEAR)} className={selected === DATA.YEAR ? "active" : ""}>Year</button>
          <button onClick={() => setSelected(DATA.MONTH)} className={selected === DATA.MONTH ? "active" : ""}>Month</button>
        </div>
      </div>
      <div className="income__content">
        <p className="currency">VND</p>
        <p className="value">{formatNumber(data[selected])}</p>
      </div>
    </Card>
  );
}

export default Income;