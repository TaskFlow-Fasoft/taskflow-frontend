import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { login } from "../../services/authService";
import RegisterModal from "./RegisterModal"; // Importa o modal de registro

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controla visibilidade do modal

  const navigate = useNavigate();

  // Redireciona se já estiver logado
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const response = await login(email, password);

    if (response.success) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userEmail", response.user.email);
      navigate("/dashboard");
    } else {
      setErrorMsg(response.message || "Falha na autenticação.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </div>

        {errorMsg && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "-1rem" }}>
            {errorMsg}
          </p>
        )}

        <div className={styles.buttonsContainer}>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={styles.registerButton}
          >
            Registrar
          </button>
        </div>

        <div className={styles.forgotPassword}>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Esqueci minha senha
          </Link>
        </div>
      </form>

      {/* Modal de registro exibido condicionalmente */}
      {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default LoginForm;
