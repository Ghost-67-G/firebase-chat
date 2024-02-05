import ChatUI from "../components/ChatUI";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <ChatUI />
      </div>
    </>
  );
};

export default Home;
