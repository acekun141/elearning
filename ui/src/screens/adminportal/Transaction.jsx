import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@components/layout/AdminLayout";
import { Container, Button } from "react-bootstrap";
import LineLoading from "@components/common/LineLoading";
import { getAllTransactionService } from "../../utils/api/pay";
import DataTable from "react-data-table-component";
import moment from "moment/moment";
import { currencyValue } from "../../utils/num";

const Transaction = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pagingData, setPagingData] = useState({ page: 1, has_next: false });

  useEffect(() => {
    handleGetTransaction();
  }, [])

  const handleGetTransaction = async (page = 1) => {
    if (page === 1) setIsLoading(true);
    const {res, err} = await getAllTransactionService(page);
    setIsLoading(false);
    if (err) return;
    if (page === 1) {
      setTransactions(res.transactions);
    } else {
      setTransactions(prevState => [...prevState, ...res.transactions]);
    }
    setPagingData({ page: res.page, has_next: res.has_next });
  }

  const total = useMemo(() => {
    return transactions.reduce((prevValue, item) => prevValue + item.amount, 0);
  }, [transactions]);

  if (isLoading) return (
    <AdminLayout>
      <Container>
        <h3 style={{ fontWeight: 700 }}>Transaction History</h3>
        <div className="d-flex justify-content-center">
          <LineLoading />
        </div>
      </Container>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <Container>
        <h3 className="mb-5" style={{ fontWeight: 700 }}>Transaction History</h3>
        <DataTable data={transactions} columns={columns} />
        {pagingData.has_next && (
          <div className="d-flex justify-content-center mt-4">
            <Button onClick={() => handleGetTransaction(pagingData.page + 1)} variant="outline-dark">More</Button>
          </div>
        )}
      </Container>
    </AdminLayout>
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
    name: "User",
    cell: row => row.user.full_name
  },
  {
    name: "Amount",
    right: true,
    cell: row => currencyValue(row.amount)
  }
]

export default Transaction;
