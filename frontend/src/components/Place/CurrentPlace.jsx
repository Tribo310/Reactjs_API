import { useLocation, useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";

function CurrentPlace() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/allUsers");
        if (response.data.currentUser) {
          setCurrentUser(response.data.currentUser);
        } else if (location.state?.currentUser) {
          setCurrentUser(location.state.currentUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (location.state?.currentUser) {
          setCurrentUser(location.state.currentUser);
        }
      }
    };

    fetchUserData();
  }, [location.state]);

  const handleDelete = async (placeId) => {
    try {
      // Серверээс устгана
      console.log("Delete data:", placeId);
      await axios.delete(`/api/places/${placeId}`);

      // Локал хэрэглэгчийн газруудыг шинэчилнэ
      setCurrentUser((prev) => ({
        ...prev,
        createdPLaces: prev.createdPLaces.filter(
          (place) => place.id !== placeId
        ),
      }));
    } catch (error) {
      console.error("Error deleting place:", error);
      alert("Газар устгах явцад алдаа гарлаа");
    }
  };

  const handleEdit = (place) => {
    setEditingPlace({ ...place });
  };

  const handleSaveEdit = async () => {
    try {
      // First update on server
      const response = await axios.put(
        `/api/places/${editingPlace.id}`,
        editingPlace
      );

      // Then update local state
      setCurrentUser((prev) => ({
        ...prev,
        createdPLaces: prev.createdPLaces.map((place) =>
          place.id === editingPlace.id ? response.data.place : place
        ),
      }));
      setEditingPlace(null);
    } catch (error) {
      console.error("Error updating place:", error);
      alert("Газар засах явцад алдаа гарлаа");
    }
  };

  const handleCancelEdit = () => {
    setEditingPlace(null);
  };

  const handleAddPlace = () => {
    navigate("/placeadd", { state: { currentUser } });
  };

  const handleEditFieldChange = (field, value) => {
    setEditingPlace((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Таны газрууд</h1>
        {currentUser && (
          <div className="flex items-center space-x-3">
            <span className="text-gray-600 hidden md:inline">
              {currentUser.username}
            </span>
            <img
              src={currentUser.userImgUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
            />
          </div>
        )}
      </header>

      {!currentUser ? (
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Хэрэглэгчийн мэдээлэл олдсонгүй</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentUser.createdPLaces?.length > 0 ? (
              currentUser.createdPLaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        place.placeImgUrl ||
                        "https://via.placeholder.com/500x300"
                      }
                      alt={place.placeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    {editingPlace?.id === place.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Газрын нэр
                          </label>
                          <input
                            type="text"
                            value={editingPlace.placeName}
                            onChange={(e) =>
                              handleEditFieldChange("placeName", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Тайлбар
                          </label>
                          <textarea
                            value={editingPlace.placeDescription}
                            onChange={(e) =>
                              handleEditFieldChange(
                                "placeDescription",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded"
                            rows="3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Хаяг
                          </label>
                          <input
                            type="text"
                            value={editingPlace.placeAddress}
                            onChange={(e) =>
                              handleEditFieldChange(
                                "placeAddress",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Хадгалах
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Цуцлах
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {place.placeName}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {place.placeDescription}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          {place.placeAddress}
                        </p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(place)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Засах
                          </button>
                          <button
                            onClick={() => handleDelete(place.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Устгах
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-4 rounded-lg shadow-md text-center">
                <p className="text-gray-600">
                  Одоогоор нэмсэн газар байхгүй байна
                </p>
              </div>
            )}
          </div>

          <div className="fixed bottom-8 right-8">
            <button
              onClick={handleAddPlace}
              className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              aria-label="Add new place"
            >
              <CiCirclePlus className="w-8 h-8" />
            </button>
          </div>
        </>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Буцах
      </button>
    </div>
  );
}

export default CurrentPlace;
