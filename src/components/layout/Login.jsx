import { T } from "../../constants/theme";
import LogoSrc from "../../assets/logo.png";

export function Login({ onLogin }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f0f0",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: T.radL,
          padding: "80px 96px",
          width: "100%",
          maxWidth: 640,
          boxShadow: T.shadowL,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
        }}
      >
        <img src={LogoSrc} alt="Comunica Simples" style={{ width: 340, display: "block" }} />
        <button
          onClick={onLogin}
          type="button"
          style={{
            background: T.pri,
            color: "#ffffff",
            border: "none",
            borderRadius: T.radS,
            padding: "12px 40px",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: ".03em",
            transition: "background .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = T.priHov;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = T.pri;
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
