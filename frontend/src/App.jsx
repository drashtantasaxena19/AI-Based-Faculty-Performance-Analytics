import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import EvaluationForm from "./components/EvaluationForm";
import ResultPage from "./components/ResultPage";
import HistoryPage from "./components/HistoryPage";
import EvaluationGraphsPage from "./components/EvaluationGraphsPage";

export default function App() {
  const [page, setPage] = useState("Home");
  const [evaluationResult, setEvaluationResult] = useState(null);

  // 1. BRIDGE HANDLER: Opens result card from Home or History
  // We keep the data loading logic but focus navigation on the result view
  const handleViewRecord = (record) => {
    setEvaluationResult(record);
    setPage("Result");
  };

  // Handler for fresh evaluations coming from the Form
  const handleNewResult = (data) => {
    setEvaluationResult(data);
    setPage("Result");
  };

  // 2. SPECIFIC NAVIGATION: This forces the "New Evaluation" button 
  // to always land on the Evaluation Form page.
  const handleStartNew = () => {
    setEvaluationResult(null); // Clear previous results
    setPage("Evaluate Faculty"); // Go specifically to the input form
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-indigo-100">
      <Navbar page={page} setPage={setPage} />
      
      <main className="max-w-7xl mx-auto pt-28 pb-16 px-4 md:px-8">
        <div className="page-transition min-h-[70vh]">
          
          {page === "Home" && (
            <HomePage setPage={setPage} onSelectRecord={handleViewRecord} />
          )}
          
          {page === "Evaluate Faculty" && (
            <EvaluationForm onResult={handleNewResult} />
          )}

          {page === "Result" && evaluationResult ? (
            <ResultPage 
              result={evaluationResult} 
              goBack={handleStartNew} // Linked to handleStartNew
            />
          ) : page === "Result" && (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-slate-400">No active evaluation found.</h3>
              <button onClick={handleStartNew} className="mt-4 text-indigo-600 font-bold underline">
                Start New Evaluation
              </button>
            </div>
          )}

          {page === "History" && (
            <HistoryPage onSelectRecord={handleViewRecord} />
          )}
          
          {page === "Evaluation Graphs" && <EvaluationGraphsPage />}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        &copy; 2026 AI Faculty Analytics Platform • Professional Edition
      </footer>
    </div>
  );
} 