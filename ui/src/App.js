import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import HomeScreen from "@screens/userportal/HomeScreen";
import SigninScreen from "@screens/userportal/auth/SigninScreen";
import SignupScreen from "@screens/userportal/auth/SignupScreen";
import VerifyScreen from "@screens/userportal/auth/VerifyScreen";
import ContextProvider from "@contexts/ContextProvider";
import EditUser from "@screens/userportal/user/EditUser";
import { PrivateRouter, PublicRouter } from "@components/router";
import NotFound from "./components/layout/NotFound";
import AdminRouter from "./components/router/AdminRouter";
import Dashboard from "./screens/adminportal/Dashboard";
import Courses from "./screens/adminportal/Courses";
import AdminCourseDetail from "./screens/adminportal/CourseDetail";
import CourseFilter from "./screens/userportal/course/CourseFilter";
import TeacherDetail from "./screens/userportal/TeacherDetail";
import CourseDetail from "./screens/userportal/course/CourseDetail";
import YourCourses from "./screens/userportal/course/YourCourses";
import TransactionHistory from "./screens/userportal/TransactionHistory";
import Learn from "./screens/userportal/learn/Learn";
import Transaction from "./screens/adminportal/Transaction";
import Users from "./screens/adminportal/Users";

function App() {
  return (
    <Container fluid={true}>
      <ContextProvider>
        <Router>
          <Switch>
            <PublicRouter path="/" exact restricted={false} component={HomeScreen} />
            <PublicRouter path="/signin" exact restricted={true} component={SigninScreen} />
            <PublicRouter path="/signup" exact restricted={true} component={SignupScreen} />
            <PublicRouter path="/verify" exact restricted={true} component={VerifyScreen} />
            <PublicRouter path="/courses" exact restricted={false} component={CourseFilter} />
            <PublicRouter path="/teacher/:id" exact restricted={false} component={TeacherDetail} />
            <PublicRouter path="/course/:id" exact restricted={false} component={CourseDetail} />
            <PrivateRouter path="/user/settings" exact component={EditUser} />
            <PrivateRouter path="/user/courses" exact component={YourCourses} />
            <PrivateRouter path="/user/transaction-history" exact component={TransactionHistory} />
            <PrivateRouter path="/course/learn/:id" exact component={Learn} />
            <AdminRouter path="/admin/dashboard" exact component={Dashboard} />
            <AdminRouter path="/admin/courses" exact component={Courses} />
            <AdminRouter path="/admin/course/:id" exact component={AdminCourseDetail} />
            <AdminRouter path="/admin/transaction" exact component={Transaction} />
            <AdminRouter path="/admin/users" exact component={Users} />
            <Route component={NotFound} />
          </Switch>
       </Router>
      </ContextProvider>
    </Container>
  );
}

export default App;
