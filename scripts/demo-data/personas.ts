// Who the synthetic visitors are: name, device, where they came from, where they live.
import { pick, randInt, weighted, type Rng } from "./random";

const FIRST_NAMES = [
  "Jordan", "Priya", "Liam", "Mei", "Noah", "Aisha", "Ethan", "Sofia", "Owen", "Harpreet",
  "Lucas", "Chloe", "Mason", "Ava", "Daniel", "Grace", "Ryan", "Jasmine", "Tyler", "Emma",
  "Arjun", "Hannah", "Kai", "Olivia", "Marcus", "Leah", "Sam", "Isabel", "Nathan", "Maya",
];

const LAST_NAMES = [
  "Nguyen", "Singh", "Chen", "Thompson", "Martin", "Wong", "Brown", "Gill", "Wilson", "Lee",
  "Taylor", "Patel", "Campbell", "Anderson", "Kim", "Dhillon", "Roy", "MacDonald", "Tremblay", "Li",
];

export type Device = {
  $device_type: "Desktop" | "Mobile" | "Tablet";
  $browser: string;
  $browser_version: number;
  $os: string;
  $screen_width: number;
  $screen_height: number;
  $viewport_width: number;
  $viewport_height: number;
};

const DESKTOPS: Device[] = [
  { $device_type: "Desktop", $browser: "Chrome", $browser_version: 130, $os: "Windows", $screen_width: 1920, $screen_height: 1080, $viewport_width: 1903, $viewport_height: 937 },
  { $device_type: "Desktop", $browser: "Edge", $browser_version: 130, $os: "Windows", $screen_width: 1536, $screen_height: 864, $viewport_width: 1519, $viewport_height: 730 },
  { $device_type: "Desktop", $browser: "Chrome", $browser_version: 130, $os: "Mac OS X", $screen_width: 1512, $screen_height: 982, $viewport_width: 1512, $viewport_height: 857 },
  { $device_type: "Desktop", $browser: "Safari", $browser_version: 18, $os: "Mac OS X", $screen_width: 1440, $screen_height: 900, $viewport_width: 1440, $viewport_height: 789 },
  { $device_type: "Desktop", $browser: "Firefox", $browser_version: 131, $os: "Windows", $screen_width: 1920, $screen_height: 1080, $viewport_width: 1903, $viewport_height: 955 },
];

const MOBILES: Device[] = [
  { $device_type: "Mobile", $browser: "Mobile Safari", $browser_version: 18, $os: "iOS", $screen_width: 393, $screen_height: 852, $viewport_width: 393, $viewport_height: 659 },
  { $device_type: "Mobile", $browser: "Mobile Safari", $browser_version: 17, $os: "iOS", $screen_width: 390, $screen_height: 844, $viewport_width: 390, $viewport_height: 664 },
  { $device_type: "Mobile", $browser: "Chrome", $browser_version: 130, $os: "Android", $screen_width: 412, $screen_height: 915, $viewport_width: 412, $viewport_height: 780 },
  { $device_type: "Mobile", $browser: "Samsung Internet", $browser_version: 26, $os: "Android", $screen_width: 384, $screen_height: 832, $viewport_width: 384, $viewport_height: 700 },
];

const TABLETS: Device[] = [
  { $device_type: "Tablet", $browser: "Mobile Safari", $browser_version: 18, $os: "iOS", $screen_width: 820, $screen_height: 1180, $viewport_width: 820, $viewport_height: 1106 },
  { $device_type: "Tablet", $browser: "Chrome", $browser_version: 130, $os: "Android", $screen_width: 800, $screen_height: 1280, $viewport_width: 800, $viewport_height: 1183 },
];

export type Referrer = {
  $referrer: string;
  $referring_domain: string;
  utm?: Record<string, string>;
};

const REFERRERS: (readonly [Referrer, number])[] = [
  [{ $referrer: "https://www.google.com/", $referring_domain: "www.google.com" }, 45],
  [{ $referrer: "$direct", $referring_domain: "$direct" }, 30],
  [{ $referrer: "$direct", $referring_domain: "$direct", utm: { utm_source: "employer_email", utm_medium: "email", utm_campaign: "injury_reporting" } }, 12],
  [{ $referrer: "https://www.bing.com/", $referring_domain: "www.bing.com" }, 5],
  [{ $referrer: "https://m.facebook.com/", $referring_domain: "m.facebook.com" }, 5],
  [{ $referrer: "https://www.reddit.com/", $referring_domain: "www.reddit.com" }, 3],
];

type City = { name: string; lat: number; lng: number; weight: number };

const BC_CITIES: City[] = [
  { name: "Vancouver", lat: 49.2827, lng: -123.1207, weight: 26 },
  { name: "Surrey", lat: 49.1913, lng: -122.849, weight: 17 },
  { name: "Burnaby", lat: 49.2488, lng: -122.9805, weight: 11 },
  { name: "Richmond", lat: 49.1666, lng: -123.1336, weight: 9 },
  { name: "Victoria", lat: 48.4284, lng: -123.3656, weight: 9 },
  { name: "Kelowna", lat: 49.888, lng: -119.496, weight: 7 },
  { name: "Abbotsford", lat: 49.0504, lng: -122.3045, weight: 7 },
  { name: "Nanaimo", lat: 49.1659, lng: -123.9401, weight: 5 },
  { name: "Kamloops", lat: 50.6745, lng: -120.3273, weight: 5 },
  { name: "Prince George", lat: 53.9171, lng: -122.7497, weight: 4 },
];

export type Persona = {
  firstName: string;
  lastName: string;
  email: string;
  device: Device;
  referrer: Referrer;
  geo: Record<string, string | number | boolean>;
};

export function createPersona(rng: Rng, index: number): Persona {
  const firstName = pick(rng, FIRST_NAMES);
  const lastName = pick(rng, LAST_NAMES);
  const email = `${firstName}.${lastName}${index}@example.com`.toLowerCase();

  const deviceType = weighted(rng, [["Desktop", 58], ["Mobile", 36], ["Tablet", 6]] as const);
  const device = pick(rng, deviceType === "Desktop" ? DESKTOPS : deviceType === "Mobile" ? MOBILES : TABLETS);

  const city = weighted(rng, BC_CITIES.map((c) => [c, c.weight] as const));
  const jitter = () => (randInt(rng, -300, 300) / 10000);

  return {
    firstName,
    lastName,
    email,
    device,
    referrer: weighted(rng, REFERRERS),
    geo: {
      // Stops PostHog geolocating the sender's own IP; the values below are used instead.
      $geoip_disable: true,
      $geoip_city_name: city.name,
      $geoip_subdivision_1_name: "British Columbia",
      $geoip_subdivision_1_code: "BC",
      $geoip_country_name: "Canada",
      $geoip_country_code: "CA",
      $geoip_continent_name: "North America",
      $geoip_continent_code: "NA",
      $geoip_time_zone: "America/Vancouver",
      $geoip_latitude: Number((city.lat + jitter()).toFixed(4)),
      $geoip_longitude: Number((city.lng + jitter()).toFixed(4)),
    },
  };
}
