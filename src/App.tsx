import SnapScrollComponent from './components/SnapScrollComponent';


const App: React.FC = () => {

  return (
    <div className="min-h-screen bg-white">
      <h1 className="fixed top-4 left-4 text-3xl font-bold text-gray-300 p-2 z-50">GrimTok</h1>
      <SnapScrollComponent />
    </div>
  );
};

export default App;
