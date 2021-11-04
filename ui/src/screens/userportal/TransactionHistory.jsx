import React, { useEffect, useMemo, useState } from "react";
import BaseLayout from "@components/layout/BaseLayout";
import { Container } from "react-bootstrap";
import LineLoading from "@components/common/LineLoading";
import { payHistoryService } from "../../utils/api/pay";
import DataTable from "react-data-table-component";
import moment from "moment/moment";
import { currencyValue } from "../../utils/num";

const TransactionHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    handleGetTransaction();
  }, [])

  const handleGetTransaction = async () => {
    setIsLoading(true);
    const {res, err} = await payHistoryService();
    setIsLoading(false);
    if (err) return;
    setTransactions(res.history);
  }

  const total = useMemo(() => {
    return transactions.reduce((prevValue, item) => prevValue + item.amount, 0);
  }, [transactions]);

  if (isLoading) return (
    <BaseLayout>
      <Container>
        <h3 style={{ fontWeight: 700 }}>Transaction History</h3>
        <div className="d-flex justify-content-center">
          <LineLoading />
        </div>
      </Container>
    </BaseLayout>
  )

  return (
    <BaseLayout>
      <Container>
        <h3 className="mb-5" style={{ fontWeight: 700 }}>Transaction History</h3>
        <DataTable data={transactions} columns={columns} />
        <div className="total d-flex justify-content-end">
          <h5 className="mt-4" style={{fontWeight: 700}}>Total: {currencyValue(total)}</h5>
        </div>
      </Container>
    </BaseLayout>
  );
}

const columns = [
  {
    name: "Date",
    cell: row => moment(row.create_at).format("MM/DD/YYYY HH:mm"),
    width: "150px"
  },
  {
    name: "Course Name",
    cell: row => row.course.name,
  },
  {
    name: "Teacher",
    cell: row => row.course.create_by
  },
  {
    name: "Amount",
    right: true,
    cell: row => currencyValue(row.amount)
  }
]

export default TransactionHistory;