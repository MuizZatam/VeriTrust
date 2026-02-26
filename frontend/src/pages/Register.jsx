import React, { useState } from 'react';
import '../styles/Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [keyPair, setKeyPair] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Backend expects GET /register with name
            const response = await fetch(`http://localhost:5000/register?name=${encodeURIComponent(name)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                setKeyPair({
                    publicKey: data.publicKey || data.public_key,
                    privateKey: data.privateKey || data.private_key
                });
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!keyPair) return;

        const keyData = `Public Key:\n${keyPair.publicKey}\n\nPrivate Key:\n${keyPair.privateKey}`;
        const blob = new Blob([keyData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.replace(/\s+/g, '_')}_veritrust_keys.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="register-container">
            <div className="glass-card">
                <h2>Register Freelancer</h2>

                {!keyPair ? (
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                ) : (
                    <div className="keys-container">
                        <div className="success-message">Successfully registered!</div>
                        <p className="warning-text">
                            Please save your keys immediately. You will need your Private Key to login.
                        </p>

                        <div className="key-box">
                            <label>Public Key</label>
                            <textarea readOnly value={keyPair.publicKey} />
                        </div>

                        <div className="key-box">
                            <label>Private Key</label>
                            <textarea readOnly value={keyPair.privateKey} />
                        </div>

                        <button onClick={handleExport} className="export-btn">
                            Export Keys (.txt)
                        </button>
                        <div className="login-link">
                            <a href="/login">Proceed to Login</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
