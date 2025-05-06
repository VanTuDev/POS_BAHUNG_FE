import HeaderLanding from "../../components/HeaderLanding";
import MainLanding from "../../components/MainLanding";
import FooterLanding from "../../components/FooterLanding";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLanding />
      <MainLanding />
      <FooterLanding />
    </div>
  );
};

export default LandingPage;
