import { useState } from "react";
import { v4 } from "uuid";

const useAlert = () => {
  const [state, setState] = useState([]);

  const clearAlert = (id) => {
    setState(prevState => prevState.filter(item => item.id !== id));
  };

  const pushAlert = (type, message) => {
    const alertId = v4();
    setState(prevState => [...prevState, { type, message, id: alertId }]);
    setTimeout(() => clearAlert(alertId), 3000);
  };

  return [ state, pushAlert ];
}

export default useAlert;