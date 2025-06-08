import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Fab, CircularProgress, Typography } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown, Refresh } from "@mui/icons-material";
import { MessageBox } from "react-chat-elements";
import { useThemeMode } from "../../../../../Themes/ThemeContext";
import MessageBubble from "./ImprovedMessage";
import DatabaseManipulator from "../../../../../util/io_utils/DatabaseManipulator";
import { useSelector } from "react-redux";
import { Database } from "lucide-react";
import { useNotification } from "../../../../../Providers/NotificationProvider";
import MessageMiddleware from "../../../../../util/io_utils/MessageMiddleware";

export default function MessageList({ chatRecords, setChatRecords, select }) {
  const messagesEndRef = useRef(null);
  const messagesStartRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const { mode, toggleMode } = useThemeMode();
  const refresh = useSelector((state) => state.refreshMessages.value.refresh);
  
  // State for scroll position tracking
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isNearTop, setIsNearTop] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [lastSessionMessageId, setLastSessionMessageId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  
  // 阻尼相关状态
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [startMouseY, setStartMouseY] = useState(0);
  
  const { showNotification } = useNotification();
  const limit = 15;
  const BOUNCE_THRESHOLD = 50;
  const LOAD_THRESHOLD = 30;
  const MAX_PULL_DISTANCE = 120; // 最大下拉距离
  const DAMPING_FACTOR = 0.3; // 阻尼系数 (0-1, 越小阻尼越大)
  const RELEASE_THRESHOLD = 80; // 释放触发加载的阈值
  const MOUSE_WHEEL_DAMPING = 0.5; // 鼠标滚轮阻尼系数

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 平滑滚动到指定位置
  const smoothScrollTo = (targetScrollTop, duration = 300) => {
    if (!scrollContainerRef.current) return;
    
    const startScrollTop = scrollContainerRef.current.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentScrollTop = startScrollTop + (distance * easeOutCubic);
      
      scrollContainerRef.current.scrollTop = currentScrollTop;
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateScroll);
  };

  // 处理鼠标滚轮事件（增加阻尼）
  const handleWheel = useCallback((e) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop >= scrollHeight - clientHeight - 1;

    // 在顶部向上滚动时增加阻尼
    if (atTop && e.deltaY < 0) {
      e.preventDefault();
      const dampedDelta = e.deltaY * MOUSE_WHEEL_DAMPING;
      const newPullDistance = Math.min(
        pullDistance + Math.abs(dampedDelta) * 0.5,
        MAX_PULL_DISTANCE
      );
      setPullDistance(newPullDistance);
      
      // 如果下拉距离足够，触发加载
      if (newPullDistance >= RELEASE_THRESHOLD && !isLoading) {
        handleLoadMoreMessages();
      }
      return;
    }

    // 在底部向下滚动时增加阻尼
    if (atBottom && e.deltaY > 0) {
      e.preventDefault();
      const dampedDelta = e.deltaY * MOUSE_WHEEL_DAMPING;
      container.scrollTop += dampedDelta;
      return;
    }

    // 普通滚动时应用轻微阻尼
    if (!atTop && !atBottom) {
      e.preventDefault();
      const dampedDelta = e.deltaY * (0.8 + MOUSE_WHEEL_DAMPING * 0.2);
      container.scrollTop += dampedDelta;
    }
  }, [pullDistance, isLoading]);

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e) => {
    if (isLoading) return;
    
    setIsMousePressed(true);
    setStartMouseY(e.clientY);
    setLastMouseY(e.clientY);
    setVelocity(0);
  }, [isLoading]);

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((e) => {
    if (!isMousePressed || isLoading) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const deltaY = e.clientY - lastMouseY;
    const totalDelta = e.clientY - startMouseY;
    const { scrollTop } = container;

    // 只在顶部且向下拖拽时应用阻尼
    if (scrollTop <= 0 && totalDelta > 0) {
      e.preventDefault();
      setIsDragging(true);
      
      // 应用阻尼效果
      const dampedDistance = totalDelta * DAMPING_FACTOR;
      const newPullDistance = Math.min(dampedDistance, MAX_PULL_DISTANCE);
      setPullDistance(newPullDistance);
      
      // 计算速度（用于后续的惯性滚动）
      setVelocity(deltaY);
    }

    setLastMouseY(e.clientY);
  }, [isMousePressed, lastMouseY, startMouseY, isLoading]);

  // 处理鼠标释放事件
  const handleMouseUp = useCallback(() => {
    if (!isMousePressed) return;

    setIsMousePressed(false);
    setIsDragging(false);

    // 如果下拉距离足够，触发加载
    if (pullDistance >= RELEASE_THRESHOLD && !isLoading) {
      handleLoadMoreMessages();
    } else {
      // 回弹动画
      const bounceBack = () => {
        setPullDistance(prev => {
          const newDistance = prev * 0.9;
          if (newDistance > 1) {
            requestAnimationFrame(bounceBack);
            return newDistance;
          }
          return 0;
        });
      };
      bounceBack();
    }
  }, [pullDistance, isLoading]);

  // 处理加载更多消息
  const handleLoadMoreMessages = async () => {
    if (isLoading || lastSessionMessageId <= 0) return;
    
    setIsLoading(true);
    setPullDistance(0);
    
    // 记录当前滚动高度
    if (scrollContainerRef.current) {
      setPreviousScrollHeight(scrollContainerRef.current.scrollHeight);
    }
    
    try {
      const newMessageId = lastSessionMessageId - limit;
      
      if (newMessageId === -1) {
        showNotification("No more messages to load", "info");
        setLastSessionMessageId(-1);
        return;
      }
      
      const res = await MessageMiddleware.getContactHistory(
        select.type, 
        select.userId, 
        limit, 
        lastSessionMessageId
      );
      
      if (res && res.length > 0) {
        setChatRecords(prevRecords => [...res, ...prevRecords]);
        setLastSessionMessageId(newMessageId);
      } else {
        showNotification("No more messages to load", "info");
        setLastSessionMessageId(-1);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
      showNotification("Failed to load messages", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoading || isDragging) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    
    // 重置下拉距离
    if (scrollTop > 0) {
      setPullDistance(0);
    }
    
    // Check if near top
    const nearTop = scrollTop < LOAD_THRESHOLD;
    setIsNearTop(nearTop);
    
    // Check if near bottom
    const nearBottom = scrollTop > maxScroll - 100;
    setIsNearBottom(nearBottom);
    
    // Show scroll to top button
    setShowScrollToTop(scrollTop > 300);
  }, [isLoading, isDragging]);

  // 添加事件监听器
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 鼠标事件
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isNearBottom && !isLoading) {
      scrollToBottom();
    }
  }, [chatRecords, isNearBottom, isLoading]);

  // 恢复滚动位置
  useEffect(() => {
    if (!isLoading && previousScrollHeight > 0 && scrollContainerRef.current) {
      const currentScrollHeight = scrollContainerRef.current.scrollHeight;
      const scrollDifference = currentScrollHeight - previousScrollHeight;
      
      if (scrollDifference > 0) {
        smoothScrollTo(scrollDifference + BOUNCE_THRESHOLD);
      }
      
      setPreviousScrollHeight(0);
    }
  }, [chatRecords, isLoading]);

  // 初始化
  useEffect(() => {
    if (select) {
      DatabaseManipulator.getNewestSessionMessageId(select.type, select.userId)
        .then((newestSessionMessageId) => {
          setLastSessionMessageId(newestSessionMessageId);
        })
        .catch(error => {
          console.error("Error getting newest session message ID:", error);
        });
    }
  }, [select]);

  useEffect(() => {
    if (lastSessionMessageId === 0) return;
    
    if (lastSessionMessageId === -1) {
      showNotification("No more messages to load", "info");
      return;
    }

    if (chatRecords.length === 0) {
      MessageMiddleware.getContactHistory(select.type, select.userId, limit, lastSessionMessageId)
        .then((res) => {
          setChatRecords(res || []);
        })
        .catch(error => {
          console.error("Error loading initial messages:", error);
        });
    }
  }, [lastSessionMessageId]);

  const handleDelete = (message) => {
    console.log("MessageList: handleDelete", message);
  };

  const handleWithdraw = (message) => {
    console.log("MessageList: handleWithdraw", message);
  };

  // 计算下拉指示器的透明度和旋转角度
  const pullOpacity = Math.min(pullDistance / RELEASE_THRESHOLD, 1);
  const pullRotation = (pullDistance / MAX_PULL_DISTANCE) * 360;
  const shouldTriggerLoad = pullDistance >= RELEASE_THRESHOLD;

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          cursor: isDragging ? 'grabbing' : 'auto',
          userSelect: isDragging ? 'none' : 'auto',
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: mode === 'dark' ? '#2d2d2d' : '#f1f1f1',
          },
          "&::-webkit-scrollbar-thumb": {
            background: mode === 'dark' ? '#555' : '#888',
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: mode === 'dark' ? '#777' : '#555',
          },
        }}
      >
        {/* Invisible element to scroll to top */}
        <div ref={messagesStartRef} />
        
        {/* Pull to refresh indicator */}
        {(pullDistance > 0 || isLoading) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: `${Math.max(pullDistance * 0.3, 10)}px`,
              color: shouldTriggerLoad 
                ? (mode === 'dark' ? '#4CAF50' : '#2E7D32')
                : (mode === 'dark' ? '#888' : '#666'),
              fontSize: "0.8rem",
              background: mode === 'dark' 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(0,0,0,0.05)',
              borderRadius: "12px",
              margin: "5px 0",
              opacity: pullOpacity,
              transform: `translateY(${-Math.max(0, 20 - pullDistance * 0.2)}px)`,
              transition: isLoading ? 'all 0.3s ease' : 'none',
              gap: 1
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={16} />
                Loading more messages...
              </>
            ) : (
              <>
                <Box
                  sx={{
                    transform: `rotate(${pullRotation}deg)`,
                    transition: 'transform 0.1s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Refresh size={16} />
                </Box>
                {shouldTriggerLoad 
                  ? "Release to load more" 
                  : "Pull down to load more messages"
                }
              </>
            )}
          </Box>
        )}

        {chatRecords.map((message, index) => (
          <MessageBubble
            key={`${message.id || index}-${message.timestamp}`}
            message={message}
            timestamp={message.timestamp}
            isOwn={(message.direction ? message.userId1 : message.userId2) !== select.userId}
            onDelete={handleDelete}
            onWithdraw={handleWithdraw}
            senderName={(message.direction ? message.userId1 : message.userId2)}
            darkMode={mode === 'dark'}
          />
        ))}
        
        {/* Invisible element to scroll to bottom */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Fab
          size="small"
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            opacity: 0.8,
            "&:hover": {
              opacity: 1,
            },
            backgroundColor: mode === 'dark' ? '#424242' : '#1976d2',
            color: mode === 'dark' ? '#fff' : '#fff',
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}

      {/* Scroll to Bottom Button */}
      {!isNearBottom && (
        <Fab
          size="small"
          color="secondary"
          aria-label="scroll to bottom"
          onClick={scrollToBottom}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            opacity: 0.8,
            "&:hover": {
              opacity: 1,
            },
            backgroundColor: mode === 'dark' ? '#616161' : '#dc004e',
            color: '#fff',
          }}
        >
          <KeyboardArrowUp sx={{ transform: 'rotate(180deg)' }} />
        </Fab>
      )}
    </Box>
  );
}