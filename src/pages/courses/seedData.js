import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const mockCourses = [
  {
    title: 'Introduction to Programming',
    description: 'Learn the fundamentals of programming with Python. Perfect for beginners starting their coding journey.',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'programming',
    price: 0, // INR
    syllabus: [
      'Getting Started with Python',
      'Variables, Data Types, and Operators',
      'Control Flow and Functions',
      'Working with Collections',
      'Basic Projects'
    ],
    enrollments: 156,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, and modern frameworks. Build real-world projects and launch your web dev career.',
    duration: '12 weeks',
    level: 'Intermediate',
    category: 'programming',
    price: 3999, // INR
    syllabus: [
      'HTML + CSS Fundamentals',
      'JavaScript Basics to ES6',
      'Responsive Layouts',
      'React Fundamentals',
      'Mini Project'
    ],
    enrollments: 234,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
    createdAt: new Date().toISOString()
  },
  {
    title: 'UI/UX Design Essentials',
    description: 'Learn to create beautiful and functional user interfaces. Master design principles and industry-standard tools.',
    duration: '10 weeks',
    level: 'All Levels',
    category: 'design',
    price: 4999, // INR
    syllabus: [
      'Design Principles',
      'Figma Basics',
      'Wireframes to Prototypes',
      'Usability Testing',
      'Portfolio Project'
    ],
    enrollments: 189,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Data Science Fundamentals',
    description: 'Dive into data analysis, machine learning, and statistics. Learn Python, Pandas, and NumPy.',
    duration: '14 weeks',
    level: 'Intermediate',
    category: 'science',
    price: 5999, // INR
    syllabus: [
      'Python for Data Science',
      'Pandas and NumPy',
      'Exploratory Data Analysis',
      'Intro to Machine Learning',
      'Capstone Analysis'
    ],
    enrollments: 145,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps with React Native. Learn once, deploy everywhere.',
    duration: '16 weeks',
    level: 'Advanced',
    category: 'programming',
    price: 6999, // INR
    syllabus: [
      'React Native Setup',
      'Navigation and State',
      'APIs and Storage',
      'Publishing Basics',
      'Final App Project'
    ],
    enrollments: 167,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Digital Marketing',
    description: 'Master SEO, social media, and content marketing. Grow your online presence effectively.',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'business',
    price: 3499, // INR
    syllabus: [
      'SEO Basics',
      'Content Strategy',
      'Social Media Marketing',
      'Analytics and Optimization',
      'Campaign Project'
    ],
    enrollments: 213,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1557838923-2985c318be48',
    createdAt: new Date().toISOString()
  }
];

export const seedCourses = async () => {
  try {
    const coursesRef = collection(db, 'courses');
    
    for (const course of mockCourses) {
      await addDoc(coursesRef, course);
      console.log(`Added course: ${course.title}`);
    }
    
    console.log('Successfully seeded all courses!');
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
};

// Run this function to seed the database
seedCourses();
