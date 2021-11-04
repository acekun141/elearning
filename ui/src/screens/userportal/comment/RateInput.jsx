import React, { useContext, useEffect, useState } from "react";
import { IoStarOutline, IoStar } from "react-icons/io5";
import { GlobalContext } from "../../../contexts/ContextProvider";
import { getRateService, ratingService } from "../../../utils/api/rate";

const rateList = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
];

const RateInput = ({ courseId }) => {
  const [value, setValue] = useState(0);
  const { action } = useContext(GlobalContext);

  useEffect(() => {
    if (!courseId) return null;
    handleGetRate();
  }, [courseId])

  const handleGetRate = async () => {
    const {res, err} = await getRateService(courseId); 
    if (res) setValue(res.value);
  };

  const onRate = async (val) => {
    const currentValue = value;
    setValue(val);
    const {res, err} = await ratingService(courseId, val);
    if (err) {
      action.pushAlert('error', err)
      setValue(currentValue);
    } else {
      action.pushAlert('success', 'Successful');
    }
  }

  return (
    <div className="rate-input">
      {rateList.map((item) => {
        if (item.value <= value) {
          return (
            <div key={item.value} className="rate-value active" onClick={() => onRate(item.value)}>
              <IoStar />
            </div>
          );
        } else {
          return (
            <div key={item.value} className="rate-value" onClick={() => onRate(item.value)}>
              <IoStarOutline />
            </div>
          );
        }
      })}
    </div>
  );
};

export default RateInput;
