import React from "react";
import TeacherChart from "../../components/dashboard/TeacherChart";
import TeacherSourceIncome from "../../components/pay/TeacherCourseIncome";

const TeacherDashboard = () => {
    return (
        <div className="teacher-dashboard">
            <TeacherChart />
            <div className="mt-4" />
            <h3 className="font-weight-bold">Courses</h3>
            <TeacherSourceIncome />
        </div>
    )
}

export default TeacherDashboard;