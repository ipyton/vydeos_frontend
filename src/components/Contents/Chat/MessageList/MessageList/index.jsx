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
  //const refresh = useSelector((state) => state.refreshMessages.value.refresh);
  const loadingTriggeredRef = useRef(false);

  // State for scroll position tracking
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isNearTop, setIsNearTop] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [lastSessionMessageId, setLastSessionMessageId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true); // New state to track if more messages are available

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

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e) => {
    if (isLoading) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop } = container;
    const atTop = scrollTop <= 0;

    // Only prevent mouse down if at top and no more messages
    if (atTop && !hasMoreMessages) return;

    setIsMousePressed(true);
    setStartMouseY(e.clientY);
    setLastMouseY(e.clientY);
    setVelocity(0);
  }, [isLoading, hasMoreMessages]);

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((e) => {
    if (!isMousePressed || isLoading) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const deltaY = e.clientY - lastMouseY;
    const totalDelta = e.clientY - startMouseY;
    const { scrollTop } = container;

    // 只在顶部且向下拖拽时应用阻尼 (only if has more messages)
    if (scrollTop <= 0 && totalDelta > 0 && hasMoreMessages) {
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
  }, [isMousePressed, lastMouseY, startMouseY, isLoading, hasMoreMessages]);

  // 处理鼠标释放事件
  const handleMouseUp = useCallback(() => {
    if (!isMousePressed) return;

    setIsMousePressed(false);
    setIsDragging(false);

    // Only trigger if not already loading and not already triggered
    if (pullDistance >= RELEASE_THRESHOLD && !isLoading && !loadingTriggeredRef.current && hasMoreMessages) {
      handleLoadMoreMessages();
    } else {
      // Bounce back animation
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
  }, [pullDistance, isLoading, hasMoreMessages]);

  // 处理加载更多消息
  const handleLoadMoreMessages = async () => {
    // Prevent multiple simultaneous calls
    if (isLoading || lastSessionMessageId <= 0 || !hasMoreMessages || loadingTriggeredRef.current) {
      return;
    }

    // Set flag immediately to prevent race conditions
    loadingTriggeredRef.current = true;
    setIsLoading(true);
    setPullDistance(0);

    // Record current scroll height
    if (scrollContainerRef.current) {
      setPreviousScrollHeight(scrollContainerRef.current.scrollHeight);
    }

    try {
      const newMessageId = lastSessionMessageId - limit;

      if (newMessageId === -1) {
        setHasMoreMessages(false);
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

        if (res.length < limit) {
          setHasMoreMessages(false);
        }
      } else {
        setHasMoreMessages(false);
        setLastSessionMessageId(-1);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
      showNotification("Failed to load messages", "error");
      setHasMoreMessages(false);
    } finally {
      setIsLoading(false);
      // Reset the flag after a small delay to ensure state updates are processed
      setTimeout(() => {
        loadingTriggeredRef.current = false;
      }, 100);
    }
  };
  const wheelTimeoutRef = useRef(null);
  const handleWheel = useCallback((e) => {
    if (isLoading || loadingTriggeredRef.current) {
      e.preventDefault();
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const atTop = scrollTop <= 0;

    // At top scrolling up with more messages
    if (atTop && e.deltaY < 0 && hasMoreMessages) {
      e.preventDefault();
      const dampedDelta = e.deltaY * MOUSE_WHEEL_DAMPING;
      const newPullDistance = Math.min(
        pullDistance + Math.abs(dampedDelta) * 0.5,
        MAX_PULL_DISTANCE
      );
      setPullDistance(newPullDistance);

      // Debounce the loading trigger
      if (newPullDistance >= RELEASE_THRESHOLD && !isLoading && !loadingTriggeredRef.current) {
        if (wheelTimeoutRef.current) {
          clearTimeout(wheelTimeoutRef.current);
        }

        wheelTimeoutRef.current = setTimeout(() => {
          if (!isLoading && !loadingTriggeredRef.current) {
            handleLoadMoreMessages();
          }
        }, 50); // 50ms debounce
      }
      return;
    }

    // ... rest of wheel handling code remains the same
  }, [pullDistance, isLoading, hasMoreMessages]);

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

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Clean up timeouts
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

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

  // 初始化 - Reset hasMoreMessages when select changes
  useEffect(() => {
    if (select) {
      setHasMoreMessages(true);
      setPullDistance(0);
      loadingTriggeredRef.current = false; // Reset loading flag

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
      setHasMoreMessages(false);
      return;
    }

    if (chatRecords.length === 0) {
      MessageMiddleware.getContactHistory(select.type, select.userId, limit, lastSessionMessageId)
        .then((res) => {
          if (res && res.length > 0) {
            setChatRecords(res);
            // If initial load returns fewer than limit, no more messages
            if (res.length < limit) {
              setHasMoreMessages(false);
            }
          } else {
            setChatRecords([]);
            setHasMoreMessages(false);
          }
        })
        .catch(error => {
          console.error("Error loading initial messages:", error);
          setHasMoreMessages(false);
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

        {/* Pull to refresh indicator - only show if has more messages */}
        {(pullDistance > 0 || isLoading) && hasMoreMessages && (
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

        {/* Show "No more messages" indicator when at the top and no more messages */}
        {!hasMoreMessages && chatRecords.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              color: mode === 'dark' ? '#666' : '#999',
              fontSize: "0.75rem",
              fontStyle: "italic"
            }}
          >
            No more messages to load
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

      {/* Scroll to Top Button - Centered */}
      {showScrollToTop && (
        <Fab
          size="small"
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          sx={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.8,
            zIndex: 1000,
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

      {/* Scroll to Bottom Button - Centered */}
      {!isNearBottom && (
        <Fab
          size="small"
          color="secondary"
          aria-label="scroll to bottom"
          onClick={scrollToBottom}
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.8,
            zIndex: 1000,
            "&:hover": {
              opacity: 1,
            },
            backgroundColor: mode === 'dark' ? '#616161' : '#dc004e',
            color: '#fff',
          }}
        >
          <KeyboardArrowDown />
        </Fab>
      )}
    </Box>
  );
}