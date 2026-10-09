import { useState } from "react";

import Page1 from "./pages/Page1/Page1";
import Page2 from "./pages/Page2/Page2";
import Page3 from "./pages/Page3/Page3";
import Page4 from "./pages/Page4/Page4";
import Page5 from "./pages/Page5/Page5";
import Page6 from "./pages/Page6/Page6";

function App() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      {currentPage === 1 && (
        <Page1
          onUnlock={() => setCurrentPage(2)}
        />
      )}

      {currentPage === 2 && (
        <Page2
          onNext={() => setCurrentPage(3)}
        />
      )}

      {currentPage === 3 && (
        <Page3
          onNext={() => setCurrentPage(4)}
        />
      )}

      {currentPage === 4 && (
        <Page4
          onNavigate={(page) => {
            if (page === "Page3") {
              setCurrentPage(3);
            }

            if (page === "Page5") {
              setCurrentPage(5);
            }

            if (page === "Page6") {
              setCurrentPage(6);
            }

            if (page === "Page7") {
              setCurrentPage(7);
            }
          }}
        />
      )}

      {currentPage === 5 && (
        <Page5
          onNavigate={(page) => {
            if (page === "Page4") {
              setCurrentPage(4);
            }

            if (page === "Page6") {
              setCurrentPage(6);
            }
          }}
        />
      )}

      {currentPage === 6 && (
        <Page6
          onNavigate={(page) => {
            if (page === "Page1") setCurrentPage(1);
            if (page === "Page4") setCurrentPage(4);
            if (page === "Page5") setCurrentPage(5);
            if (page === "Page7") setCurrentPage(7);
            if (page === "Page8") setCurrentPage(8);
          }}
        />
      )}
    </>
  );
}

export default App;