import React, { useState, useEffect } from 'react';
import { Camera, List, Volume2, VolumeX } from 'lucide-react';

const SmartMirror = () => {
  const [emotion, setEmotion] = useState('neutral');
  const [isMuted, setIsMuted] = useState(false);
  const [compliment, setCompliment] = useState('');
  const [fashionTip, setFashionTip] = useState('');
  const [goals, setGoals] = useState([
    { id: 1, text: 'Morning exercise', completed: false },
    { id: 2, text: 'Team meeting at 10 AM', completed: false },
    { id: 3, text: 'Complete project documentation', completed: false },
    { id: 4, text: 'Go to the gym', completed: false },
    { id: 5, text: 'Read a book', completed: false },
  ]);

  const emotionEffects = {
    happy: 'animate-pulse border-green-400 shadow-lg',
    neutral: 'border-blue-400',
    sad: 'animate-bounce border-red-500',
    angry: 'animate-shake border-red-700'
  };

  // Toggle goal completion
  const toggleGoal = (id) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  // Fetch emotion & compliment from Flask backend
  const detectEmotion = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_emotion');
      const data = await response.json();
      setEmotion(data.emotion);
      setCompliment(data.compliment);

      // Trigger TTS if unmuted
      if (!isMuted) {
        fetch(`http://127.0.0.1:5000/speak/${data.emotion}`).catch((err) =>
          console.error("TTS Error:", err)
        );
      }

      // Fetch Fashion AR Tip based on emotion
      const fashionResponse = await fetch('http://127.0.0.1:5000/fashion_overlay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emotion: data.emotion }),
      });

      const fashionData = await fashionResponse.json();
      setFashionTip(fashionData.message);
      
    } catch (error) {
      console.error('Error detecting emotion:', error);
      setCompliment("Couldn't detect emotion. Please try again.");
    }

    // Reset emotion, compliment, and fashion tip after 5 seconds
    setTimeout(() => {
      setEmotion('neutral');
      setCompliment('');
      setFashionTip('');
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Smart Mirror Header */}
      <div className="bg-gray-800 rounded-lg shadow-lg mb-6">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Smart Mirror</h1>
          <div className="flex space-x-4">
            <Camera
              className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors"
              onClick={detectEmotion}
            />
            {isMuted ? (
              <VolumeX
                className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors"
                onClick={() => setIsMuted(false)}
              />
            ) : (
              <Volume2
                className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors"
                onClick={() => setIsMuted(true)}
              />
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Camera Feed */}
          <div className="bg-gray-700 rounded-lg aspect-video flex items-center justify-center mb-6">
            <img
              src="http://127.0.0.1:5000/video_feed"
              alt="Webcam Feed"
              className="rounded-lg"
            />
          </div>

          {/* Compliment Box with Emotion Effects */}
          <div
            className={`
              bg-blue-900/30 border rounded-lg p-6 transition-all
              ${emotionEffects[emotion] || 'border-blue-800/50'}
            `}
          >
            <p className="text-white text-xl font-medium">{compliment}</p>
            {fashionTip && (
              <p className="text-green-400 text-lg mt-4">👗 {fashionTip}</p>
            )}
          </div>
        </div>
      </div>

      {/* Daily Goals Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <List className="w-6 h-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-white">Daily Goals</h2>
          </div>
        </div>

        <div className="p-6">
          <ul className="space-y-4">
            {goals.map(goal => (
              <li
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all
                  flex items-center space-x-3
                  ${goal.completed ? 'bg-green-900/20' : 'bg-gray-700/50 hover:bg-gray-700/70'}
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-colors
                    ${goal.completed ? 'border-green-500 bg-green-500' : 'border-gray-400'}
                  `}
                >
                  {goal.completed && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span className={`
                  text-lg transition-colors
                  ${goal.completed ? 'text-gray-400 line-through' : 'text-white'}
                `}>
                  {goal.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SmartMirror;

