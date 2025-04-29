import React from "react";

function OtherPlace({ user }) {
  const userPlaces = user.createdPLaces || [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4 space-x-4">
        <img
          src={user.userImgUrl || "https://via.placeholder.com/150"}
          alt={`${user.username} profile`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <h2 className="text-xl font-semibold">{user.username}-ын газрууд</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userPlaces.length === 0 ? (
          <p className="text-gray-500">Одоогоор нэмсэн газар байхгүй байна.</p>
        ) : (
          userPlaces.map((place) => (
            <div
              key={place.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
            >
              <img
                src={place.image || "https://via.placeholder.com/300x200"}
                alt={place.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="text-lg font-bold">{place.name}</h3>
                <p className="text-sm text-gray-600">
                  {place.description?.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OtherPlace;
