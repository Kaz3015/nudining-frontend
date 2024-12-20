import React, { useEffect, useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import Steast from "./Steast";
import { gsap } from 'gsap';
import { doSignOut } from "../firebase/auth";
import IV from "./IV";
import { useNavigate } from 'react-router-dom';
import Joyride from 'react-joyride';

function Home() {
  const [macros, setMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [showMacros, setShowMacros] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Steast");
  const [runTutorial, setRunTutorial] = useState(false);
  const macrosRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showMacros) {
      gsap.fromTo(macrosRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
    }
  }, [showMacros]);

  const fetchUserMacros = async () => {
    const user = getAuth().currentUser;

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

  const handleResetMacros = async () => {
    const user = getAuth().currentUser;

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

  const handleMacroClick = () => {
    setShowMacros(!showMacros);
    fetchUserMacros();
  };

  const handleLogout = () => {
    doSignOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      setRunTutorial(false);
    }
  };

  const steps = [
    {
      target: '.tutorial-button',
      content: 'Click here to start the tutorial.',
    },
    {
      target: '.filter-gluten',
      content: 'Use this button to exclude gluten.',
    },
    {
      target: '.filter-vegetarian',
      content: 'Use this button to only show vegetarian options.',
    },
    {
      target: '.filter-protein',
      content: 'Use this button to only show high protein options.',
    },
    {
      target: '.food-card',
      content: 'Click on a food card to see more details such as macros and ingredients.',
    },
    {
      target: '.food-card-macro',
      content: 'Click on this button to add the food item to your daily macros.',
    },
    {
      target: '.macro-calculator-button',
      content: 'Click here to open the macro calculator.',
    },
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
              tooltip: {
                backgroundColor: '#374151',
                color: '#FFFFFF',
              },
              buttonNext: {
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
              },
              buttonBack: {
                color: '#FFFFFF',
              },
              buttonClose: {
                color: '#FFFFFF',
              },
            }}
        />

        <header className="w-full bg-gray-800 py-4">
          <div className="flex justify-center space-x-2">
            <button
                onClick={handleMacroClick}
                className="macro-calculator-button bg-gray-700 text-white h-12 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              Macro Calculator
            </button>
            <button
                onClick={() => setRunTutorial(true)}
                className="tutorial-button bg-gray-700 text-white h-12 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              Start Tutorial
            </button>
            <button
                onClick={handleLogout}
                className="bg-gray-700 text-white h-12 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              Logout
            </button>
          </div>
        </header>


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
        <div>
          {selectedComponent === "Steast" ? (
              <Steast fetchUserMacros={fetchUserMacros}/>
          ) : (
              <IV fetchUserMacros={fetchUserMacros}/>
          )}

          {showMacros && (
              <div ref={macrosRef} className="fixed top-16 left-4 bg-gray-700 p-4 rounded-lg shadow-lg">
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