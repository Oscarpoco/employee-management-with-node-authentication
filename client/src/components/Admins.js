import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './employees.css';
import './registration.css';

function Admins({ 
  admins = [], 
  deletedAdmins = [], 
  onDeleteAdmin, 
  onViewEmployee, 
  viewDeletedAdmins, 
  HandleOpenViewDeletedAdmins, 
  HandleCloseViewDeletedAdmins,
  onAddEmployee,
  setAdminEdit,
  handleAddAdmin
}) 

{

  const [searchId, setSearchId] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState(admins);
  const [filteredPreviousAdmins, setFilteredPreviousAdmins] = useState(deletedAdmins);
  const [showAddingForm, setShowAddingForm] = useState(false);

  // FORM
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setId] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  // HANDLE SUBMITTING FORM
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newAdmin = { name, surname, email, idNumber, position, phone, password };
    console.log('Employee data from form:', newAdmin);  
    handleAddAdmin(newAdmin, image);
  
    // Clear the form after submission
    setName('');
    setSurname('');
    setEmail('');
    setId('');
    setPosition('');
    setPhone('');
    setPassword('');
    setImage(null);
    setShowAddingForm(false)    
  };

  // FETCH ADMINS
  useEffect(() => {
    setFilteredAdmins(admins);
  }, [admins]);

  // PREV EMPLOYEES
  useEffect(() => {
    setFilteredPreviousAdmins(deletedAdmins);
  }, [deletedAdmins]);

  // HANDLE SEARCH
  const handleSearch = () => {
    if (searchId) {
      const result = admins.filter(admin => admin.idNumber.includes(searchId));
      setFilteredAdmins(result);
    } else {
      setFilteredAdmins(admins);
    }
  };


  // HANDLE SEARCH
  const handleSearchPrevAdmins = () => {
    if (searchId) {
      const result = deletedAdmins.filter(deletedAdmin => deletedAdmin.idNumber.includes(searchId));
      setFilteredPreviousAdmins(result);
    } else {
      setFilteredPreviousAdmins(deletedAdmins);
    }
  };

  // HANDLE ENABLING AND DISABLING
 






  

  return (
    <div className='employees-box'>

      {viewDeletedAdmins === 'admins' ?

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

            <button onClick={(()=>{setShowAddingForm(true)})}>Add New Admin</button>

            <button className='previous-employees-button' onClick={HandleOpenViewDeletedAdmins}>View Previous Admins</button>
          </div>
          <div className='employees-table'>
            {filteredAdmins.length > 0 ? (
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
                    <th>Blocking</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin, index) => (
                    <tr key={index}>
                      <td>{admin.name}</td>
                      <td>{admin.surname}</td>
                      <td>{admin.email}</td>
                      <td>{admin.idNumber}</td>
                      <td>{admin.position}</td>
                      <td>{admin.phone}</td>
                      <td><img src={admin.profilePicture} alt='employee'/></td>
                      <td className='table-div'>
                        <button className='table-button' onClick={() => 
                          {
                            onViewEmployee(admin);
                            setAdminEdit(true);
                          }
                          }>VIEW</button>
                        <button className='table-button' onClick={() => onDeleteAdmin(admin.id)}>REMOVE</button>
                      </td>

                      <td className='table-div'>
                        <button id='Enable' className='table-button' >ENABLE</button>
                        <button id='Disable' className='table-button' >DISABLE</button>
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
            <button onClick={handleSearchPrevAdmins}>Search</button>
            <button className='previous-employees-button' onClick={HandleCloseViewDeletedAdmins}>View Admins</button>
          </div>
          <div className='employees-table'>
            {filteredPreviousAdmins.length > 0 ? (
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
                  {filteredPreviousAdmins.map((deletedAdmin, index) => (
                    <tr key={index}>
                      <td>{deletedAdmin.name}</td>
                      <td>{deletedAdmin.surname}</td>
                      <td>{deletedAdmin.email}</td>
                      <td>{deletedAdmin.idNumber}</td>
                      <td>{deletedAdmin.position}</td>
                      <td>{deletedAdmin.phone}</td>
                      <td><img src={deletedAdmin.profilePicture} alt='employee' width='50' /></td>
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

      {/* FORM POPUP */}
      {showAddingForm && (
        <div className='popup-layout'>

          <div className='popup'>
            <button className='closeButton' onClick={(()=>{setShowAddingForm(false)})}><span>+</span></button>
            <div className='registration-box'>
                <div className='form-title'>REGISTER ADMIN</div>
                <form onSubmit={handleSubmit}>
                  <input type="text" id='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
                  <input type="text" id='surname' placeholder='Surname' value={surname} onChange={(e) => setSurname(e.target.value)} required />
                  <input type="email" id='email' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <input type="password" id='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <input type="text" id='id' pattern="(\d{13})" maxLength="13" placeholder='ID number' value={idNumber} onChange={(e) => setId(e.target.value)} required />
                  <input type="text" id='position' placeholder='Position' value={position} onChange={(e) => setPosition(e.target.value)} required />
                  <input type="tel" pattern="(\+27\d{9}|0\d{9})" placeholder='Eg. +27 660 850 741 / 066 0850 741' maxLength="12" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  <input type="file" name='image' id='image' accept='image/*' onChange={(e) => setImage(e.target.files[0])} required />
                  <button type='submit'>SUBMIT</button>
                </form>
              </div>
            </div>

        </div>
      )}
    </div>
  );
}

export default Admins;
