import { createContext, useState, useCallback, useEffect } from "react";
import { getLandingInfoService  } from "@api/course";
import useAlert from "./hooks/useAlert";
import { useDispatch } from "react-redux";
import { getUserDetail } from "../redux/reducers/user/actions";
import { setLandingInfo } from "../redux/reducers/common/action";

export const GlobalContext = createContext()

const GlobalContextComponent = ({ children }) => {
  const [isLoadInfo, setIsLoadInfo] = useState(true);
  const [isLoadLanding, setIsLoadLanding] = useState(true);
  const [alerts, pushAlert] = useAlert();

  const dispatch = useDispatch();

  useEffect(() => {
    getLandingInfo();
    const token = localStorage.getItem("access_token");
    if (!token) return setIsLoadInfo(false);
    return getUserInfo();
  }, []);

  const getUserInfo = async () => {
    dispatch(getUserDetail((res, err) => {
      if (err) localStorage.removeItem("access_token");
      setIsLoadInfo(false);
    }));
  };

  const getLandingInfo = async () => {
    const { res, err } = await getLandingInfoService();
    if (res) {
      dispatch(setLandingInfo(res));
    }
    setIsLoadLanding(false);
  }

  const action = { pushAlert };

  if (isLoadInfo || isLoadLanding) return null;

  return (
    <GlobalContext.Provider value={{ action }}>
      <div className="alert-wrapper">
        {alerts.map(item => (
          <div key={item.id} className={`alert ${item.type}`}>{item.message}</div>
        ))}
      </div>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContextComponent;