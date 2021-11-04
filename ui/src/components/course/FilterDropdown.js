import { useRef, useEffect, useState } from "react";

const FitlerDropdown = ({ value, icon: Icon = null, option, label="", onSelect }) => {
  const [showOption, setShowOption] = useState(false);
  const optionRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionRef.current && !optionRef.current.contains(event.target)) {
        setShowOption(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [optionRef]);

  const onClick = (item) => {
    onSelect(item);
    setShowOption(false);
  };

  return (
    <div className="dropdown">
      <button onClick={() => setShowOption(true)} className="dropdown__content">
        {value.name ? `${value.name}`.trim() : label}
        {Icon && <Icon />}
      </button>
      {showOption && (
        <div ref={optionRef} className="dropdown__option-wrapper">
          {option.map(item => (
            <button onClick={() => onClick(item)} key={item.name}>
              {item.name}
            </button>
          ))}
        </div>
      )}
   </div>
  )
};

export default FitlerDropdown;