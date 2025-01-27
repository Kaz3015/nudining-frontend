import React from 'react';
import { FaLeaf, FaBreadSlice, FaHandRock, FaBan } from 'react-icons/fa';

function Navbar({ handleNavClick, toggleFilter, activeFilters, currentMealPeriod }) {
  return (
    <>
      <div className="text-center">
        <nav className="inline-flex justify-center m-2 sm:m-4 space-x-2 sm:space-x-4 rounded-full border-2 px-2 sm:px-4 py-2 sm:py-4">
          <button
            onClick={() => handleNavClick("Breakfast")}
            className={`p-1 sm:p-2 hover:bg-blue-500 rounded-full px-2 sm:px-4 border-2 ${ 
            currentMealPeriod === "Breakfast"
              ? "bg-white text-blue-600 border-blue-600"
              : "bg-gray-700 text-gray-300"}`}
          >
            Breakfast
          </button>
          <button
            onClick={() => handleNavClick("Lunch")}
            className={`p-1 sm:p-2 hover:bg-blue-500 rounded-full px-2 sm:px-4 border-2 ${ 
            currentMealPeriod === "Lunch"
              ? "bg-white text-blue-600 border-blue-600"
              : "bg-gray-700 text-gray-300"}`}
          >
            Lunch
          </button>
          <button
            onClick={() => handleNavClick("Dinner")}
            className={`p-1 sm:p-2 hover:bg-blue-500 rounded-full px-2 sm:px-4 border-2 ${ 
            currentMealPeriod === "Dinner"
              ? "bg-white text-blue-600 border-blue-600"
              : "bg-gray-700 text-gray-300"}`}
          >
            Dinner
          </button>
          <button
            onClick={() => handleNavClick("Everyday")}
            className={`p-1 sm:p-2 hover:bg-blue-500 rounded-full px-2 sm:px-4 border-2 ${ 
            currentMealPeriod === "Everyday"
              ? "bg-white text-blue-600 border-blue-600"
              : "bg-gray-700 text-gray-300"}`}
          >
            Everyday
          </button>
        </nav>
      </div>
      <div className="text-center">
        <div className="inline-flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          {/* Vegan Filter Button */}
          <div className="relative group">
            <button onClick={() => toggleFilter('vegan')}>
              <FaLeaf
                title="Vegan"
                className={`filter-vegetarian ${
                  activeFilters.includes('vegan') ? 'text-green-200' : 'text-green-500'
                }`}
              />
            </button>
            <span className="filter-vegetarian absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
              Vegetarian
            </span>
          </div>
          {/* Exclude Gluten Filter Button */}
          <div className="relative group">
            <button onClick={() => toggleFilter('gluten')}>
              <div className="relative w-6 h-6">
                {/* Bread Icon */}
                <FaBreadSlice
                  title="Exclude Gluten"
                  className={`filter-gluten absolute text-yellow-500 ${
                    activeFilters.includes('gluten') ? 'opacity-50' : ''
                  }`}
                  style={{ fontSize: '1rem', top: '5px', left: '5px' }}
                />
                {/* Ban Icon */}
                <FaBan
                  className="absolute text-red-600"
                  style={{ fontSize: '2rem', top: '-4px', left: '-4px' }}
                />
              </div>
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
              Exclude Gluten
            </span>
          </div>
          {/* High Protein Filter Button */}
          <div className="relative group">
            <button onClick={() => toggleFilter('protein')}>
              <FaHandRock
                title="High Protein"
                className={`filter-protein ${
                  activeFilters.includes('protein') ? 'text-red-200' : 'text-red-500'
                }`}
              />
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
              High Protein
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;