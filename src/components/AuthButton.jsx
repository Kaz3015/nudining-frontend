import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AuthButton = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleSignOut}
          className="bg-gray-700 text-white h-12 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center"
        >
          Sign Out
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
  );
};

export default AuthButton;