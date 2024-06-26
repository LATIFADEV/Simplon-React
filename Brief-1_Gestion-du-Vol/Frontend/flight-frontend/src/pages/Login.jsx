import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const decodeToken = (token) => {
        try {
          const base64Url = token.split('.')[1]; // Get the payload part of the token
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert Base64URL to Base64
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')); // Convert Base64 to ASCII and URI decode
      
          return JSON.parse(jsonPayload); // Convert JSON string to object
        } catch (e) {
          console.error('Error decoding token:', e);
          return null;
        }
      };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                const { token } = data;
                // Do something with the token (e.g., store it in local storage)
                console.log('Login successful. Token:', token);
                localStorage.setItem('token', token);
                const userId = decodeToken(token).userId;
                localStorage.setItem('userId', userId)
                // Reset form fields and error state
                setEmail('');
                setPassword('');
                setError('');
                navigate('/');
                window.location.reload()
        
;


                // Redirect or perform any other action upon successful login
            } else {
                // Handle error response
                setError(data.error || 'Unknown error occurred');
            }
        } catch (err) {
            console.error('An error occurred:', err);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container-fluid bg-registration py-5" style={{ margin: '90px 0' }}>
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-lg-7 mb-5 mb-lg-0">
                        <div className="mb-4">
                            <h6 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>Login</h6>
                            <h1 className="text-white">Welcome Back!</h1>
                        </div>
                        {/* Add login form here */}
                    </div>
                    <div className="col-lg-5">
                        <div className="card border-0">
                            <div className="card-header bg-primary text-center p-4">
                                <h1 className="text-white m-0">Login</h1>
                            </div>
                            <div className="card-body rounded-bottom bg-white p-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            className="form-control p-4"
                                            placeholder="Your email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control p-4"
                                            placeholder="Your password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <button className="btn btn-primary btn-block py-3" type="submit">Login</button>
                                    </div>
                                    {error && <p className="text-danger mt-3">{error}</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
