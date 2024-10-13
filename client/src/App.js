
// REACT IMPORTS
import { useState, useEffect } from 'react';

// EXTRA IMPORTS
import axios from 'axios';
import './App.css';

// COMPONENTS
import SignIn from './components/signIn';
import Employees from './components/employees';
import Registration from './components/registration';
import Profile from './components/profile';
import NavBar from './components/navBar';
import Loader from './components/Loader';
import Notification from './components/notification';
import Admins from './components/Admins';

// FIREBASE IMPORTS
import { storage, ref, uploadBytes, getDownloadURL } from './firebase/FirebaseConfig';

function App() {

  const [currentView, setCurrentView] = useState('signIn');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEdit, setAdminEdit] = useState(false);

  // EMPLOYEES AND ADMINS
  const [employees, setEmployees] = useState([]);
  const [admins, setAdmins] = useState([]);

  // DELETED EMPLOYEES AND ADMINS
  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [deletedAdmins, setDeletedAdmins] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // VIEW EMPLOYEES AND ADMINS
  const [viewDeletedEmployees, setViewDeletedEmployees ] = useState('employees');
  const [viewDeletedAdmins, setViewDeletedAdmins ] = useState('admins');

  // LOGGED IN ADMIN'S EMAIL
  const [loggedInAdmin, setLoggedInAdmin] = useState(null);


  // Check login status on component mount
  useEffect(() => {
    const loggedIn = window.localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    const newLoggedInAdmin = window.localStorage.getItem('loggedInAdmin');
    setLoggedInAdmin(newLoggedInAdmin);

    setCurrentView(loggedIn ? 'employees' : 'signIn');
  }, []);


  // HANDLES POST, GET, PUT AND DELETE FOR ONLY EMPLOYEES

  // Load employees from server
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Load deleted employees from server
  useEffect(() => {
    const fetchDeletedEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/deleted_employees`);
        setDeletedEmployees(response.data);
      } catch (error) {
        console.error('Error fetching deleted employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeletedEmployees();
  }, []);


  // HANDLE ADD EMPLOYEE
  const handleAddEmployee = async (employee, file) => {
    setIsLoading(true);
  
    try {
      // Check if employee already exists
      const checkResponse = await axios.post('http://localhost:5000/check-employee', {
        email: employee.email,
        idNumber: employee.idNumber,
        phone: employee.phone
      });
  
      if (checkResponse.data.exists) {
        setNotification({ message: checkResponse.data.message, type: 'error' });
        return;
      }
  
      let imageUrl = '';
  
      // Upload the image to Firebase Storage if a file is provided
      if (file) {
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `employees/${uniqueFilename}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
  
      // Include the image URL in the employee object
      const newEmployee = { ...employee, profilePicture: imageUrl };
  
      // Send the employee data wrapped in an object with the 'employee' key
      const response = await axios.post('http://localhost:5000/employees', { employee: newEmployee });
  
      setEmployees([...employees, { ...newEmployee, id: response.data.id }]);
      setNotification({ message: 'Successfully added', type: 'success' });
    } catch (error) {
      console.error('Error adding employee:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      setNotification('Failed to add employee: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id) => {

    setIsLoading(true);

    try {
      const employeeToDelete = employees.find(emp => emp.id === id);
      await axios.delete(`http://localhost:5000/employees/${id}`);
      setEmployees(employees.filter(employee => employee.id !== id));
      setDeletedEmployees([...deletedEmployees, employeeToDelete]);
      setNotification({ message: 'Successfully deleted', type: 'success' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      setNotification({ message: 'Failed to delete employee', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // Handle update employee
  const handleUpdateEmployee = async (updatedEmployee) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:5000/employees/${updatedEmployee.id}`, updatedEmployee);
      setEmployees((prevEmployees) =>
        prevEmployees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );
      setNotification({ message: 'Successfully updated', type: 'success' });
    } catch (error) {
      console.error('Error updating employee:', error);
      setNotification({ message: 'Failed to update employee', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // HANDLES POST, GET, PUT AND DELETE FOR ONLY EMPLOYEES ENDS


  // HANDLES POST, GET, PUT AND DELETE FOR ONLY ADMINS STARTS

  // fetch deleted admins
  useEffect(()=>{
    const fetchDeletedAdmins = async () => {
      setIsLoading(true);
      try {
          const response = await axios.get(`http://localhost:5000/deletedAdmins`);
          setDeletedAdmins(response.data);
      } catch (error) {
          console.error('Error fetching deleted admins:', error);
      } finally {
          setIsLoading(false);
      }
  };
  fetchDeletedAdmins();
  }, [])


  // fetch admins 
  useEffect(()=>{
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
          const response = await axios.get(`http://localhost:5000/admins`);
          setAdmins(response.data);
      } catch (error) {
          console.error('Error fetching deleted admins:', error);
      } finally {
          setIsLoading(false);
      }
  };
  fetchAdmins();
  }, [])

  // handles adding
  const handleAddAdmin = async (admin, file) => {
    setIsLoading(true);
  
    try {
      // Check if admin already exists
      const checkResponse = await axios.post('http://localhost:5000/check-admin', {
        email: admin.email,
        idNumber: admin.idNumber,
        phone: admin.phone
      });
  
      if (checkResponse.data.exists) {
        setNotification({ message: checkResponse.data.message, type: 'error' });
        return;
      }
  
      let imageUrl = '';
  
      // Upload the image to Firebase Storage if a file is provided
      if (file) {
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `admins/${uniqueFilename}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
  
      // Include the image URL in the admin object
      const newAdmin = { ...admin, profilePicture: imageUrl };
  
      // Send the admin data wrapped in an object with the 'admin' key
      const response = await axios.post('http://localhost:5000/admins', { admin: newAdmin });
  
      setAdmins([...admins, { ...newAdmin, id: response.data.id }]);
      setNotification({ message: 'Successfully added admin', type: 'success' });
    } catch (error) {
      console.error('Error adding admin:', error);
      setNotification('Failed to add admin: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  // handles delete
  const handleDeleteAdmin = async (id) => {
    setIsLoading(true);
  
    try {
      const adminToDelete = admins.find(admin => admin.id === id);
      await axios.delete(`http://localhost:5000/admins/${id}`);
      setAdmins(admins.filter(admin => admin.id !== id));
      setDeletedAdmins([...deletedAdmins, adminToDelete]);
      setNotification({ message: 'Successfully deleted admin', type: 'success' });
    } catch (error) {
      console.error('Error deleting admin:', error);
      setNotification({ message: 'Failed to delete admin', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // handles updates
  const handleUpdateAdmin = async (updatedEmployee) => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:5000/admins/${updatedEmployee.id}`, updatedEmployee);
      setAdmins((prevAdmins) =>
        prevAdmins.map(admin => (admin.id === updatedEmployee.id ? updatedEmployee : admin))
      );
      setNotification({ message: 'Successfully updated admin', type: 'success' });
    } catch (error) {
      console.error('Error updating admin:', error);
      setNotification({ message: 'Failed to update admin', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(''), 2000);
    }
  };

  // HANDLES POST, GET, PUT AND DELETE FOR ONLY ADMINS ENDS



  // OTHER FUNCTIONS STARTS

  // Handle login
  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setCurrentView('employees');
      
      // Fetch employees after login
      try {
        const response = await axios.get(`http://localhost:5000/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
      
      setIsLoading(false);
    }, 2000);
  };

  // Handle sign-out
  const handleSignOut = () => {
    setIsLoading(true);
    setTimeout(() => {

      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);

      localStorage.removeItem('loggedInAdmin');
      setLoggedInAdmin(null);

      setSelectedEmployee(null);
      setCurrentView('signIn');

      setIsLoading(false);
    }, 2000);
  };

  // Handle view employee profile
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee); 
    setCurrentView('profile');      
  };

  // setViewDeletedEmployees
  const HandleOpenViewDeletedEmployees = () => {
   
    setIsLoading(true);
    setTimeout(()=>{
     setViewDeletedEmployees('deletedEmployees');
     setIsLoading(false);
   }, 2000);

  }

  const HandleCloseViewDeletedEmployees = () => {

   setIsLoading(true);
   setTimeout(()=>{
    setViewDeletedEmployees('employees');
    setIsLoading(false);
   }, 2000);

  }

  // setViewDeletedEmployees
  const HandleOpenViewDeletedAdmins = () => {
   
    setIsLoading(true);
    setTimeout(()=>{
     setViewDeletedAdmins('deletedAdmins');
     setIsLoading(false);
   }, 2000);

  }

  const HandleCloseViewDeletedAdmins = () => {

   setIsLoading(true);
   setTimeout(()=>{
    setViewDeletedAdmins('admins');
    setIsLoading(false);
   }, 2000);

  }

  // ENDS

  const renderContent = () => {
    switch (currentView) {
      case 'signIn':
        return <SignIn 
                  onLogin={handleLogin} 
                  setLoggedInAdmin={setLoggedInAdmin} 
                  loggedInAdmin={loggedInAdmin}
              />;

      case 'employees':
        return (
          <Employees
            employees={employees}
            onDeleteEmployee={handleDeleteEmployee}
            onViewEmployee={handleViewEmployee}
            deletedEmployees={deletedEmployees}
            HandleOpenViewDeletedEmployees ={HandleOpenViewDeletedEmployees}
            HandleCloseViewDeletedEmployees ={HandleCloseViewDeletedEmployees}
            viewDeletedEmployees= {viewDeletedEmployees}
            setAdminEdit={setAdminEdit}
          />
        );

      case 'registration':
        return <Registration 
                  onAddEmployee={handleAddEmployee} 
                  setCurrentView={setCurrentView} 
              />;

      case 'profile':
        return <Profile 
                  employee={selectedEmployee} 
                  onUpdateEmployee={handleUpdateEmployee} 
                  handleUpdateAdmin={handleUpdateAdmin}   
                  adminEdit ={adminEdit}                    
              />;

      case 'admins':
        return <Admins
                  admins={admins}
                  onDeleteAdmin={handleDeleteAdmin}
                  handleAddAdmin={handleAddAdmin}
                  onViewEmployee={handleViewEmployee}
                  deletedAdmins={deletedAdmins}
                  HandleOpenViewDeletedAdmins ={HandleOpenViewDeletedAdmins}
                  HandleCloseViewDeletedAdmins ={HandleCloseViewDeletedAdmins}
                  viewDeletedAdmins= {viewDeletedAdmins}
                  setAdminEdit={setAdminEdit}
                  setNotification ={setNotification}
                  setIsLoading={setIsLoading}
        />;

      default:
        return <SignIn 
                  onLogin={handleLogin} 
                  setLoggedInAdmin ={setLoggedInAdmin} 
                  loggedInAdmin={loggedInAdmin}
              />;
    }
  };

  const handleNavigate = (currentView) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView(currentView);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="App">
      <main>
        <nav>
          <div className='name'>
            <div className='gamefusion'><p>GAME<span>FUXION</span></p></div>
          </div>
          {isLoggedIn && (
            <NavBar 
              onNavigate={handleNavigate} 
              onSignOut={handleSignOut} 
              setIsLoading={setIsLoading} 
              currentView={currentView}
              loggedInAdmin={loggedInAdmin}
            />
          )}
        </nav>
        <div className='content'>
          {renderContent()}.
        </div>
      </main>
      {isLoading && <Loader />}
      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
}

export default App;