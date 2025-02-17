import SnapScrollComponent from './components/SnapScrollComponent';


const App: React.FC = () => {

  return (
    <div className="min-h-screen bg-white hide-scroll">
      <a href="https://grimtok.vercel.app/" className="fixed top-4 left-4 text-3xl font-bold text-gray-300 p-2 z-50">GrimTok</a>
      <SnapScrollComponent />
    </div>
  );
};

export default App;
