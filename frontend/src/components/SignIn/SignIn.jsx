import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.username,
          password: form.password,
        }),
      });

      if (!response.ok) {
        alert("Нэвтрэх нэр эсвэл нууц үг буруу байна.");
        return;
      }

      alert("Амжилттай нэвтэрлээ!");
      navigate("/places");
    } catch (err) {
      console.error("Login error:", err);
      alert("Алдаа гарлаа. Сүлжээг шалгана уу.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md w-[400px] mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Нэвтрэх</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Нэвтрэх нэр:</label>
          <input
            className="border border-black rounded w-full px-2 py-1"
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div>
          <label>Нууц үг:</label>
          <input
            className="border border-black rounded w-full px-2 py-1"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Нэвтрэх
          </button>
          <button type="button" onClick={() => navigate("/register")}>
            Бүртгүүлэх
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
