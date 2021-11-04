import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import LineLoading from "../../components/common/LineLoading";
import { getListUserService } from "../../utils/api/user";
import DataTable from "react-data-table-component";
import { USER_LIST_TABLE } from "../../utils/constants";
import ChangeRoleModal from "@components/user/ChangeRoleModal";

const Users = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const user = useSelector(state => state.user);

    useEffect(() => {
        handleGetListUser();
    }, []);

    const handleGetListUser = useCallback(async (page) => {
        setIsLoading(true);
        const { res } = await getListUserService();
        setUsers(res.users);
        setIsLoading(false);
    }, []);

    const onChangeRole = useCallback((user) => {
        setSelectedUser(user);
    }, []);

    if (isLoading) return <Loading />
    
    return (
        <AdminLayout>
            <ChangeRoleModal user={selectedUser} onHide={() => setSelectedUser(null)} />
            <Container>
                <h1 className="content-title">Users</h1>
                <DataTable
                    data={users}
                    columns={USER_LIST_TABLE(onChangeRole, user.role === 'admin', user.id)}
                    pagination={false}
                />
            </Container>
        </AdminLayout>
    );
}

const Loading = () => (
    <AdminLayout>
        <Container>
            <h1 className="content-title">Users</h1>
            <div className="d-flex align-items-center justify-content-center">
                <LineLoading />
            </div>
        </Container>
    </AdminLayout>
)

export default Users;