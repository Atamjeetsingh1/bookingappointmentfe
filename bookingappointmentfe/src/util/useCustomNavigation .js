// useCustomNavigation.js
import { useNavigate } from "react-router-dom";

const useCustomNavigation = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  return { handleNavigation };
};

export default useCustomNavigation;
