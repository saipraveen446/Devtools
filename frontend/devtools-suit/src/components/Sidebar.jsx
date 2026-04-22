import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const tools = [
  
  
  { id: "unicode", name: "Unicode Converter", icon: "🌍", path: "/unicode" },
  { id: "base64", name: "Base64 Tools", icon: "🔐", path: "/base64" },
  { id: "password", name: "Password Generator", icon: "🔑", path: "/password" },
  { id: "cron", name: "Cron Generator", icon: "⏰", path: "/cron-generator" },
  { id: "chmod", name: "Chmod Generator", icon: "🔒", path: "/chmod" },
  { id: "json", name: "JSON Tools", icon: "📝", path: "/json" },
  { id: "ascii", name: "ASCII Converter", icon: "🔤", path: "/ascii" },
  { id: "color", name: "Color Generator", icon: "🎨", path: "/color" },
  { id: "case", name: "Case Converter", icon: "🔄", path: "/case" },
];

function SidebarNavItem({ tool, pathname, hoveredId, setHoveredId }) {
  const isActive = pathname === tool.path;
  const isHovered = hoveredId === tool.id;

  return (
    <div
      onMouseEnter={(e) => {
        e.stopPropagation();
        setHoveredId(tool.id);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setHoveredId(null);
      }}
      style={{
        marginBottom: "0.5rem",
        borderRadius: "8px",
        backgroundColor: isActive ? "#3498db" : (isHovered ? "#34495e" : "transparent"),
        border: isActive ? "1px solid #3498db" : (isHovered ? "1px solid #5dade2" : "1px solid transparent"),
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
    >
      <Link
        to={tool.path}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.75rem 1rem",
          textDecoration: "none",
          color: isActive ? "#ffffff" : "#ecf0f1",
          fontWeight: isActive ? "600" : "500",
        }}
      >
        <span style={{ marginRight: "0.75rem", fontSize: "1.2rem" }}>{tool.icon}</span>
        <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{tool.name}</span>
      </Link>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const [hoveredId, setHoveredId] = useState(null);
  const navProps = { pathname: location.pathname, hoveredId, setHoveredId };

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#2c3e50",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "2rem",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        🛠️ DevTools
      </h2>

      <nav style={{ flex: 1, overflowY: "auto" }}>
        {tools.map((tool) => (
          <SidebarNavItem key={tool.id} tool={tool} {...navProps} />
        ))}
      </nav>


    </div>
  );
}

export default Sidebar;
