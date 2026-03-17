export interface HealthcareFacility {
  id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  type: "health_center" | "hospital" | "emergency" | "clinic";
  city: string;
  province: string;
  region: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  hours?: string;
  hasEmergency: boolean;
}

export const moroccoRegions = [
  "Tanger-Tétouan-Al Hoceïma",
  "Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab"
] as const;

export type MoroccoRegion = typeof moroccoRegions[number];

export const facilities: HealthcareFacility[] = [
  // Casablanca-Settat Region
  {
    id: "chu-ibn-rochd",
    name: "CHU Ibn Rochd",
    nameFr: "Centre Hospitalier Universitaire Ibn Rochd",
    nameAr: "المركز الاستشفائي الجامعي ابن رشد",
    type: "hospital",
    city: "Casablanca",
    province: "Casablanca",
    region: "Casablanca-Settat",
    latitude: 33.5731,
    longitude: -7.5898,
    phone: "+212522222222",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "hop-cheikh-khalifa",
    name: "Cheikh Khalifa Hospital",
    nameFr: "Hôpital Cheikh Khalifa",
    nameAr: "مستشفى الشيخ خليفة",
    type: "hospital",
    city: "Casablanca",
    province: "Casablanca",
    region: "Casablanca-Settat",
    latitude: 33.5203,
    longitude: -7.6685,
    phone: "+212522977777",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-hay-mohammadi",
    name: "Hay Mohammadi Health Center",
    nameFr: "Centre de Santé Hay Mohammadi",
    nameAr: "المركز الصحي الحي المحمدي",
    type: "health_center",
    city: "Casablanca",
    province: "Casablanca",
    region: "Casablanca-Settat",
    latitude: 33.5850,
    longitude: -7.5450,
    phone: "+212522303030",
    hasEmergency: false,
    hours: "8:00-18:00"
  },
  // Rabat-Salé-Kénitra Region
  {
    id: "chu-ibn-sina",
    name: "CHU Ibn Sina",
    nameFr: "Centre Hospitalier Universitaire Ibn Sina",
    nameAr: "المركز الاستشفائي الجامعي ابن سينا",
    type: "hospital",
    city: "Rabat",
    province: "Rabat",
    region: "Rabat-Salé-Kénitra",
    latitude: 34.0209,
    longitude: -6.8416,
    phone: "+212537671616",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "hop-militaire-rabat",
    name: "Mohammed V Military Hospital",
    nameFr: "Hôpital Militaire Mohammed V",
    nameAr: "المستشفى العسكري محمد الخامس",
    type: "hospital",
    city: "Rabat",
    province: "Rabat",
    region: "Rabat-Salé-Kénitra",
    latitude: 34.0133,
    longitude: -6.8326,
    phone: "+212537716565",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-sale",
    name: "Salé Health Center",
    nameFr: "Centre de Santé de Salé",
    nameAr: "المركز الصحي سلا",
    type: "health_center",
    city: "Salé",
    province: "Salé",
    region: "Rabat-Salé-Kénitra",
    latitude: 34.0531,
    longitude: -6.7985,
    phone: "+212537782020",
    hasEmergency: false,
    hours: "8:00-17:00"
  },
  // Marrakech-Safi Region
  {
    id: "chu-marrakech",
    name: "CHU Mohammed VI Marrakech",
    nameFr: "Centre Hospitalier Universitaire Mohammed VI",
    nameAr: "المركز الاستشفائي الجامعي محمد السادس",
    type: "hospital",
    city: "Marrakech",
    province: "Marrakech",
    region: "Marrakech-Safi",
    latitude: 31.6295,
    longitude: -7.9811,
    phone: "+212524303030",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "hop-ibn-tofail",
    name: "Ibn Tofail Hospital",
    nameFr: "Hôpital Ibn Tofail",
    nameAr: "مستشفى ابن طفيل",
    type: "hospital",
    city: "Marrakech",
    province: "Marrakech",
    region: "Marrakech-Safi",
    latitude: 31.6340,
    longitude: -7.9890,
    phone: "+212524448888",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-gueliz",
    name: "Gueliz Health Center",
    nameFr: "Centre de Santé Gueliz",
    nameAr: "المركز الصحي جليز",
    type: "health_center",
    city: "Marrakech",
    province: "Marrakech",
    region: "Marrakech-Safi",
    latitude: 31.6372,
    longitude: -8.0089,
    phone: "+212524431212",
    hasEmergency: false,
    hours: "8:00-18:00"
  },
  // Fès-Meknès Region
  {
    id: "chu-hassan-ii",
    name: "CHU Hassan II Fès",
    nameFr: "Centre Hospitalier Universitaire Hassan II",
    nameAr: "المركز الاستشفائي الجامعي الحسن الثاني",
    type: "hospital",
    city: "Fès",
    province: "Fès",
    region: "Fès-Meknès",
    latitude: 34.0181,
    longitude: -5.0078,
    phone: "+212535612121",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "hop-ghassani",
    name: "Al Ghassani Hospital",
    nameFr: "Hôpital Al Ghassani",
    nameAr: "مستشفى الغساني",
    type: "hospital",
    city: "Fès",
    province: "Fès",
    region: "Fès-Meknès",
    latitude: 34.0338,
    longitude: -4.9998,
    phone: "+212535651515",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-meknes-centre",
    name: "Meknès Central Health Center",
    nameFr: "Centre de Santé Central de Meknès",
    nameAr: "المركز الصحي المركزي مكناس",
    type: "health_center",
    city: "Meknès",
    province: "Meknès",
    region: "Fès-Meknès",
    latitude: 33.8935,
    longitude: -5.5473,
    phone: "+212535522020",
    hasEmergency: false,
    hours: "8:00-17:00"
  },
  // Tanger-Tétouan-Al Hoceïma Region
  {
    id: "hop-mohammed-v-tanger",
    name: "Mohammed V Hospital Tangier",
    nameFr: "Hôpital Mohammed V Tanger",
    nameAr: "مستشفى محمد الخامس طنجة",
    type: "hospital",
    city: "Tangier",
    province: "Tanger-Assilah",
    region: "Tanger-Tétouan-Al Hoceïma",
    latitude: 35.7595,
    longitude: -5.8340,
    phone: "+212539932020",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "hop-saniat-rmel",
    name: "Saniat Rmel Hospital",
    nameFr: "Hôpital Saniat Rmel",
    nameAr: "مستشفى صنية الرمل",
    type: "hospital",
    city: "Tétouan",
    province: "Tétouan",
    region: "Tanger-Tétouan-Al Hoceïma",
    latitude: 35.5889,
    longitude: -5.3626,
    phone: "+212539961818",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-al-hoceima",
    name: "Al Hoceima Health Center",
    nameFr: "Centre de Santé Al Hoceima",
    nameAr: "المركز الصحي الحسيمة",
    type: "health_center",
    city: "Al Hoceima",
    province: "Al Hoceima",
    region: "Tanger-Tétouan-Al Hoceïma",
    latitude: 35.2517,
    longitude: -3.9372,
    phone: "+212539982020",
    hasEmergency: false,
    hours: "8:00-17:00"
  },
  // Souss-Massa Region
  {
    id: "chu-agadir",
    name: "CHU Souss Massa Agadir",
    nameFr: "Centre Hospitalier Universitaire Souss Massa",
    nameAr: "المركز الاستشفائي الجامعي سوس ماسة",
    type: "hospital",
    city: "Agadir",
    province: "Agadir-Ida-Ou-Tanane",
    region: "Souss-Massa",
    latitude: 30.4278,
    longitude: -9.5981,
    phone: "+212528822222",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "hop-hassan-ii-agadir",
    name: "Hassan II Hospital Agadir",
    nameFr: "Hôpital Hassan II Agadir",
    nameAr: "مستشفى الحسن الثاني أكادير",
    type: "hospital",
    city: "Agadir",
    province: "Agadir-Ida-Ou-Tanane",
    region: "Souss-Massa",
    latitude: 30.4167,
    longitude: -9.5833,
    phone: "+212528840000",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-tiznit",
    name: "Tiznit Health Center",
    nameFr: "Centre de Santé de Tiznit",
    nameAr: "المركز الصحي تزنيت",
    type: "health_center",
    city: "Tiznit",
    province: "Tiznit",
    region: "Souss-Massa",
    latitude: 29.6974,
    longitude: -9.7316,
    phone: "+212528862020",
    hasEmergency: false,
    hours: "8:00-17:00"
  },
  // Oriental Region
  {
    id: "hop-mohammed-vi-oujda",
    name: "CHU Mohammed VI Oujda",
    nameFr: "Centre Hospitalier Universitaire Mohammed VI Oujda",
    nameAr: "المركز الاستشفائي الجامعي محمد السادس وجدة",
    type: "hospital",
    city: "Oujda",
    province: "Oujda-Angad",
    region: "Oriental",
    latitude: 34.6867,
    longitude: -1.9114,
    phone: "+212536682222",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "hop-farabi-oujda",
    name: "Al Farabi Hospital",
    nameFr: "Hôpital Al Farabi",
    nameAr: "مستشفى الفارابي",
    type: "hospital",
    city: "Oujda",
    province: "Oujda-Angad",
    region: "Oriental",
    latitude: 34.6814,
    longitude: -1.9086,
    phone: "+212536688181",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-nador",
    name: "Nador Health Center",
    nameFr: "Centre de Santé de Nador",
    nameAr: "المركز الصحي الناظور",
    type: "health_center",
    city: "Nador",
    province: "Nador",
    region: "Oriental",
    latitude: 35.1681,
    longitude: -2.9287,
    phone: "+212536333030",
    hasEmergency: false,
    hours: "8:00-17:00"
  },
  // Drâa-Tafilalet Region
  {
    id: "hop-errachidia",
    name: "Moulay Ali Cherif Hospital",
    nameFr: "Hôpital Moulay Ali Cherif",
    nameAr: "مستشفى مولاي علي الشريف",
    type: "hospital",
    city: "Errachidia",
    province: "Errachidia",
    region: "Drâa-Tafilalet",
    latitude: 31.9314,
    longitude: -4.4267,
    phone: "+212535572020",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-ouarzazate",
    name: "Ouarzazate Health Center",
    nameFr: "Centre de Santé de Ouarzazate",
    nameAr: "المركز الصحي ورزازات",
    type: "health_center",
    city: "Ouarzazate",
    province: "Ouarzazate",
    region: "Drâa-Tafilalet",
    latitude: 30.9335,
    longitude: -6.9370,
    phone: "+212524882020",
    hasEmergency: false,
    hours: "8:00-17:00"
  },
  // Béni Mellal-Khénifra Region
  {
    id: "hop-beni-mellal",
    name: "Hassan II Provincial Hospital Béni Mellal",
    nameFr: "Hôpital Provincial Hassan II Béni Mellal",
    nameAr: "المستشفى الإقليمي الحسن الثاني بني ملال",
    type: "hospital",
    city: "Béni Mellal",
    province: "Béni Mellal",
    region: "Béni Mellal-Khénifra",
    latitude: 32.3373,
    longitude: -6.3498,
    phone: "+212523482020",
    hasEmergency: true,
    hours: "24/7"
  },
  {
    id: "cs-khenifra",
    name: "Khénifra Health Center",
    nameFr: "Centre de Santé de Khénifra",
    nameAr: "المركز الصحي خنيفرة",
    type: "health_center",
    city: "Khénifra",
    province: "Khénifra",
    region: "Béni Mellal-Khénifra",
    latitude: 32.9342,
    longitude: -5.6675,
    phone: "+212535582020",
    hasEmergency: false,
    hours: "8:00-17:00"
  },
  // Guelmim-Oued Noun Region
  {
    id: "hop-guelmim",
    name: "Guelmim Provincial Hospital",
    nameFr: "Hôpital Provincial de Guelmim",
    nameAr: "المستشفى الإقليمي كلميم",
    type: "hospital",
    city: "Guelmim",
    province: "Guelmim",
    region: "Guelmim-Oued Noun",
    latitude: 28.9870,
    longitude: -10.0574,
    phone: "+212528872020",
    hasEmergency: true,
    hours: "24/7"
  },
  // Laâyoune-Sakia El Hamra Region
  {
    id: "hop-laayoune",
    name: "Hassan Ben Mehdi Hospital",
    nameFr: "Hôpital Hassan Ben Mehdi",
    nameAr: "مستشفى حسن بن المهدي",
    type: "hospital",
    city: "Laâyoune",
    province: "Laâyoune",
    region: "Laâyoune-Sakia El Hamra",
    latitude: 27.1536,
    longitude: -13.2033,
    phone: "+212528893030",
    hasEmergency: true,
    hours: "24/7"
  },
  // Dakhla-Oued Ed-Dahab Region
  {
    id: "hop-dakhla",
    name: "Dakhla Provincial Hospital",
    nameFr: "Hôpital Provincial de Dakhla",
    nameAr: "المستشفى الإقليمي الداخلة",
    type: "hospital",
    city: "Dakhla",
    province: "Oued Ed-Dahab",
    region: "Dakhla-Oued Ed-Dahab",
    latitude: 23.6848,
    longitude: -15.9570,
    phone: "+212528931010",
    hasEmergency: true,
    hours: "24/7"
  }
];

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function findNearestFacilities(
  lat: number, 
  lon: number, 
  options?: { 
    type?: HealthcareFacility["type"];
    hasEmergency?: boolean;
    limit?: number;
  }
): (HealthcareFacility & { distance: number })[] {
  let filtered = facilities.filter(f => f.latitude && f.longitude);
  
  if (options?.type) {
    filtered = filtered.filter(f => f.type === options.type);
  }
  if (options?.hasEmergency !== undefined) {
    filtered = filtered.filter(f => f.hasEmergency === options.hasEmergency);
  }
  
  const withDistance = filtered.map(f => ({
    ...f,
    distance: calculateDistance(lat, lon, f.latitude!, f.longitude!)
  }));
  
  withDistance.sort((a, b) => a.distance - b.distance);
  
  return withDistance.slice(0, options?.limit || 5);
}

export function findFacilitiesByRegion(
  region: string,
  options?: {
    type?: HealthcareFacility["type"];
    hasEmergency?: boolean;
    limit?: number;
  }
): HealthcareFacility[] {
  let filtered = facilities.filter(f => 
    f.region.toLowerCase().includes(region.toLowerCase()) ||
    f.province.toLowerCase().includes(region.toLowerCase()) ||
    f.city.toLowerCase().includes(region.toLowerCase())
  );
  
  if (options?.type) {
    filtered = filtered.filter(f => f.type === options.type);
  }
  if (options?.hasEmergency !== undefined) {
    filtered = filtered.filter(f => f.hasEmergency === options.hasEmergency);
  }
  
  const sorted = filtered.sort((a, b) => {
    if (a.hasEmergency && !b.hasEmergency) return -1;
    if (!a.hasEmergency && b.hasEmergency) return 1;
    if (a.type === "hospital" && b.type !== "hospital") return -1;
    if (a.type !== "hospital" && b.type === "hospital") return 1;
    return 0;
  });
  
  return sorted.slice(0, options?.limit || 5);
}
