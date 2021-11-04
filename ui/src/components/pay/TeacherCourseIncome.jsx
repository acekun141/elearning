import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { getTeacherCourseIncomeService } from "../../utils/api/pay";
import { COURSE_INCOME_TABLE } from "../../utils/constants";
import LineLoading from "../common/LineLoading";

const TeacherSourceIncome = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const user = useSelector(state => state.user);

    useEffect(() => {
        getCourseIncome();
    }, [])

    const getCourseIncome = async () => {
        setLoading(true);
        const {res, err} = await getTeacherCourseIncomeService();
        if (res) setData(res.courses);
        setLoading(false);
    }

    if (loading) return (
        <div className="d-flex justify-content-center">
            <LineLoading />
        </div>
    )

    return (
        <DataTable data={data} columns={COURSE_INCOME_TABLE()} />
    );
}

export default TeacherSourceIncome;