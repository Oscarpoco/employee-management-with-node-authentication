import React, { useState, useEffect } from 'react';
import './employees.css';

function Admins({ employees = [], onDeleteEmployee, onViewEmployee, deletedEmployees = [], viewDeletedEmployees, HandleOpenViewDeletedEmployees, HandleCloseViewDeletedEmployees }) {
  const [searchId, setSearchId] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [filteredPreviousEmployees, setFilteredPreviousEmployees] = useState(deletedEmployees);

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  // PREV EMPLOYEES
  useEffect(() => {
    setFilteredPreviousEmployees(deletedEmployees);
  }, [deletedEmployees]);

  // HANDLE SEARCH
  const handleSearch = () => {
    if (searchId) {
      const result = employees.filter(employee => employee.idNumber.includes(searchId));
      setFilteredEmployees(result);
    } else {
      setFilteredEmployees(employees);
    }
  };


  // HANDLE SEARCH
  const handleSearchPrevEmployees = () => {
    if (searchId) {
      const result = deletedEmployees.filter(deletedEmployee => deletedEmployee.idNumber.includes(searchId));
      setFilteredPreviousEmployees(result);
    } else {
      setFilteredPreviousEmployees(deletedEmployees);
    }
  };

  return (
    <div className='employees-box'>

      {viewDeletedEmployees === 'employees' ?

      <div className='current-employees'>
        <div className='employees'>
          <div className='title'>CURRENT ADMINS</div>
          <div className='search-box'>
            <input 
              type='text' 
              placeholder='Search by ID' 
              value={searchId} 
              onChange={(e) => setSearchId(e.target.value)} 
            />
            <button onClick={handleSearch}>Search</button>
            <button className='previous-employees-button' onClick={HandleOpenViewDeletedEmployees}>View Previous Employees</button>
          </div>
          <div className='employees-table'>
            {filteredEmployees.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>ID Number</th>
                    <th>Position</th>
                    <th>Phone</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.name}</td>
                      <td>{employee.surname}</td>
                      <td>{employee.email}</td>
                      <td>{employee.idNumber}</td>
                      <td>{employee.position}</td>
                      <td>{employee.phone}</td>
                      <td><img src={employee.profilePicture} alt='employee'/></td>
                      <td className='table-div'>
                        <button className='table-button' onClick={() => onViewEmployee(employee)}>View</button>
                        <button className='table-button' onClick={() => onDeleteEmployee(employee.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No current admins.</p>
            )}
          </div>
        </div>
      </div>

      :

      <div className='previous-employees'>
        <div className='deleted-employees'>
          <div className='title'>PREVIOUS ADMINS</div>
          <div className='search-box'>
            <input 
              type='text' 
              placeholder='Search by ID' 
              value={searchId} 
              onChange={(e) => setSearchId(e.target.value)} 
            />
            <button onClick={handleSearchPrevEmployees}>Search</button>
            <button className='previous-employees-button' onClick={HandleCloseViewDeletedEmployees}>View Employees</button>
          </div>
          <div className='employees-table'>
            {filteredPreviousEmployees.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>ID Number</th>
                    <th>Position</th>
                    <th>Phone</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPreviousEmployees.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.name}</td>
                      <td>{employee.surname}</td>
                      <td>{employee.email}</td>
                      <td>{employee.idNumber}</td>
                      <td>{employee.position}</td>
                      <td>{employee.phone}</td>
                      <td><img src={employee.profilePicture} alt='employee' width='50' /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No previous admins.</p>
            )}
          </div>
        </div>
      </div>
      }

    </div>
  );
}

export default Admins;
