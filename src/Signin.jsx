import {useState} from 'react'
// import {toast} from 'sonner'
// import axios from 'axios'
import {Formik, Form, Field } from "formik"
import * as Yup from 'yup'
import {FaEye} from 'react-icons/fa'
import { IoMdEyeOff } from "react-icons/io"
import { BadgeCheck } from 'lucide-react'





const Signin = () => {
    const formSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email") 
            .required("required"),
        password: Yup.string()
            .min(6, "Password too short")
            .max(15, "Password too long")
            .required("required")
    });

    const [type, setType] = useState("password");

    const changeFormType = (e) => {
        e.preventDefault();
        setType(type === "password" ? "text" : "password");
    };

    return (
        <div className='min-h-screen flex'>
            {/* Attendance Section */}
            <div className='flex-1 bg-gradient-to-br from-blue-800 to-purple-500 flex flex-col justify-center items-center text-white p-8'>
                
                 
                    <div className='mb-8 text-center'>
                        <div className='w-32 h-32 mx-auto mb-6 bg-white/20  flex items-center rounded-full justify-center'>                 <BadgeCheck className='w-60 h-30'/>

                        </div>
                        <h2 className='text-4xl font-bold mb-4'>Attendance Management</h2>
                        <p className='text-4x1 text-blue-150 mb-8'>Track your presence, manage your time efficiently</p>
                    </div>
                
            </div>
            
            {/* Right side - Login Form */}
            <div className='flex-1 flex justify-center items-center bg-gray-50'>
                <Formik 
                initialValues={{
                    email: "",
                    password: ""
                }}
                onSubmit={(values) => {
                    console.log(values);
                }}
                validationSchema={formSchema}
            >
                {({ errors, touched }) => (
                    <Form className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                        
                        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800"> ATTENDANCE HUB <br />LOGIN</h1>
                        
                        
                        {errors.email && touched.email && (
                            <p className='bg-red-200 text-red-500 p-2 rounded mb-2'>
                                {errors.email}
                            </p>
                        )}
                        
                        <Field 
                            name='email' 
                            type='email' 
                            placeholder="Email" 
                            className={`w-full px-4 py-2 border rounded-md mb-4 outline-none ${
                                errors.email && touched.email ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        
                        {errors.password && touched.password && (
                            <p className='text-red-500 mb-2'>
                                {errors.password}
                            </p>
                        )}
                        
                        <div className='border border-gray-300 px-4 flex justify-between items-center py-2 rounded-md mb-5'>
                            <Field 
                                name='password' 
                                type={type} 
                                placeholder="Password" 
                                className="flex-1 border-none outline-none"
                            />
                            <button 
                                type="button" 
                                className='cursor-pointer ml-2' 
                                onClick={changeFormType}
                            >
                                {type === "password" ? <FaEye/> : <IoMdEyeOff/>}
                            </button>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Sign In
                        </button>
                    </Form>
                )}
            </Formik>
            </div>
        </div>
    );
};

export default Signin;























//     