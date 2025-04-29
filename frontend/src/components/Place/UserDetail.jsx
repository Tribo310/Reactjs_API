// UserDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Хэрэглэгчийн мэдээлэл авах
        const userResponse = await fetch(`http://localhost:3001/api/allUsers`);
        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData = await userResponse.json();
        const foundUser = [...userData.otherUsers, userData.currentUser].find(
          (u) => u.id === userId
        );

        if (!foundUser) throw new Error("User not found");
        setUser(foundUser);

        // Хэрэглэгчийн газруудыг авах
        const placesResponse = await fetch(
          `http://localhost:3001/api/userPlaces/${userId}`
        );
        if (!placesResponse.ok) throw new Error("Failed to fetch places data");

        const placesData = await placesResponse.json();
        setPlaces(placesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-8">
        <strong className="font-bold">Алдаа! </strong>
        <span className="block sm:inline">{error}</span>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Буцах
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Буцах
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Хэрэглэгчийн толгой хэсэг */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center space-x-6">
              <img
                src={user.userImgUrl || "https://via.placeholder.com/150"}
                alt={user.username}
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-blue-100">
                  {places.length} бүртгэлтэй газар
                </p>
              </div>
            </div>
          </div>

          {/* Газруудын жагсаалт */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Бүртгэлтэй газрууд
            </h2>

            {places.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={
                        place.placeImgUrl || "https://via.placeholder.com/300"
                      }
                      alt={place.placeName}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                    <h3 className="font-semibold text-lg">{place.placeName}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {place.placeDescription}
                    </p>
                    {place.placeAddress && (
                      <p className="text-gray-500 text-xs flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {place.placeAddress}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Бүртгэлтэй газар байхгүй байна</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
