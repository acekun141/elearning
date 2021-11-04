import { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import BaseLayout from "@components/layout/BaseLayout";
import UserDetailForm from "@components/user/UserDetailForm";
import EditAvatar from "@components/user/EditAvatar";
import ChangePassword from "@components/user/ChangePassword";
import { IoPersonCircleOutline, IoImageOutline, IoKeyOutline } from "react-icons/io5";

const tabs = [
  {name: "Information", value: 1, icon: IoPersonCircleOutline},
  {name: "Avatar", value: 2, icon: IoImageOutline},
  {name: "Change Password", value: 3, icon: IoKeyOutline }
]

const EditUser = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <BaseLayout>
      <Container>
        <Card className="user-edit-screen">
          <Row>
            <Col sm="4">
              <div className="tab-wrapper">
                {tabs.map(({ value, name, icon: Icon }) => (
                  <button
                    className={value === activeTab ? "active" : ""}
                    onClick={() => setActiveTab(value)}
                    key={value}
                  >
                    <Icon />
                    {name}
                  </button>
                ))}
              </div>
            </Col>
            <Col sm="8">
              {activeTab === 1 && <UserDetailForm />}
              {activeTab === 2 && <EditAvatar />}
              {activeTab === 3 && <ChangePassword />}
            </Col>
          </Row>
        </Card>
      </Container>
    </BaseLayout>
  );
}

export default EditUser;
