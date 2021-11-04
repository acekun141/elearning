import Header from "./Header";

const BaseLayout = ({ children, className="" }) => {
  return (
    <div className={`layout ${className}`}>
      <Header />
      <div className="content pb-5">
        {children}
      </div>
    </div>
  );
}

export default BaseLayout;