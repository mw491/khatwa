import { useQuery } from '@tanstack/react-query';

export interface Timings {
  mosque_name: string;
  prayer_times: PrayerTimes;
}

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerInfo {
  name: string;
  time: string;
  isNext: boolean;
}

export function getCurrentOrNextPrayer(prayerTimes: PrayerTimes): PrayerInfo {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  const prayers = [
    { name: 'fajr', time: prayerTimes.fajr },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'isha', time: prayerTimes.isha }
  ];

  // Convert prayer times to minutes for comparison
  const prayerMinutes = prayers.map(prayer => {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    return {
      name: prayer.name,
      time: prayer.time,
      minutes: hours * 60 + minutes
    };
  });

  // Check if we're currently in a prayer window (15 minutes before to 5 minutes after prayer time)
  const currentPrayer = prayerMinutes.find(prayer => {
    const timeDiff = currentTime - prayer.minutes;
    return timeDiff >= -15 && timeDiff <= 5; // 15 minutes before to 5 minutes after
  });

  if (currentPrayer) {
    return {
      name: currentPrayer.name,
      time: currentPrayer.time,
      isNext: false
    };
  }

  // Find the next prayer (the next upcoming prayer after current time + 5 minutes)
  const nextPrayer = prayerMinutes.find(prayer => {
    const timeDiff = prayer.minutes - currentTime;
    return timeDiff > 5; // Prayer time is more than 5 minutes in the future
  });

  // If no next prayer found today, the next prayer is Fajr tomorrow
  if (!nextPrayer) {
    return {
      name: 'fajr',
      time: prayerTimes.fajr,
      isNext: true
    };
  }

  return {
    name: nextPrayer.name,
    time: nextPrayer.time,
    isNext: true
  };
}

export function useTodayTimings() {
  const today = new Date().toISOString().split('T')[0];
  return useQuery<Timings[]>({
    queryKey: ['dailyData', today],
    queryFn: async () => {
      const res = await fetch('https://khatwa-backend.vercel.app/');
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
