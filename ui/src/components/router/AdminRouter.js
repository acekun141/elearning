import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRouter = ({ component: Component, ...rest }) => {
  const user = useSelector(state => state.user);
  const renderComponent = (props) => (
    (user && ["admin", "teacher"].includes(user.role))
    ? <Component {...props} />
    : <Redirect to={{ pathname: "/signin" }} />
  )
  return <Route {...rest} render={renderComponent} />
}

export default AdminRouter;