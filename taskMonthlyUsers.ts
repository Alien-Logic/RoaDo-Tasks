type Timestamp = string; 
type UserID = string;
type DeviceID = string;

interface UserDeviceLog {
  userId: UserID;
  deviceId: DeviceID;
  loggedIn: Timestamp;
  loggedOut: Timestamp | null;
  lastSeenAt: Timestamp;
}

interface MonthlyReport {
  month: string;
  loggedInUsers: Set<UserID>;
  activeUsers: Set<UserID>;
}

const getMonthlyReport = (logs: UserDeviceLog[]): MonthlyReport[] => {
  const monthlyReports: Map<string, MonthlyReport> = new Map();

  const getMonthKey = (year: number, month: number): string => {
    return `${year}-${month.toString().padStart(2, '0')}`;
  };

  const addReport = (month: string, loggedIn: boolean, active: boolean, userId: UserID) => {
    if (!monthlyReports.has(month)) {
      monthlyReports.set(month, {
        month,
        loggedInUsers: new Set(),
        activeUsers: new Set()
      });
    }
    const report = monthlyReports.get(month)!;
    if (loggedIn) {
      report.loggedInUsers.add(userId);
    }
    if (active) {
      report.activeUsers.add(userId);
    }
  };

  logs.forEach(log => {
    const { userId, loggedIn, loggedOut, lastSeenAt } = log;

    const loggedInDate = new Date(loggedIn);
    const loggedOutDate = loggedOut ? new Date(loggedOut) : null;
    const lastSeenDate = new Date(lastSeenAt);

    let currentDate = new Date(loggedInDate);

    while (true) {
        const year = currentDate.getUTCFullYear();
        const month = currentDate.getUTCMonth() + 1; 
      
        const currentMonthKey = getMonthKey(year, month);
      
        const isLastSeenMonth = currentMonthKey === getMonthKey(lastSeenDate.getUTCFullYear(), lastSeenDate.getUTCMonth() + 1);
        addReport(currentMonthKey, true, isLastSeenMonth, userId);
      
        console.log("Checking loop break condition. Year:", year, "Month:", month, "Logged out date:", loggedOutDate);
      
        if (loggedOutDate && year === loggedOutDate.getUTCFullYear() && month === (loggedOutDate.getUTCMonth() + 1)) {
          console.log("Break condition met. Breaking loop.");
          break;
        }
      
        if (currentDate.getTime() > Date.now()) {
          console.log("Current date exceeds current date. Breaking loop.");
          break;
        }
      
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
        currentDate.setUTCDate(1); 
      }
      
    if (loggedOutDate && loggedOutDate.getTime() < lastSeenDate.getTime()) {
      const lastSeenMonthKey = getMonthKey(lastSeenDate.getUTCFullYear(), lastSeenDate.getUTCMonth() + 1);
      addReport(lastSeenMonthKey, false, true, userId);
    }
  });

  return Array.from(monthlyReports.values());
};


const logs: UserDeviceLog[] = [
  { userId: 'user1', deviceId: 'device1', loggedIn: '2024-01-10T10:00:00Z', loggedOut: null, lastSeenAt: '2024-05-15T12:00:00Z' },
  { userId: 'user2', deviceId: 'device2', loggedIn: '2024-02-01T08:00:00Z', loggedOut: '2024-04-30T18:00:00Z', lastSeenAt: '2024-04-15T14:00:00Z' }
];

const report = getMonthlyReport(logs);
console.log(report);
