
import './navBar.css';

function NavBar({ onNavigate, onSignOut, currentView, loggedInAdmin}){

    
    return(
        <div className='myNav'>
            
            <div className='navigate-button'>
                <button className= {currentView === 'employees' ? 'active' : ''}
                onClick={() => onNavigate('employees')}>Employees</button>

                <button className= {currentView === 'registration' ? 'active' : ''}
                onClick={() => onNavigate('registration')}>Register</button>

                {/* ONLY ALLOWED FOR SUPER ADMIN */}
                {loggedInAdmin === 'admin@gamefuxionza.com' && (
                    <button className= {currentView === 'admins' ? 'active' : ''}
                    onClick={() => onNavigate('admins')}>Admins</button>
                )}
                {/* ENDS */}

            </div>

            <div className='logout-button'>
                <button onClick={onSignOut}>Logout</button>
            </div>
        </div>
    )
}

export default NavBar;
