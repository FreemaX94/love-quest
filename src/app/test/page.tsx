export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-8 text-center">
          Test Tailwind CSS
        </h1>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            Red Box
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg">
            Green Box
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            Blue Box
          </div>
        </div>
        
        <button className="mt-8 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 px-8 rounded-full text-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105">
          Tailwind Works!
        </button>
      </div>
    </div>
  )
}