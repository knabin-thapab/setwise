import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Faq from "./pages/Faq";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import StateTaxPage from "./pages/StateTaxPage";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import ProfitMargin from "./pages/ProfitMargin";
import MileageCalculator from "./pages/MileageCalculator";
import W2Vs1099Comparison from "./pages/W2Vs1099Comparison";
import RetirementCalculator from "./pages/RetirementCalculator";
import SCorpCalculator from "./pages/SCorpCalculator";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-estimated-taxes-work" element={<HowItWorks />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-service" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/state-tax" element={<StateTaxPage />} />
        <Route path="/state-tax/:stateSlug" element={<StateTaxPage />} />
        <Route path="/invoice-generator" element={<InvoiceGenerator />} />
        <Route path="/profit-margin-calculator" element={<ProfitMargin />} />
        <Route path="/mileage-calculator" element={<MileageCalculator />} />
        <Route path="/1099-vs-w2-calculator" element={<W2Vs1099Comparison />} />
        <Route path="/retirement-calculator" element={<RetirementCalculator />} />
        <Route path="/s-corp-calculator" element={<SCorpCalculator />} />
      </Routes>
    </Layout>
  );
}


