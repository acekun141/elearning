import React from "react";
import { useHistory } from "react-router-dom";

const list = [
  {name: "Design", image: "design.jpg"},
  {name: "Development", image: "development.jpg"},
  {name: "Marketing", image: "marketing.jpg"},
  {name: "It and Software", image: "itandsoftware.jpg"},
  {name: "Personal Development", image: "personal-development.jpg"},
  {name: "Business", image: "business.jpg"},
  {name: "Photography", image: "photography.jpg"},
  {name: "Music", image: "music.jpg"},
]

const TopCategories = () => {
  const history = useHistory();
  const onClick = (name) => {
    history.push('/courses', { category: name.toLowerCase() });
  };
  return (
    <div className="top-categories">
      <h3>Top categories</h3>
      <div className="top-categories__content">
        {list.map(item => (
          <div key={item.name} className="categories" onClick={() => onClick(item.name)}>
            <div className="img-wrapper">
              <img src={item.image} alt="image" />
            </div>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopCategories;