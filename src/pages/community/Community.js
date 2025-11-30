import React, { useState, useEffect } from 'react';
import './Community.css';

// Helper function to get upcoming event dates
const getUpcomingEvents = () => {
  const now = new Date();
  const events = [
    {
      id: 1,
      title: 'Web Development Workshop',
      description: 'Learn modern web development practices',
      time: '2:00 PM - 4:00 PM',
      daysFromNow: 3
    },
    {
      id: 2,
      title: 'AI in Practice',
      description: 'Practical applications of AI',
      time: '6:00 PM - 8:00 PM',
      daysFromNow: 7
    },
    {
      id: 3,
      title: 'System Design Masterclass',
      description: 'Building scalable systems from scratch',
      time: '3:00 PM - 5:00 PM',
      daysFromNow: 10
    },
    {
      id: 4,
      title: 'Python for Data Science',
      description: 'Data analysis and visualization with Python',
      time: '4:00 PM - 6:00 PM',
      daysFromNow: 14
    }
  ];

  return events.map(event => {
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() + event.daysFromNow);
    
    return {
      ...event,
      date: eventDate.getDate(),
      month: eventDate.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: eventDate
    };
  });
};

// Helper function to generate random but consistent member counts
const getForumStats = () => {
  const baseStats = [
    { members: 1247, baseOnline: 45 },
    { members: 856, baseOnline: 28 },
    { members: 2134, baseOnline: 112 }
  ];
  
  // Add some variation to online count based on time of day
  const hour = new Date().getHours();
  const activityMultiplier = hour >= 9 && hour <= 21 ? 1.5 : 0.7;
  
  return baseStats.map(stat => ({
    members: stat.members,
    online: Math.floor(stat.baseOnline * activityMultiplier + Math.random() * 10)
  }));
};

function Community() {
  const [events, setEvents] = useState([]);
  const [forumStats, setForumStats] = useState([]);

  useEffect(() => {
    setEvents(getUpcomingEvents());
    setForumStats(getForumStats());
  }, []);

  const forums = [
    {
      title: 'Programming Help',
      description: 'Get help with coding problems'
    },
    {
      title: 'Project Collaboration',
      description: 'Find partners for your projects'
    },
    {
      title: 'Career Advice',
      description: 'Share and get career guidance'
    }
  ];

  return (
    <div className="community">
      <div className="community-container">
        <h1>🌐 Community</h1>
        
        <div className="community-sections">
          <div className="forums-section">
            <h2>💬 Discussion Forums</h2>
            <div className="forum-topics">
              {forums.map((forum, index) => (
                <div key={index} className="topic-card">
                  <h3>{forum.title}</h3>
                  <p>{forum.description}</p>
                  <span className="topic-stats">
                    {forumStats[index]?.members?.toLocaleString() || '---'} members • {forumStats[index]?.online || '--'} online
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="events-section">
            <h2>📅 Upcoming Events</h2>
            <div className="events-list">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-date">
                    <span className="date">{event.date}</span>
                    <span className="month">{event.month}</span>
                  </div>
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <span className="event-time">🕐 {event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
