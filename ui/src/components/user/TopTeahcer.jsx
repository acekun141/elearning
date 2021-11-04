import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { TOP_TEACHER_TABLE } from "../../utils/constants";
import { topTeacherService } from "../../utils/api/user";

const TopTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        getTopTeacher();
    }, []);
    const getTopTeacher = async () => {
        const {res, err} = await topTeacherService();
        if (res) return setTeachers(res.teacher);
    };
    return (
        <div className="top-teacher">
            <h3 className="font-weight-bold">Top Teacher</h3>
            <DataTable columns={TOP_TEACHER_TABLE()} data={teachers} />
        </div>
    );
}

export default TopTeacher;