export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-sm w-full text-center border border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-900 mb-2">
          Achados e Perdidos
        </h1>
        <p className="text-gray-600 text-sm mb-4">
          Campus Divinópolis - UEMG
        </p>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200">
          Ver Itens Perdidos
        </button>
      </div>
    </div>
  );
}