export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Your merchandise tracking dashboard</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Activities</h2>
          <p className="text-sm text-gray-600 mt-1">Track your daily activities</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">View assigned tasks</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Generate performance reports</p>
        </div>
      </div>
    </div>
  );
}