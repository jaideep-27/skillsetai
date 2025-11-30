import React, { useState } from 'react';
import './Courses.css';

// Import course icons
import introProgrammingIcon from '../../assets/course-icons/intro-programming.svg';
import webDevIcon from '../../assets/course-icons/web-dev.svg';
import uiuxDesignIcon from '../../assets/course-icons/uiux-design.svg';
import dataScienceIcon from '../../assets/course-icons/data-science.svg';
import mobileDevIcon from '../../assets/course-icons/mobile-dev.svg';
import digitalMarketingIcon from '../../assets/course-icons/digital-marketing.svg';

const LevelIcon = ({ level }) => {
  switch (level) {
    case 'Beginner':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8z"/>
        </svg>
      );
    case 'Intermediate':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8zm0 4.2l4.5 8H7.5l4.5-8z"/>
        </svg>
      );
    case 'Advanced':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8zm0 4.2l4.5 8H7.5l4.5-8zm0 4l2.5 4h-5l2.5-4z"/>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8z"/>
          <circle cx="12" cy="14" r="3"/>
        </svg>
      );
  }
};

const courses = [
  {
    id: 1,
    title: 'Introduction to Programming',
    description: 'Learn the fundamentals of programming with Python. Perfect for beginners starting their coding journey.',
    duration: '8 weeks',
    level: 'Beginner',
    students: 156,
    rating: '4.8/5',
    price: 0,
    category: 'Programming',
    syllabus: [
      'Getting Started with Python',
      'Variables, Data Types, and Operators',
      'Control Flow and Functions',
      'Working with Collections',
      'Basic Projects'
    ],
    image: introProgrammingIcon
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, and modern frameworks. Build real-world projects and launch your web dev career.',
    duration: '12 weeks',
    level: 'Intermediate',
    students: 234,
    rating: '4.9/5',
    price: 3999,
    category: 'Web Development',
    syllabus: [
      'HTML + CSS Fundamentals',
      'JavaScript Basics to ES6',
      'Responsive Layouts',
      'React Fundamentals',
      'Mini Project'
    ],
    image: webDevIcon
  },
  {
    id: 3,
    title: 'UI/UX Design Essentials',
    description: 'Learn to create beautiful and functional user interfaces. Master design principles and industry-standard tools.',
    duration: '10 weeks',
    level: 'All Levels',
    students: 189,
    rating: '4.7/5',
    price: 4999,
    category: 'Design',
    syllabus: [
      'Design Principles',
      'Figma Basics',
      'Wireframes to Prototypes',
      'Usability Testing',
      'Portfolio Project'
    ],
    image: uiuxDesignIcon
  },
  {
    id: 4,
    title: 'Data Science Fundamentals',
    description: 'Dive into data analysis, machine learning, and statistics. Learn Python, Pandas, and NumPy.',
    duration: '14 weeks',
    level: 'Intermediate',
    students: 145,
    rating: '4.8/5',
    price: 5999,
    category: 'Data Science',
    syllabus: [
      'Python for Data Science',
      'Pandas and NumPy',
      'Exploratory Data Analysis',
      'Intro to Machine Learning',
      'Capstone Analysis'
    ],
    image: dataScienceIcon
  },
  {
    id: 5,
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps with React Native. Learn once, deploy everywhere.',
    duration: '16 weeks',
    level: 'Advanced',
    students: 167,
    rating: '4.9/5',
    price: 6999,
    category: 'Mobile Development',
    syllabus: [
      'React Native Setup',
      'Navigation and State',
      'APIs and Storage',
      'Publishing Basics',
      'Final App Project'
    ],
    image: mobileDevIcon
  },
  {
    id: 6,
    title: 'Digital Marketing',
    description: 'Master SEO, social media, and content marketing. Grow your online presence effectively.',
    duration: '8 weeks',
    level: 'Beginner',
    students: 213,
    rating: '4.6/5',
    price: 3499,
    category: 'Marketing',
    syllabus: [
      'SEO Basics',
      'Content Strategy',
      'Social Media Marketing',
      'Analytics and Optimization',
      'Campaign Project'
    ],
    image: digitalMarketingIcon
  }
];

