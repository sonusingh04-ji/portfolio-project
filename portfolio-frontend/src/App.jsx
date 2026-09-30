import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";

const App = () => {
  return (
      <BrowserRouter>

        <Routes>

          {/* Public website */}
          <Route element={<PublicLayout />}>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/about"
                element={<About />}
            />

            <Route
                path="/skills"
                element={<Skills />}
            />

            <Route
                path="/projects"
                element={<Projects />}
            />

            <Route
                path="/experience"
                element={<Experience />}
            />

            <Route
                path="/services"
                element={<Services />}
            />

            <Route
                path="/testimonials"
                element={<Testimonials />}
            />

            <Route
                path="/blog"
                element={<Blogs />}
            />

            <Route
                path="/blog/:slug"
                element={<BlogDetail />}
            />

            <Route
                path="/contact"
                element={<Contact />}
            />

          </Route>

        </Routes>

      </BrowserRouter>
  );
};

export default App;