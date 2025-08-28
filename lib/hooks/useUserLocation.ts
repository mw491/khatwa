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

        // Get initial location
        const initial = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setCoords({
            latitude: initial.coords.latitude,
            longitude: initial.coords.longitude,
            accuracy: initial.coords.accuracy,
          });
        }

        // Watch position in real-time
        subscriber.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000, // every 10s
            distanceInterval: 100, // every 100m
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
