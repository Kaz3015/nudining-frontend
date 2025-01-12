import React, { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Steast from "./Steast";
import { gsap } from 'gsap';
import { doSignOut } from "../firebase/auth";
import IV from "./IV";
import { useNavigate } from 'react-router-dom';
import Joyride from 'react-joyride';

function Home() {
  const [macros, setMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [showMacros, setShowMacros] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Steast");
  const [runTutorial, setRunTutorial] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mealPeriod, setMealPeriod] = useState('Breakfast');

  // Recommendation fetch states
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResponse, setRecommendationResponse] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Mobile nav state
  const [isNavOpen, setIsNavOpen] = useState(false);

  const macrosRef = useRef(null);
  const textInputRef = useRef(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (showMacros) {
      gsap.fromTo(macrosRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
    }
  }, [showMacros]);

  useEffect(() => {
    if (showTextInput) {
      gsap.fromTo(textInputRef.current, { width: 0 }, { width: '100%', duration: 0.5 });
    }
  }, [showTextInput]);

  // Meal period from child components
  const getMealPeriod = (period) => {
    setMealPeriod(period);
  };

  // Fetch user macros
  const fetchUserMacros = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(import.meta.env.VITE_FETCH_USER_MACROS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch macros: ${errorText}`);
      }

      const data = await response.json();
      setMacros(data.macros || { calories: 0, protein: 0, carbs: 0, fat: 0 });
    } catch (error) {
      console.error('Error fetching macros:', error);
    }
  };

  // Recommendation call
  const recommendation = async (inputValue) => {
    const user = auth.currentUser;
    let diningHall =
      selectedComponent === "IV"
        ? "United Table at International Village"
        : "The Eatery at Stetson East";

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      setIsLoading(true);
      setShowRecommendation(false);

      const idToken = await user.getIdToken();
      const response = await fetch(import.meta.env.VITE_RECCOMENDATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          user_input: inputValue,
          meal_period: mealPeriod,
          dining_hall: diningHall
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch recommendation: ${errorText}`);
      }

      const data = await response.json();

      // Convert \n to <br> for line breaks
      if (data && data.recommendation) {
        data.recommendation = data.recommendation.replace(/\n/g, '<br>');
      }

      setRecommendationResponse(data);
      setShowRecommendation(true);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset user macros
  const handleResetMacros = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(import.meta.env.VITE_HANDLE_RESET_USER_MACROS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ uid: user.uid })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to reset macros: ${errorText}`);
      }

      const data = await response.json();
      setMacros(data.macros || { calories: 0, protein: 0, carbs: 0, fat: 0 });
    } catch (error) {
      console.error('Error resetting macros:', error);
    }
  };

  /**
   * This method looks for the line:
   *   "Total: <cal> calories, <pro>g protein, <carb>g carbs, <fat>g fat."
   * For example:
   *   Total: 440 calories, 12g protein, 79g carbs, 8g fat.
   */
  const handleAddMacros = async () => {
    if (!recommendationResponse?.recommendation) return;

    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      // Convert <br> back to newlines
      const text = recommendationResponse.recommendation.replace(/<br>/g, '\n');

      // Regex to find the "Total:" line
      // e.g. "Total: 440 calories, 12g protein, 79g carbs, 8g fat."
      const totalRegex = /Total:\s*(\d+(?:\.\d+)?)\s*calories,\s*(\d+(?:\.\d+)?)g\s*protein,\s*(\d+(?:\.\d+)?)g\s*carbs,\s*(\d+(?:\.\d+)?)g\s*fat/i;
      const match = text.match(totalRegex);

      if (!match) {
        console.error("No 'Total' line found in the recommendation.");
        return;
      }

      // match[1] = calories, match[2] = protein, match[3] = carbs, match[4] = fat
      const totalCalories = parseFloat(match[1]);
      const totalProtein = parseFloat(match[2]);
      const totalCarbs = parseFloat(match[3]);
      const totalFat = parseFloat(match[4]);

      // Now send to /api/addMacros
      const idToken = await user.getIdToken();
      const response = await fetch(import.meta.env.VITE_ADD_MACROS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: user.uid,
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add macros: ${errorText}`);
      }

      const data = await response.json();
      if (data?.macros) {
        // Update local macros
        setMacros(data.macros);
      }
      console.log("Macros added successfully:", data);
    } catch (error) {
      console.error("Error adding macros:", error);
    }
  };

  // Show/hide macro panel or popup
  const handleMacroClick = () => {
    if (isLoggedIn) {
      setShowMacros(!showMacros);
      fetchUserMacros();
    } else {
      showPopupMessage();
    }
  };

  const handleLogout = () => {
    doSignOut()
      .then(() => navigate('/home'))
      .catch((error) => console.error("Error signing out:", error));
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = ['finished', 'skipped'];
    if (finishedStatuses.includes(status)) {
      setRunTutorial(false);
    }
  };

  const handleRecommendClick = () => {
    if (isLoggedIn) {
      setShowTextInput(!showTextInput);
    } else {
      showPopupMessage();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      recommendation(textInputRef.current.value);
    }
  };

  const showPopupMessage = () => {
    setShowPopup(true);
    gsap.fromTo(popupRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    setTimeout(() => {
      gsap.to(popupRef.current, { opacity: 0, duration: 0.5, onComplete: () => setShowPopup(false) });
    }, 2000);
  };

  // Toggle the mobile nav
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Joyride steps
  const steps = [
    { target: '.tutorial-button', content: 'Click here to start the tutorial.' },
    { target: '.filter-gluten', content: 'Use this button to exclude gluten.' },
    { target: '.filter-vegetarian', content: 'Use this button to only show vegetarian options.' },
    { target: '.filter-protein', content: 'Use this button to only show high protein options.' },
    { target: '.food-card', content: 'Click on a food card to see more details such as macros and ingredients.' },
    { target: '.food-card-macro', content: 'Click on this button to add the food item to your daily macros.' },
    { target: '.macro-calculator-button', content: 'Click here to open the macro calculator.' },
  ];

  return (
    <>
      <Joyride
        steps={steps}
        run={runTutorial}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#4CAF50',
            textColor: '#FFFFFF',
            backgroundColor: '#333333',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
          },
          tooltip: { backgroundColor: '#374151', color: '#FFFFFF' },
          buttonNext: { backgroundColor: '#2563EB', color: '#FFFFFF' },
          buttonBack: { color: '#FFFFFF' },
          buttonClose: { color: '#FFFFFF' },
        }}
      />

      {/* Navbar */}
      <header className="w-full bg-gray-800 py-4 flex items-center justify-between px-4">
        <div className="text-white font-bold text-xl">NU Dining</div>

        {/* Hamburger (mobile) */}
        <div className="text-white cursor-pointer md:hidden" onClick={toggleNav}>
          <div
            className={`w-6 h-1 bg-white my-1 transition-transform duration-300 ${
              isNavOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <div
            className={`w-6 h-1 bg-white my-1 ${isNavOpen ? 'opacity-0' : ''} transition-opacity duration-300`}
          />
          <div
            className={`w-6 h-1 bg-white my-1 transition-transform duration-300 ${
              isNavOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-2">
          <button
            onClick={handleMacroClick}
            className="macro-calculator-button bg-gray-700 text-white h-12 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
          >
            Macro Calculator
          </button>
          <button
            onClick={handleRecommendClick}
            className="bg-gray-700 text-white h-12 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
          >
            Food Recommendations
          </button>
          <button
            onClick={() => setRunTutorial(true)}
            className="tutorial-button bg-gray-700 text-white h-12 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
          >
            Start Tutorial
          </button>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white h-12 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-700 text-white h-12 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Mobile Dropdown */}
      {isNavOpen && (
        <nav className="md:hidden bg-gray-700 text-white">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <button
                onClick={() => {
                  toggleNav();
                  handleMacroClick();
                }}
                className="block w-full text-left"
              >
                Macro Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  toggleNav();
                  handleRecommendClick();
                }}
                className="block w-full text-left"
              >
                Food Recommendations
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  toggleNav();
                  setRunTutorial(true);
                }}
                className="block w-full text-left tutorial-button"
              >
                Start Tutorial
              </button>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    toggleNav();
                    handleLogout();
                  }}
                  className="block w-full text-left"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    toggleNav();
                    navigate('/login');
                  }}
                  className="block w-full text-left"
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      )}

      {/* Popup if not logged in */}
      {showPopup && (
        <div
          ref={popupRef}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded"
        >
          Please log in to use this feature.
        </div>
      )}

      {/* Text Input for user preferences */}
      {showTextInput && (
        <div className="flex flex-col items-center mt-4 space-y-2 px-4">
          <input
            ref={textInputRef}
            type="text"
            placeholder="Type in your macro goals and allergies"
            className="p-3 rounded w-full max-w-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={handleKeyPress}
          />
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          <span className="ml-2 text-white">Loading...</span>
        </div>
      )}

      {/* Recommendation and Add Macros Button */}
      {recommendationResponse?.recommendation && !isLoading && (
        <div className="mt-4 p-4 bg-gray-700 text-white rounded mx-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recommendation Response</h2>
            <button
              onClick={() => setShowRecommendation(!showRecommendation)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-4"
            >
              {showRecommendation ? "Hide" : "Show"}
            </button>
          </div>

          {showRecommendation && (
            <div className="mt-2">
              <div
                dangerouslySetInnerHTML={{
                  __html: recommendationResponse.recommendation
                }}
              />
              <button
                onClick={handleAddMacros}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Add These Macros to Calculator
              </button>
            </div>
          )}
        </div>
      )}

      {/* Switch Dining Components */}
      <div className="flex justify-center space-x-2 sm:space-x-4 mt-4">
        <button
          onClick={() => setSelectedComponent("Steast")}
          className={`py-2 px-4 sm:px-6 rounded-full border-2 ${
            selectedComponent === "Steast"
              ? "bg-white text-blue-600 border-blue-600"
              : "bg-gray-700 text-gray-300 hover:bg-blue-500"
          }`}
        >
          Steast
        </button>
        <button
          onClick={() => setSelectedComponent("IV")}
          className={`py-2 px-4 sm:px-6 rounded-full border-2 ${
            selectedComponent === "IV"
              ? "bg-white text-blue-600 border-blue-600"
              : "bg-gray-700 text-gray-300 hover:bg-blue-500"
          }`}
        >
          IV
        </button>
      </div>

      {/* Render Chosen Dining Hall */}
      <div>
        {selectedComponent === "Steast" ? (
          <Steast
            fetchUserMacros={fetchUserMacros}
            getMealPeriod={getMealPeriod}
            showPopupMessage={showPopupMessage}
          />
        ) : (
          <IV fetchUserMacros={fetchUserMacros} />
        )}

        {/* Macro Calculator Popup */}
        {showMacros && (
          <div
            ref={macrosRef}
            className="fixed top-16 left-4 bg-gray-700 p-4 rounded-lg shadow-lg"
          >
            <h2 className="text-white text-lg sm:text-xl font-bold mb-2">Total Macros</h2>
            <p className="text-white">Calories: {macros.calories}</p>
            <p className="text-white">Protein: {macros.protein}g</p>
            <p className="text-white">Carbs: {macros.carbs}g</p>
            <p className="text-white">Fat: {macros.fat}g</p>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-2 sm:px-4 rounded-full hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleResetMacros}
            >
              Reset Macros
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
