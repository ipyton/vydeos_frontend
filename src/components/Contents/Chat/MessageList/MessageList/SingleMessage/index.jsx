
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, Trash2, RotateCcw, X } from 'lucide-react';

const MessageBubble = ({ 
  message, 
  isOwn = false, 
  timestamp, 
  senderName,
  darkMode = false,
  onDelete,
  onWithdraw
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [longPressTimer, setLongPressTimer] = useState(null);
  const contextMenuRef = useRef(null);
  const messageRef = useRef(null);

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // If less than 1 minute ago
    if (seconds < 60) {
      return seconds < 10 ? 'Just now' : `${seconds}s ago`;
    }
    // If less than 1 hour ago
    else if (minutes < 60) {
      return `${minutes}m ago`;
    }
    // If more than 1 hour ago, show accurate time
    else {
      // Check if it's today
      if (messageDate.toDateString() === today.toDateString()) {
        return messageDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      // Check if it's yesterday
      else if (messageDate.toDateString() === yesterday.toDateString()) {
        return `Yesterday ${messageDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      }
      // Check if it's within this week (last 7 days)
      else if (diff < 7 * 24 * 60 * 60 * 1000) {
        const dayName = messageDate.toLocaleDateString([], { weekday: 'short' });
        return `${dayName} ${messageDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`;
      }
      // Check if it's within this year
      else if (messageDate.getFullYear() === today.getFullYear()) {
        return messageDate.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      // If it's from a previous year
      else {
        return messageDate.toLocaleDateString([], { 
          year: 'numeric',
          month: 'short', 
          day: 'numeric',
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    }
  };

  const getAbsoluteTime = (timestamp) => {
    return new Date(timestamp).toLocaleString([], { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAudioPlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, you'd control actual audio playback here
  };

  // Handle right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = messageRef.current.getBoundingClientRect();
    setContextMenuPosition({
      x: e.clientX,
      y: e.clientY
    });
    setShowContextMenu(true);
  };

  // Handle long press for mobile
  const handleTouchStart = (e) => {
    const timer = setTimeout(() => {
      const touch = e.touches[0];
      setContextMenuPosition({
        x: touch.clientX,
        y: touch.clientY
      });
      setShowContextMenu(true);
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    const handleScroll = () => {
      setShowContextMenu(false);
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showContextMenu]);

  const handleDelete = () => {
    setShowContextMenu(false);
    if (onDelete) {
      onDelete(message.id);
    }
  };

  const handleWithdraw = () => {
    setShowContextMenu(false);
    if (onWithdraw) {
      onWithdraw(message.id);
    }
  };

  const renderMessageContent = () => {
    if (message.withdrawn) {
      return (
        <div className="italic opacity-60 flex items-center space-x-2">
          <RotateCcw size={16} />
          <span>This message was withdrawn</span>
        </div>
      );
    }

    switch (message.type) {
      case 'text':
        return (
          <div className="break-words">
            {message.content}
          </div>
        );

      case 'image':
        return (
          <div className="max-w-sm">
            <img 
              src={message.url} 
              alt="Shared image"
              className="rounded-lg w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.url, '_blank')}
            />
            {message.caption && (
              <div className="mt-2 text-sm opacity-90">
                {message.caption}
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="max-w-sm">
            <video 
              src={message.url}
              controls
              className="rounded-lg w-full h-auto max-h-64"
              preload="metadata"
            />
            {message.caption && (
              <div className="mt-2 text-sm opacity-90">
                {message.caption}
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center space-x-3 min-w-48">
            <button
              onClick={handleAudioPlay}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            
            <div className="flex-1">
              <div className={`h-1 rounded-full ${
                darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}>
                <div 
                  className={`h-full rounded-full transition-all ${
                    isOwn 
                      ? 'bg-white bg-opacity-70' 
                      : darkMode 
                        ? 'bg-blue-400' 
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${(audioCurrentTime / audioDuration) * 100 || 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1 opacity-70">
                <span>{formatDuration(audioCurrentTime)}</span>
                <span>{formatDuration(message.duration || 0)}</span>
              </div>
            </div>

            <Volume2 size={16} className="opacity-70" />
          </div>
        );

      default:
        return <div>Unsupported message type</div>;
    }
  };

  const bubbleBaseClasses = `
    max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl
    rounded-2xl px-4 py-2 shadow-sm
    transition-all duration-200 hover:shadow-md
    select-none cursor-context-menu
  `;

  const bubbleClasses = isOwn
    ? `${bubbleBaseClasses} bg-blue-500 text-white ml-auto`
    : darkMode
      ? `${bubbleBaseClasses} bg-gray-700 text-white`
      : `${bubbleBaseClasses} bg-white text-gray-900 border border-gray-200`;

  return (
    <div className={`mb-4 ${isOwn ? 'text-right' : 'text-left'} relative`}>
      {!isOwn && senderName && !message.withdrawn && (
        <div className={`text-xs mb-1 px-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {senderName}
        </div>
      )}
      
      <div 
        ref={messageRef}
        className={bubbleClasses}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {renderMessageContent()}
      </div>
      
      <div 
        className={`text-xs mt-1 px-2 cursor-help ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}
        title={getAbsoluteTime(timestamp)}
      >
        {formatTime(timestamp)}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className={`fixed z-50 py-2 rounded-lg shadow-lg border min-w-32 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {isOwn && !message.withdrawn && (
            <button
              onClick={handleWithdraw}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-10 hover:bg-gray-500 transition-colors flex items-center space-x-2`}
            >
              <RotateCcw size={14} />
              <span>Withdraw</span>
            </button>
          )}
          <button
            onClick={handleDelete}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-10 hover:bg-red-500 transition-colors flex items-center space-x-2 text-red-500`}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;