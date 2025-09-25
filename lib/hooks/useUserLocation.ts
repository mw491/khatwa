import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export function useLiveLocation(options?: Location.LocationOptions) {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const subscriber = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          return;
        }

        // Use last known position immediately if available for fast initial render
        const last = await Location.getLastKnownPositionAsync();
        if (isMounted && last) {
          setCoords({
            latitude: last.coords.latitude,
            longitude: last.coords.longitude,
            accuracy: last.coords.accuracy,
          });
        }

        // Fetch a fresh current position with balanced accuracy for speed
        const initial = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (isMounted) {
          setCoords({
            latitude: initial.coords.latitude,
            longitude: initial.coords.longitude,
            accuracy: initial.coords.accuracy,
          });
        }

        // Watch position in real-time (balanced to reduce delay/usage)
        subscriber.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 15000, // every 15s
            distanceInterval: 150, // every 150m
            ...options,
          },
          (loc) => {
            if (isMounted) {
              setCoords({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                accuracy: loc.coords.accuracy,
              });
            }
          }
        );
      } catch (err: any) {
        setError(err.message);
      }
    })();

    return () => {
      isMounted = false;
      if (subscriber.current) {
        subscriber.current.remove();
      }
    };
  }, []);

  return { coords, error };
}
