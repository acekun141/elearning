import AdminLayout from "@components/layout/AdminLayout";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "../../components/dashboard/Chart";
import Income from "../../components/dashboard/Income";
import TeacherBoard from "../../components/dashboard/TeacherBoard";
import UserBoard from "../../components/dashboard/UserBoard";
import TopTeacher from "../../components/user/TopTeahcer";
import TopUser from "../../components/user/TopUser";
import { getAdminDashboardService } from "../../utils/api/user";
import TeacherDashboard from "./TeacherDashboard";

const Dashboard = () => {
  const [data, setData] = useState({users: 0, admins: 0});
  const user = useSelector(state => state.user);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    const {res, err} = await getAdminDashboardService();
    if (res) setData(res);
  };

  return (
    <AdminLayout>
      <div className="dashboard-admin">
        <h1 className="content-title">Dashboard</h1>
        {user.role === 'admin' ? (
          <React.Fragment>
            <div className="d-flex dashboard__header">
              <Income />
              <UserBoard count={data.users} />
              <TeacherBoard count={data.admins} />
            </div>
            <Chart />
            <div className="mt-4" />
            <TopTeacher />
            <div className="mt-4" />
            <TopUser />
          </React.Fragment>
        ) : (
          <TeacherDashboard />
        )}
      </div>
   </AdminLayout>
  );
}

export default Dashboard;