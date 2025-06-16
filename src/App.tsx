import { BrowserRouter as Router, Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useTranslation } from "react-i18next";
import "./i18n";

function AppContent() {
  const { toggle, darkMode } = useTheme();
  const { i18n, t } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "fa" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Router>
      <div className="flex-1 min-h-screen bg-white dark:bg-gray-900">
        <nav className="flex flex-wrap items-center justify-between bg-gray-100 dark:bg-gray-900 p-4 mb-6 shadow-md">
          <div>
            <Link className="mr-4 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold" to="/">
              {t("form")}
            </Link>
            <Link className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold" to="/submissions">
              {t("submissions")}
            </Link>
          </div>

          <div className="flex space-x-4">
            <button onClick={toggle} className="px-3 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600">
              Switch to {darkMode ? "Light" : "Dark"} Mode
            </button>
            <button onClick={toggleLang} className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600">
              {t("switch_lang")} ({i18n.language === "en" ? "FA" : "EN"})
            </button>
          </div>
        </nav>

        <AppRoutes />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
