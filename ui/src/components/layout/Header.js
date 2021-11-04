import { Fragment, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5"
import { IoSettingsOutline, IoLogOutOutline, IoTrailSignOutline, IoCardOutline, IoBookOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const Header = () => {
  const [isShowTab, setIsShowTab] = useState(false);
  const tabRef = useRef(null);
  const user = useSelector(state => state.user);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (tabRef.current && !tabRef.current.contains(event.target)) {
        setIsShowTab(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tabRef]);


  const onLogout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };
  const handleShowTab = () => {
    setIsShowTab(true);
  };
  const handleCloseTab = () => {
    setIsShowTab(false);
  };
  const userShortName = () => {
    return user.first_name.charAt(0) + user.last_name.charAt(0);
  };
  return (
    <header className="d-flex justify-content-between align-items-center">
      <div className="logo d-flex align-items-center">
        <h2 onClick={() => window.location.replace("/")}><strong>ELearning</strong></h2>
      </div>
      <div className="menu d-flex justify-content-end align-items-center">
        <div className="search">
          <input placeholder="Search" />
          <span className="f-flex align-items-center justify-content-center">
            <IoSearch />
          </span>
        </div>
        <Link to="/courses">Contact</Link>
        <Link to="/courses">Trending</Link>
        <Link to="/courses">Category</Link>
        {user ? (
          <Fragment>
            <button className="header-user" onClick={handleShowTab}>
              {user.avatar ? <img src={`/image/${user.avatar}`} alt="avatar" /> : <div className="short-name">{userShortName()}</div>}
              <strong>{user.first_name} {user.last_name}</strong>
              <div className="header-user__tab" ref={tabRef} hidden={!isShowTab}>
                <Link to="/user/settings">
                  <IoSettingsOutline />
                  Profile settings
                </Link>
                <Link to="/user/courses">
                  <IoBookOutline />
                  Your courses 
                </Link>
                <Link to="/user/transaction-history">
                  <IoCardOutline />
                  Transactions
                </Link>
                {["admin", "teacher"].includes(user.role) && (
                  <Link to="/admin/dashboard">
                    <IoTrailSignOutline />
                    Switch to admin
                  </Link>
                )}
                <Link to="#" onClick={onLogout}>
                  <IoLogOutOutline />
                  Log out
                </Link>
              </div>
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <Link to="/signin">Signin</Link>
            <Link to="/signup">Signup</Link>
          </Fragment>
        )}
      </div>
    </header>
  );
}

export default Header;
