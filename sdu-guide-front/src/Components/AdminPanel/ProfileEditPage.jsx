import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppBar from './AppBar';

const ProfileUpdatePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        _id: 0,
        username: '',
        firstName: '',
        email:'',
        lastName: '',
        gender: '',
        imageHash: '',
        registrationDate:'',
        lastLogin:''
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/profile', {
                    withCredentials: true
                });
                const userData = response.data.data;
                setUser(userData);
                setFormData({
                    _id: userData._id,
                    username: userData.username || '',
                    firstName: userData.firstName || '',
                    email: userData.email,
                    lastName: userData.lastName || '',
                    imageHash: userData.imageHash || '',
                    registrationDate: userData.registrationDate || '',
                    lastLogin: userData.lastLogin || ''
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
                if (error.response?.status === 401) {
                    navigate("/");
                }
            }
        };
        fetchProfileData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const data = new FormData();
        data.append('image', file);
        try {
            const response = await axios.post('http://localhost:8000/upload-image', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            console.log('New image hash:', response.data.hash); // Лог хеша
            setFormData(prev => ({ ...prev, imageHash: response.data.hash }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:8000/update-user', formData, { withCredentials: true });
            console.log('User data updated successfully');
            navigate("/profile");
        } catch (error) {
            console.error('Error updating user data:', error);
            if (error.response?.status === 401) {
                navigate("/");
            }
        }
    };

    return (
        <div>
            <AppBar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", marginTop: "50px" }}>
                <h1 style={{ fontSize: "50px", color: "#33437C", fontWeight: "lighter", marginBottom: "20px" }}>Редактировать профиль</h1>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <div style={{ marginRight: "20px", display: "flex", flexDirection: "column" }}>
                        <img src={formData.imageHash ? `http://localhost:8000/image/${formData.imageHash}` : "https://via.placeholder.com/250"}  alt="User" style={{ maxWidth: '300px', marginTop: '10px' }} />
                        <input type="file" id="file" style={{ display: 'none' }} onChange={handleFileChange} />
                        <label htmlFor="file" style={{ padding: '10px 20px', backgroundColor: '#33437C', color: '#fff', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontWeight: "bold" }}>Выберите файл</label>
                    </div>
                    {user && (
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: "20px", color: "#33437C" }}>Имя пользователя</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '5px' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: "20px", color: "#33437C" }}>Имя</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '5px' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: "20px", color: "#33437C" }}>Фамилия</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '5px' }} />
                            </div>
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#33437C', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontWeight: "bold" }}>Изменить</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdatePage;
