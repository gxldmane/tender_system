// components/Login.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {Button} from "@/components/ui/button";

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { saveToken } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.token) {
        saveToken(data.token);
        alert(data.message);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for email and password */}
      <Button type="submit">Login</Button>
    </form>
  );
}