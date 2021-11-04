import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoHomeOutline, IoTrailSignOutline, IoLogOutOutline, IoPeopleOutline, IoBookOutline, IoCardOutline } from "react-icons/io5";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { setCreateSourceModal } from "../../redux/reducers/modal/actions";

const topBar = [
  {link: "/admin/dashboard", name: "Dashboard", icon: IoHomeOutline },
  {link: "/admin/users", name: "Users", icon: IoPeopleOutline },
  {link: "/admin/courses", name: "Courses", icon: IoBookOutline },
  {link: "/admin/transaction", name: "Transaction", icon: IoCardOutline },
]

const SideBar = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const shortName = useMemo(() => {
    return user.first_name.charAt(0) + user.last_name.charAt(0);
  }, [user]);

  const onLogout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  const showCreateCourse = () => {
    dispatch(setCreateSourceModal(true));
  };

  return (
    <div className="sidebar d-flex flex-column justify-content-between">
      <div className="sidebar__top">
        <div className="sidebar__user">
          {user.avatar ? (
            <img className="user-avatar" src={`/api/image/${user.avatar}`} />
          ) : (
            <div className="user-shortname text-uppercase">{shortName}</div>
          )}
          <p>{user.first_name} {user.last_name}</p>
        </div>
        {topBar.map(({name, link, icon: Icon}) => (
          <Link key={link} className={`sidebar__item ${window.location.pathname.startsWith(link) ? "active" : ""}`} to={link}>
            <Icon />
            {name}
          </Link>
        ))}
        <Button onClick={showCreateCourse} variant="dark">Create Course</Button>
      </div>
      <div className="sidebar__bottom">
        <Link className="sidebar__item" to="/">
          <IoTrailSignOutline className="icon" />
          Switch to user
        </Link>
        <Link className="sidebar__item" to="#" onClick={onLogout}>
          <IoLogOutOutline />
          Log out
        </Link>
      </div>
    </div>
  );
}

export default SideBar;