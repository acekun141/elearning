import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux"

export const PrivateRouter = ({ component: Component, ...rest }) => {
  const user = useSelector(state => state.user);
  const renderComponent = (props) => (
    user
    ? <Component {...props} />
    : <Redirect to={{ pathname: "/signin" }} />
  )
  return <Route {...rest} render={renderComponent} />
}
