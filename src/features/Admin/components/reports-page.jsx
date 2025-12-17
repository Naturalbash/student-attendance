import React from 'react';

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Report</h3>
          <p className="text-gray-600 mb-4">Generate comprehensive monthly attendance reports</p>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Course Analysis</h3>
          <p className="text-gray-600 mb-4">Analyze attendance patterns by course</p>
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            View Analysis
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Student Performance</h3>
          <p className="text-gray-600 mb-4">Individual student attendance tracking</p>
          <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            View Performance
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;


