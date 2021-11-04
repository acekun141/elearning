import { Card } from "react-bootstrap";
import { IoPeopleOutline } from "react-icons/io5";

const UserBoard = ({count}) => {
  return (
    <Card className="user-board">
      <div className="user-board__header">
        <h4>User</h4>
      </div>
      <div className="user-board__content">
        <IoPeopleOutline className="icon" />
        <p className="value">{count}</p>
      </div>
    </Card>
  );
}

export default UserBoard;