const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow p-5">
          <h3>Total Users</h3>
          <p className="text-3xl font-bold">
            1,250
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3>Total Orders</h3>
          <p className="text-3xl font-bold">
            860
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3>Revenue</h3>
          <p className="text-3xl font-bold">
            ₹1,20,000
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3>Products</h3>
          <p className="text-3xl font-bold">
            320
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;