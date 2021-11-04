import { useEffect, useState } from "react";
import { IoFilter, IoCaretDown } from "react-icons/io5";
import { LIST_COURSE_TYPE } from "../../utils/constants";
import FilterDropdown from "./FilterDropdown";

const categoryList = [{ name: "All", value: "" }, ...LIST_COURSE_TYPE.map(item => ({ name: item, value: item }))];

// const categoryList = [
//   { name: "All", value: "" },
//   { name: "Development", value: "development" },
//   { name: "Business", value: "business" },
//   { name: "It & Software", value: "itandosftware" },
//   { name: "Design", value: "design" },
//   { name: "Marketing", value: "marketing" },
//   { name: "Music", value: "music" },
//   { name: "Health", value: "health" },
// ]

const filterOption = [
  { name: "Price: High to Low", param: "order_by_price", value: false },
  { name: "Price: Low to High", param: "order_by_price", value : true },
  { name: "Date: Newest to Oldest", param: "order_by_date", value: false },
  { name: "Date: Oldest to Newest", param: "order_by_date", value: true },
]

const SearchBar = ({ isLoading, onSearch, category: categoryProps }) => {
  const [category, setCategory] = useState(categoryList[0]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({});

  console.log(categoryProps);

  useEffect(() => {
    if (categoryProps && categoryList.filter(item => item.value.toLowerCase() === categoryProps)) {
      setCategory(categoryList.filter(item => item.value.toLowerCase() === categoryProps)[0]);
      onSearch(search, categoryProps, undefined, null);
    }
  }, [categoryProps])

  const handleSearch = () => {
    onSearch(search, category.value, filter.param || null, filter.value);
  }

  return (
    <div className="course-search-bar">
      <div className="course-search-bar__input">
        <FilterDropdown
          onSelect={setCategory}
          value={category}
          icon={IoCaretDown}
          option={categoryList}
        />
        <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search" />
        <button onClick={handleSearch} disabled={isLoading} className="search-button">Search</button>
      </div>
      <div className="course-search-bar__filter">
        <div className="filter filter-icon">
          Filters
          <IoFilter />
        </div>
        <FilterDropdown
          onSelect={setFilter}
          label="Select"
          value={filter}
          icon={IoCaretDown}
          option={filterOption}
        />
      </div>
    </div>
  );
}

export default SearchBar;