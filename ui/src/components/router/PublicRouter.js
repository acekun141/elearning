import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicRouter = ({ restricted, component: Component, ...rest }) => {
  const user = useSelector(state => state.user);
  const renderComponent = (props) => (
    user && restricted
    ? <Redirect to={{ pathname: "/" }} />
    : <Component {...props} />
  )
  return <Route {...rest} render={renderComponent} />
}