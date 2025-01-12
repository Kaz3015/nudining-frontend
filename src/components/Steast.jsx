import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../firebase/auth';
import FoodList from "./FoodList";
import Navbar from "./Navbar";

const diningHall = "The Eatery at Stetson East";

function Steast({ fetchUserMacros, showPopupMessage, getMealPeriod }) {
  const [mealPeriod, setMealPeriod] = useState("Breakfast");
  const [activeFilters, setActiveFilters] = useState([]);
  const navigate = useNavigate();


  // Function to toggle filters on and off
  const toggleFilter = (filter) => {
    setActiveFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter) // Remove the filter if it's already active
        : [...prevFilters, filter] // Add the filter if it's not active
    );
  };

  const handleNavClick = (period) => {
    setMealPeriod(period);
    getMealPeriod(period);
  };

  return (
    <>
      <Navbar handleNavClick={handleNavClick} toggleFilter={toggleFilter} activeFilters={activeFilters}
              currentMealPeriod={mealPeriod} />
      {mealPeriod === "Everyday" ? (
        <FoodList
          Station={"EVERYDAY"}
          MealPeriod={mealPeriod}
          fetchUserMacros={fetchUserMacros}
          DiningHall={diningHall}
          activeFilters={activeFilters}
          popupMessage={showPopupMessage}
        />
      ) : (
        <>
          <FoodList
            Station={"CUCINA"}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
            popupMessage={showPopupMessage}
          />
          <FoodList
            Station={"RICE STATION"}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
            popupMessage={showPopupMessage}
          />
          <FoodList
            Station={"HOMESTYLE"}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
            popupMessage={showPopupMessage}
          />
          <FoodList
            Station={"MENUTAINMENT"}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
            popupMessage={showPopupMessage}
          />
          <FoodList
            Station={"SOUP"}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
            popupMessage={showPopupMessage}
          />
          <FoodList
            Station={"FRESH 52 B"}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
            popupMessage={showPopupMessage}
          />
          <FoodList
            Station={"SWEET SHOPPE"}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
            popupMessage={showPopupMessage}
          />
        </>
      )}
    </>
  );
}

export default Steast;