function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [modalCourse, setModalCourse] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter courses based on search query and selected category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = !searchQuery || 
                         course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
                           course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const openCourseModal = (course) => setModalCourse(course);
  const closeCourseModal = () => setModalCourse(null);

  return (
    <div className="courses">
      <div className="courses-header">
        <h1>Available Courses</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search courses..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
          <select
            className="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All Categories">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">Web Development</option>
            <option value="Design">Design</option>
            <option value="Data Science">Data Science</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <img src={course.image} alt="" aria-hidden="true" className="course-image" />
            
            <div className="course-main-content">
              <h2 className="course-title">{course.title}</h2>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta-inline">
                <div className="meta-inline-item">
                  <svg className="duration-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M15 1H9v2h6V1zM11 12V7h2v4.586l3.707 3.707-1.414 1.414L11 12z"/>
                    <path d="M12 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8z"/>
                  </svg>
                  <span>{course.duration}</span>
                </div>
                <div className="meta-inline-item">
                  <span>{course.students} Students</span>
                </div>
                <div className="meta-inline-item">
                  <span>{course.rating} Rating</span>
                </div>
              </div>
              
              <button className="button-secondary" onClick={() => openCourseModal(course)}>
                View Details
              </button>
            </div>
            
            <div className="course-actions-inline">
              <span className={`course-price-inline ${course.price === 0 ? 'free' : ''}`}>
                {course.price === 0 ? 'Free' : `₹${Number(course.price).toLocaleString('en-IN')}`}
              </span>
              <span className={`course-level ${course.level.split(' ')[0]}`}>
                <LevelIcon level={course.level} />
                {course.level}
              </span>
              <button className="enroll-button-inline" onClick={() => startCheckout(course)}>
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalCourse && (
        <div className="course-modal-overlay" role="dialog" aria-modal="true">
          <div className="course-modal">
            <div className="modal-header">
              <h2 className="modal-title">{modalCourse.title}</h2>
              <button className="modal-close" aria-label="Close" onClick={closeCourseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-left">
                <p className="modal-description">{modalCourse.description}</p>
                {Array.isArray(modalCourse.syllabus) && (
                  <div className="modal-section modal-syllabus">
                    <h3>Syllabus Overview</h3>
                    <ul>
                      {modalCourse.syllabus.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="modal-section modal-benefits">
                  <h3>Why Enroll</h3>
                  <ul>
                    <li>Hands-on projects to build real skills</li>
                    <li>Lifetime access and future updates</li>
                    <li>Expert-curated curriculum with clear outcomes</li>
                  </ul>
                </div>
              </div>
              <div className="modal-right">
                <div className="modal-price">
                  {modalCourse.price === 0 ? 'Free' : `₹${Number(modalCourse.price).toLocaleString('en-IN')}`}
                </div>
                <div className="modal-meta">
                  <span>{modalCourse.duration}</span>
                  <span>{modalCourse.level}</span>
                </div>
                <button className="enroll-button" onClick={() => startCheckout(modalCourse)}>
                  Enroll Now
                </button>
                <button className="button-secondary" onClick={closeCourseModal}>Maybe later</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Razorpay Loader
const loadRazorpay = () => new Promise((resolve) => {
  if (document.getElementById('rzp-sdk')) return resolve(true);
  const script = document.createElement('script');
  script.id = 'rzp-sdk';
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

async function startCheckout(course) {
  if (course.price === 0) {
    alert('Enrolled for free!');
    return;
  }

  const ok = await loadRazorpay();
  if (!ok) {
    alert('Payment SDK failed to load. Please try again.');
    return;
  }

  // Try to create order via Netlify Function; fallback to simple checkout
  let order = null;
  try {
    const res = await fetch('/.netlify/functions/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(Number(course.price) * 100), currency: 'INR', courseId: course.id })
    });
    if (res.ok) order = await res.json();
  } catch (_) {}

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXXXXXX',
    amount: Math.round(Number(course.price) * 100),
    currency: 'INR',
    name: 'Skillset AI',
    description: course.title,
    order_id: order?.id,
    handler: async function (response) {
      // Verify payment signature server-side if order exists
      if (order?.id && response?.razorpay_signature) {
        try {
          const verifyRes = await fetch('/.netlify/functions/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const data = await verifyRes.json();
          if (verifyRes.ok && data?.valid) {
            alert('Payment verified! Enrollment confirmed.');
            return;
          }
        } catch (_) {}
        alert('Payment captured, but verification failed. We will review and confirm.');
      } else {
        alert('Payment successful!');
      }
    },
    prefill: { name: 'Student', email: 'student@example.com' },
    theme: { color: '#6366F1' }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

export default Courses;
