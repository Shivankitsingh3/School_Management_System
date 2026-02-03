import { useState, useEffect, useRef } from "react";
import {
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
  getNotificationsAPI,
} from "../api/notifications.api";


const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsAPI();
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await markNotificationReadAPI(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsReadAPI();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-indigo-800 rounded-full transition-colors focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full border-2 border-indigo-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">

          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">
              Notifications
            </span>

            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 font-bold uppercase hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-400 text-sm">No new updates</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-b last:border-0 cursor-pointer transition-colors ${
                    !n.is_read
                      ? "bg-indigo-50/40 hover:bg-indigo-50/70"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <p
                      className={`text-sm text-gray-900 leading-snug ${!n.is_read ? "font-bold" : "font-normal"}`}
                    >
                      {n.title}
                    </p>
                    {!n.is_read && (
                      <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1.5 shadow-[0_0_5px_rgba(79,70,229,0.5)]"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {new Date(n.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="bg-gray-50 p-2 text-center border-t">
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition">
              View All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
