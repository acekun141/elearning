import React, { useEffect, useState } from "react";
import Chartjs from "chart.js/auto";
import moment from "moment/moment";
import { getChartTransactionDataService } from "../../utils/api/pay";
import { Form } from "react-bootstrap";
import { range } from "../../utils/num";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const years = range((new Date()).getFullYear() - 10, (new Date()).getFullYear()+1);

const Chart = () => {
  const [year, setYear] = useState(moment().format("YYYY")); 
  const [data, setData] = useState(null);

  useEffect(() => {
    handleGetData();
  }, [year]);

  useEffect(() => {
    if (!data) return null;
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chartjs(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: "Amount",
          data: Object.values(data),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      title: {
        display: false
      }
    });
    return () => {
      myChart.destroy();
    }
  }, [data])

  const handleGetData = async () => {
    const {res, err} = await getChartTransactionDataService(year);
    if (res) setData(res);
  };

  return (
    <div className="chart card">
      <Form.Select onChange={event => setYear(event.target.value.toString())}>
        {years.reverse().map(item => <option key={item}>{item}</option>)}
      </Form.Select>
      <canvas id="myChart" />
    </div>
  );
}

export default Chart;