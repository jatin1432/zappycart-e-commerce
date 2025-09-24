import React, { useRef } from "react";
import HeroSection from "../components/HeroSection";
import ProductList from "../components/ProductSection";
import ReviewTicker from "../components/ReviewTicker";
import ContactForm from "../components/ContactForm";
import CategoriesSection from "../components/CategoriesSection";

export const sectionRefs = {
  product: React.createRef(),
  review: React.createRef(),
  contact: React.createRef(),
};

const HomePage = () => {
  return (

    <div>
      <HeroSection />
      <div>
        <CategoriesSection/>
      </div>
      <div ref={sectionRefs.product}>
        <ProductList />
      </div>
      <div ref={sectionRefs.review}>
        <ReviewTicker />
      </div>
      <div ref={sectionRefs.contact}>
        <ContactForm/>
      </div>
    </div>
  );
};

export default HomePage;
