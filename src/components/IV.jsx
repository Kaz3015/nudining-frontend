import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../firebase/auth';
import FoodList from './FoodList';
import Navbar from './Navbar';

const diningHall = 'United Table at International Village';

function IV({ fetchUserMacros }) {
  const [mealPeriod, setMealPeriod] = useState('Breakfast');
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
  };

  return (
    <>
      <Navbar
        handleNavClick={handleNavClick}
        toggleFilter={toggleFilter}
        activeFilters={activeFilters}
        currentMealPeriod={mealPeriod}
      />

      {mealPeriod === 'Everyday' ? (
        <FoodList
          Station={'EVERYDAY'}
          MealPeriod={mealPeriod}
          fetchUserMacros={fetchUserMacros}
          DiningHall={diningHall}
          activeFilters={activeFilters}
        />
      ) : mealPeriod === 'Breakfast' ? (
        <>
          <FoodList
            Station={'SWEETS AT THE TABLE'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'SOUP'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'ASIAN KITCHEN'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'UNITED KITCHEN'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'FUSION GRILL'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
        </>
      ) : mealPeriod === 'Lunch' || mealPeriod === 'Dinner' ? (
        <>
          <FoodList
            Station={'LATIN KITCHEN'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'DELCIOUS WITHOUT'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'POMODORO KITCHEN'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'SPICE BOWL'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'SWEETS AT THE TABLE'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'MEZZE TABLE'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'SUSHI'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'SOUP'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'ASIAN KITCHEN TOPPINGS'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'ASIAN KITCHEN'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'UNITED KTICHEN'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'FUSION GRILL'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />
          <FoodList
            Station={'GLOBAL BOWLS'}
            MealPeriod={mealPeriod}
            fetchUserMacros={fetchUserMacros}
            DiningHall={diningHall}
            activeFilters={activeFilters}
          />

        </>
      ) : null}
    </>
  );
}

export default IV;
