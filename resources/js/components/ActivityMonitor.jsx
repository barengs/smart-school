import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lockScreen, logout, refreshToken } from '../store/authSlice';

export const ActivityMonitor = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, isLocked, token } = useSelector(state => state.auth);

    // Timers
    const lastActivity = useRef(Date.now());
    const lastRefresh = useRef(Date.now());

    // Constants (in milliseconds)
    const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
    const LOCK_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const LOGOUT_TIMEOUT = 50 * 60 * 1000; // 50 minutes

    // For testing:
    // const REFRESH_INTERVAL = 15 * 1000;
    // const LOCK_TIMEOUT = 30 * 1000;
    // const LOGOUT_TIMEOUT = 50 * 1000;

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleActivity = () => {
            lastActivity.current = Date.now();
        };

        // Throttle activity updates to once per second
        let throttleTimer;
        const throttledHandleActivity = () => {
            if (throttleTimer) return;
            throttleTimer = setTimeout(() => {
                handleActivity();
                throttleTimer = null;
            }, 1000);
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, throttledHandleActivity);
        });

        const checkInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceLastActivity = now - lastActivity.current;
            const timeSinceLastRefresh = now - lastRefresh.current;

            // 1. Check for Auto Logout
            if (timeSinceLastActivity >= LOGOUT_TIMEOUT) {
                dispatch(logout());
                return;
            }

            // 2. Check for Lock Screen
            if (timeSinceLastActivity >= LOCK_TIMEOUT && !isLocked) {
                dispatch(lockScreen());
                return;
            }

            // 3. Check for Refresh Token (Only if active and not locked)
            // Wait, if locked, do we refresh? No, if locked they are inactive anyway.
            if (!isLocked && timeSinceLastRefresh >= REFRESH_INTERVAL && timeSinceLastActivity < LOCK_TIMEOUT) {
                // If token exists, refresh it
                if (token) {
                    dispatch(refreshToken());
                    lastRefresh.current = now;
                }
            }
        }, 10000); // Check every 10 seconds

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, throttledHandleActivity);
            });
            clearInterval(checkInterval);
            if (throttleTimer) clearTimeout(throttleTimer);
        };
    }, [isAuthenticated, isLocked, token, dispatch]);

    return null; // This is a logic-only component
};
