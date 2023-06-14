import React, { useState, useEffect, useRef } from "react";

export const Slider = ({ data }) => {
  const [currentID, setCurrentId] = useState(0);
  const autoPlayRef = useRef(null);

  autoPlayRef.current = () => {
    if (currentID >= data.length - 1) {
      setCurrentId((currentID) => (currentID = 0));
    } else {
      setCurrentId((currentID) => currentID + 1);
    }
  };

  useEffect(() => {
    let autoPlayId = setInterval(() => {
      autoPlayRef.current();
    }, 3000);
    return () => clearInterval(autoPlayId);
  }, []);

  const jumpTo = (id) => {
    setCurrentId(id);
  };

  return (
    <div className="slider">
      {data.length > 0 &&
        data.map((d, index) => {
          return (
            <div
              className={`slide ${currentID === index ? "slideActive" : ""}`}
              key={d.key}
            >
              <img src={d.src} alt="" />
            </div>
          );
        })}
      <div className="sliderDots">
        {data.length > 0 &&
          data.map((d, index) => {
            return (
              <div
                onClick={() => {
                  jumpTo(index);
                }}
                className={`slideDot ${currentID === index ? "dotActive" : ""}`}
                key={d.key}
              ></div>
            );
          })}
      </div>
    </div>
  );
};

export default Slider;
