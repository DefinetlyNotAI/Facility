import React, {useEffect, useState} from 'react';
import {FONTS} from '@/lib/data/tree98';
import {getIcon} from '@/components/tree98/icons';
import {localStorageKeys} from "@/lib/saveData";

const InfoItem = ({label, value}: { label: string; value: string | number | boolean }) => (
    <div className="flex justify-between text-xs border-b py-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-900 break-all text-right">{value?.toString()}</span>
    </div>
);

export const ControlPanel: React.FC = () => {
    const [dateTime, setDateTime] = useState('');
    const [resolution, setResolution] = useState('');
    const [userAgent, setUserAgent] = useState('');
    const [language, setLanguage] = useState('');
    const [platform, setPlatform] = useState('');
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [batteryInfo, setBatteryInfo] = useState<{ level: number; charging: boolean } | null>(null);
    const [cookieCount, setCookieCount] = useState<number>(0);
    const [refreshCount, setRefreshCount] = useState<string>('N/A');
    const [sessionId, setSessionId] = useState<string>('N/A');

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            setDateTime(now.toLocaleString());
        };
        updateDate();
        const interval = setInterval(updateDate, 1000);

        setResolution(`${window.screen.width}x${window.screen.height}`);
        setUserAgent(navigator.userAgent);
        setLanguage(navigator.language);
        setPlatform(navigator.platform);
        setCookieCount(document.cookie.split(';').filter(c => c.trim()).length);

        setRefreshCount(localStorage.getItem(localStorageKeys.refreshCount) || 'N/A');
        setSessionId(localStorage.getItem(localStorageKeys.sessionId) || 'N/A');

        window.addEventListener('online', () => setIsOnline(true));
        window.addEventListener('offline', () => setIsOnline(false));

        // Battery
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: {
                level: number;
                charging: boolean;
                addEventListener: Function
            }) => {
                const updateBattery = () => {
                    setBatteryInfo({
                        level: Math.round(battery.level * 100),
                        charging: battery.charging
                    });
                };
                updateBattery();
                battery.addEventListener('levelchange', updateBattery);
                battery.addEventListener('chargingchange', updateBattery);
            });
        }

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 bg-white min-h-screen" style={{fontFamily: FONTS.SYSTEM}}>
            <div className="text-sm font-bold mb-4">Control Panel</div>

            {/* Time & Date */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6">{getIcon('clock') ?? getIcon('settings')}</div>
                    <span className="text-xs font-semibold">Time & Date</span>
                </div>
                <InfoItem label="Current Time" value={dateTime}/>
                <InfoItem label="Language" value={language}/>
                <InfoItem label="Online" value={isOnline}/>
            </div>

            {/* System Info */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6">{getIcon('computer')}</div>
                    <span className="text-xs font-semibold">System</span>
                </div>
                <InfoItem label="Platform" value={platform}/>
                <InfoItem label="User Agent" value={userAgent}/>
                <InfoItem label="Session ID" value={sessionId}/>
                <InfoItem label="Refresh Count" value={refreshCount}/>
            </div>

            {/* Display Info */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6">{getIcon('image')}</div>
                    <span className="text-xs font-semibold">Display</span>
                </div>
                <InfoItem label="Screen Resolution" value={resolution}/>
            </div>

            {/* Battery */}
            {batteryInfo && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6">{getIcon('restart')}</div>
                        <span className="text-xs font-semibold">Battery</span>
                    </div>
                    <InfoItem label="Battery Level" value={`${batteryInfo.level}%`}/>
                    <InfoItem label="Charging" value={batteryInfo.charging}/>
                </div>
            )}
            {/* Cookies */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6">{getIcon('folder')}</div>
                    <span className="text-xs font-semibold">Browser Cookies</span>
                </div>
                <InfoItem
                    label="Storage Size"
                    value={`${document.cookie.length} bytes`}
                />
                <InfoItem label="Cookies" value={cookieCount}/>
            </div>
        </div>
    );
};
