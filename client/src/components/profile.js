import React, { useState, useEffect } from 'react';
import './profile.css';

function Profile({ employee, onUpdateEmployee, handleUpdateAdmin, adminEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState({ ...employee });
    const [viewPicture, setViewPicture] = useState('');

    // Update the state whenever the employee prop changes
    useEffect(() => {
        setEditedEmployee({ ...employee });
    }, [employee]);

    // HANDLES THE CHANGE IN INPUTS
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee((prev) => ({ ...prev, [name]: value }));
    };
    // ENDS

    // HANDLES THE EDIT AND AND UPDATES OF EMPLOYEE
    const handleEditClick = () => {
        if (isEditing) {
            onUpdateEmployee(editedEmployee);
        }
        setIsEditing(!isEditing);
    };
    // ENDS

    // HANDLES THE EDIT AND AND UPDATES OF ADMIN
    const handleAdminEditClick = () => {
        if (isEditing) {
            handleUpdateAdmin(editedEmployee);
        }
        setIsEditing(!isEditing);
    };
    // ENDS

    // MY PROFILE CONTENT
    return (
        <div className='profile-box'>
            <div className='profile-title'>
                PROFILE
            <button className='changeEdit'>{adminEdit ? 'ADMIN' : 'EMPLOYEE'}</button>
            </div>
                

            <div className='profile'>
                <div className='img-circle' onClick={(()=>{setViewPicture(true)})}>
                    <img src={editedEmployee.profilePicture} alt='Employee' />
                </div>
                <div className='details-box'>
                    <div className='details'>
                        <p><span>Name:</span> {isEditing ? <input type='text' name='name' value={editedEmployee.name} onChange={handleInputChange} /> : <span>{editedEmployee.name}</span>}</p>
                        <p><span>Surname:</span> {isEditing ? <input type='text' name='surname' value={editedEmployee.surname} onChange={handleInputChange} /> : <span>{editedEmployee.surname}</span>}</p>
                        <p><span>Email:</span> {isEditing ? <input type='email' name='email' value={editedEmployee.email} onChange={handleInputChange} /> : <span>{editedEmployee.email}</span>}</p>
                        <p><span>ID:</span>{isEditing ? <input type='text' readOnly name='idNumber' value={editedEmployee.idNumber} onChange={handleInputChange} /> : <span>{editedEmployee.idNumber}</span>}</p>
                        <p><span>Position:</span> {isEditing ? <input type='text' name='position' value={editedEmployee.position} onChange={handleInputChange} /> : <span>{editedEmployee.position}</span>}</p>
                        <p> <span>Phone:</span>{isEditing ? <input type='tel' name='phone' value={editedEmployee.phone} onChange={handleInputChange} /> : <span>{editedEmployee.phone}</span>}</p>
                    </div>
                    <div className='button'>
                        {adminEdit ? 
                        <button onClick={handleAdminEditClick}>{isEditing ? 'UPDATE' : 'EDIT ADMIN'}</button>
                        :
                        <button onClick={handleEditClick}>{isEditing ? 'UPDATE' : 'EDIT EMPLOYEE'}</button>
                    }
                    </div>
                </div>
            </div>

            {/* PROFILE PICTURE POPUP */}
            {viewPicture && (
                <div className='picture-popup'>
                    <div className='employee-picture'>
                        <img src={editedEmployee.profilePicture} alt='employee-picture'></img>
                    </div>
                    <button className='profile-close' onClick={(()=>{setViewPicture(false)})}>
                        <span>+</span>
                    </button>
                </div>
            )}
        </div>
    );
    // ENDS
}
// FUNCTION ENDS

export default Profile;
