import { useContext } from "react";
import { GlobalContext } from "@contexts/ContextProvider";

const TestComponent = () => {
  const { state, action } = useContext(GlobalContext);
  return (
    <div>
      {state.isLoading ? "Loading" : "Off"}
      <button onClick={() => action.loadingOn()}>On</button>
      <button onClick={() => action.loadingOff()}>Off</button>
      <button onClick={() => action.pushAlert("success", "The first alert")}>Alert</button>
      Aloha
    </div>
  );
}

export default TestComponent;