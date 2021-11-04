import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { TOP_TEACHER_TABLE } from "../../utils/constants";
import { topUserService } from "../../utils/api/user";

const TopUser = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getTopUser();
    }, []);
    const getTopUser = async () => {
        const {res, err} = await topUserService();
        if (res) return setUsers(res.user);
    };
    return (
        <div className="top-teacher">
            <h3 className="font-weight-bold">Top User</h3>
            <DataTable columns={TOP_TEACHER_TABLE()} data={users} />
        </div>
    );
}

export default TopUser;
