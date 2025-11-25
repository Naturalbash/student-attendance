import React, { useState } from 'react';

const StudentDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSignedIn, setIsSignedIn] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [studentData, setStudentData] = useState({
        name: 'Yusuf Maimunah',
        email: 'maimu32@gmail.com',
        Course: 'Website Development Application',
        profileImage: null
    });

    const [courses, setCourses] = useState([
        { id: 1, name: 'Website Development Application', code: 'WDA 101', isActive: false, lastClockIn: null, totalHours: 45, totalPossibleHours: 120, percentage: 37 },
        { id: 2, name: 'Cybersecurity', code: 'CYB 201', isActive: false, lastClockIn: null, totalHours: 38, totalPossibleHours: 100, percentage: 38 },
        { id: 3, name: 'Graphics Design', code: 'GD 301', isActive: false, lastClockIn: null, totalHours: 42, totalPossibleHours: 110, percentage: 38 }
    ]);

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setActiveSection('courseDetail');
    };

    const handleClockIn = (courseId) => {
        setCourses()
    }
}

export default StudentDashboard


