import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bem-vindo ao Painel</h2>
      <p>Você está logado como: {localStorage.getItem("userEmail")}</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
