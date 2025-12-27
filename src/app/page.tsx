// import Image from "next/image";
import Header from "../components/Header";
import Postalcode from "../components/Postalcode";
import { CategoryGrid } from "../components/CategoryGrid";
import BrowseFlyers from "../components/BrowseFlyers";
import Browseshoppinglist from "../components/Browseshoppinglist";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
    <Header />
    
    <Postalcode />
    <CategoryGrid />
    <BrowseFlyers />
    <Browseshoppinglist />
    <Footer />
    </div>
  );
}

export default Home;