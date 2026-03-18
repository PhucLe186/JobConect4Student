import axios from 'axios';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [language,setLanguege]= useState('vi')
    const navigate= useNavigate()
    
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: "http://localhost:5000/",
            withCredentials: true,
        });

        instance.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log('API Request:', config.method?.toUpperCase(), config.url);
            console.log('Headers:', config.headers);
            return config;
        });

        instance.interceptors.response.use(
            (response) => {
                console.log('API Response:', response.config.url, response.data);
                return response;
            },
            (error) => {
                console.error('API Error:', error.config?.url, error.response?.data);
                return Promise.reject(error);
            }
        );

        return instance;
    }, [token]);

    useEffect(()=> {
        const refreshToken= async()=> {
            try{
                const res=await api.get('auth/refreshtoken')
                if(res.data){
                    setUser(res.data)
                    setToken(res.data.accesstoken)
                    setLanguege(res.data.language)
                 }
            } catch(err) {
                console.error('Refresh token failed:', err.response?.data || err.message);
                setUser(null);
                setToken(null);
            }  
        }
        refreshToken()
    },[api])

    const login = async(userData) => {
       try{
            const res= await api.post("/auth/login", userData)
            if(res.data) {
                setUser(res.data)
                setToken(res.data.accesstoken)
                setLanguege(res.data.language)
                navigate('/',  {replace: true})
            }

       }catch(error) {
            if(error.response) {
                alert(error.response?.data?.message)
            }
            else {
                alert(' lỗi kết nối')
            }
       }
    };
    const register= async(userData)=> {
        try{
            const res= await api.post("/auth/register", userData)
            if(res.data) {
                alert('đăng ký thành công')
                navigate('/login',  {replace: true})
            }
        }catch(error) {
            if(error.response) {
                alert(error.response?.data?.message)
            }
            console.log(error)
       }
    }

    const logout = async() => {
        const res= await api.get('auth/logout')
        if(res.data.message) {
            setUser(null)
            setToken(null)
        }
    };

    const updateLang= async()=> {
        try {
            const lang = language==='vi'?'en': 'vi'; 
            const res= await api.post('auth/updatelang', {lang: lang})
            if (res.data.lang) {
                setLanguege(res.data.lang)
        }
        }catch(error) {
            if(error.response) {
                alert(error.response?.data?.message)
            }
            else {
                alert(' lỗi kết nối server')
            }
        }
    }



///////////////////////////////////////////////////////////////////////////////////////////////////////
    const value = {
        api,
        user,
        language,
        login,
        logout,
        register,
        updateLang

    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

