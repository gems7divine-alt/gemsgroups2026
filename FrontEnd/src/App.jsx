import { useEffect, useRef, useState } from "react";
import Home from "./pages/Home";
import AboutUs from "./pages/aboutus/AboutUs";
import Services from "./pages/service/Services";
import Leadership from "./pages/leadership/Leadership";
import Contact from "./pages/contact/Contact";
import StaffPassword from "./pages/staffpassword/StaffPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import EmployeeAccess from "./pages/dashboard/EmployeeAccess";
import EmployeeLogin from "./pages/dashboard/EmployeeLogin";
import EmployeeAttendance from "./pages/admindashboard/EmployeeAttendance";
import AdminPassword from "./pages/admindashboard/AdminPassword";
import AdminDashboard from "./pages/admindashboard/AdminDashboard";
import NewEmployeeAdding from "./pages/admindashboard/NewEmployeeAdding";
import TaskAssigning from "./pages/admindashboard/TaskAssigning";
import LeaveApply from "./pages/leaveapply/LeaveApply";

function pageForHash(hash) {
  if (hash === "#/about") return "about";
  if (hash === "#/services") return "services";
  if (hash === "#/leadership") return "leadership";
  if (hash === "#/contact") return "contact";
  if (hash === "#/staffpassword" || hash === "#/staff") return "staffpassword";
  if (hash === "#/dashboard") return "dashboard";
  if (hash === "#/employeeaccess") return "employeeaccess";
  if (hash === "#/employeelogin") return "employeelogin";
  if (hash === "#/employeeattendance") return "employeeattendance";
  if (hash === "#/adminpassword") return "adminpassword";
  if (hash === "#/admindashboard") return "admindashboard";
  if (hash === "#/newemployeeadding") return "newemployeeadding";
  if (hash === "#/taskassigning") return "taskassigning";
  if (hash === "#/leaveapply") return "leaveapply";
  return null;
}

function initialRoute() {
  return pageForHash(window.location.hash) ?? "home";
}

function scrollToHash(hash) {
  if (!hash || hash === "#/" || hash === "#home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  try {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  } catch {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export default function App() {
  const [route, setRoute] = useState(initialRoute);
  const routeRef = useRef(route);

  useEffect(() => {
    const goHome = () => {
      routeRef.current = "home";
      setRoute("home");
    };

    const onHashChange = () => {
      const hash = window.location.hash;
      const page = pageForHash(hash);

      // Direct page links (#/about, #/services, #/leadership, #/contact)
      if (page) {
        if (routeRef.current !== page) {
          routeRef.current = page;
          setRoute(page);
        }
        window.scrollTo(0, 0);
        return;
      }

      // Home links (#/, #home, empty)
      if (!hash || hash === "#/" || hash === "#home") {
        if (routeRef.current !== "home") goHome();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Section anchors (#services, #contact, #story, ...):
      // scroll in place when present, otherwise go home first.
      let found = false;
      try {
        const el = document.querySelector(hash);
        if (el) {
          found = true;
          el.scrollIntoView({ behavior: "smooth" });
        }
      } catch {
        found = false;
      }
      if (!found && routeRef.current !== "home") {
        goHome();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => scrollToHash(hash));
        });
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route === "about") return <AboutUs />;
  if (route === "services") return <Services />;
  if (route === "leadership") return <Leadership />;
  if (route === "contact") return <Contact />;
  if (route === "staffpassword") return <StaffPassword />;
  if (route === "dashboard") return <Dashboard />;
  if (route === "employeeaccess") return <EmployeeAccess />;
  if (route === "employeelogin") return <EmployeeLogin />;
  if (route === "employeeattendance") return <EmployeeAttendance />;
  if (route === "adminpassword") return <AdminPassword />;
  if (route === "admindashboard") return <AdminDashboard />;
  if (route === "newemployeeadding") return <NewEmployeeAdding />;
  if (route === "taskassigning") return <TaskAssigning />;
  if (route === "leaveapply") return <LeaveApply />;
  return <Home />;
}
