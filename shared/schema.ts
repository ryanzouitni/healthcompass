import { z } from "zod";

// Location & Access schema
export const locationAccessSchema = z.object({
  // Location preference
  locationMethod: z.enum(["gps", "manual", "prefer_not"]).optional(),
  
  // GPS coordinates (if using geolocation)
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Manual location input
  city: z.string().optional(),
  province: z.string().optional(),
  region: z.string().optional(),
  
  // Setting
  settingType: z.enum(["urban", "rural", "not_sure"]).optional(),
  
  // Travel burden
  distanceToClinic: z.enum(["less_5km", "5_20km", "20_50km", "more_50km"]).optional(),
  transportDifficulty: z.enum(["easy", "moderate", "difficult"]).optional(),
  costBarrier: z.enum(["low", "moderate", "high"]).optional(),
});

export type LocationAccess = z.infer<typeof locationAccessSchema>;

// Age group type
export type AgeGroup = "infant" | "child" | "adolescent" | "adult";

// Assessment form data schema
export const assessmentSchema = z.object({
  // Demographics - supports babies (months) and children/adults (years)
  ageUnit: z.enum(["years", "months"]),
  ageValue: z.number().min(0).max(1440), // 0-120 years (1440 months)
  gender: z.enum(["male", "female", "other"]),
  
  // Physical measurements (adjusted for all ages including babies)
  weight: z.number().min(0.5).max(300), // kg - babies can weigh from 0.5kg
  height: z.number().min(20).max(250), // cm - newborns average 50cm, premature can be less
  waistCircumference: z.number().min(20).max(200).optional(), // cm
  
  // Medical history
  familyHistoryDiabetes: z.boolean(),
  familyHistoryHeartDisease: z.boolean(),
  personalHistoryHighBloodPressure: z.boolean(),
  personalHistoryHighCholesterol: z.boolean(),
  previousGestationalDiabetes: z.boolean().optional(), // for females
  
  // Lifestyle factors (some only apply to older children/adults)
  physicalActivityLevel: z.enum(["sedentary", "light", "moderate", "active"]).optional(),
  smokingStatus: z.enum(["never", "former", "current"]).optional(), // Only for teens/adults
  dietQuality: z.enum(["poor", "fair", "good", "excellent"]).optional(),
  sleepHours: z.number().min(3).max(20).optional(), // Babies sleep more
  stressLevel: z.enum(["low", "moderate", "high", "very_high"]).optional(),
  
  // Infant/child-specific factors
  feedingType: z.enum(["breastfed", "formula", "mixed", "solid"]).optional(), // For babies
  growthConcerns: z.boolean().optional(), // Parent notices growth issues
  excessiveThirst: z.boolean().optional(), // For all ages
  frequentInfections: z.boolean().optional(), // Common in pediatric diabetes
  
  // Symptoms (all ages)
  frequentThirst: z.boolean().optional(),
  frequentUrination: z.boolean().optional(),
  unexplainedWeightChange: z.boolean().optional(),
  fatigue: z.boolean().optional(),
  blurredVision: z.boolean().optional(),
  slowHealingWounds: z.boolean().optional(),
  chestPain: z.boolean().optional(),
  shortnessOfBreath: z.boolean().optional(),
  
  // Additional symptoms (expanded list)
  numbnessTingling: z.boolean().optional(), // Numbness/tingling in hands or feet
  dizziness: z.boolean().optional(),
  frequentHunger: z.boolean().optional(), // Polyphagia
  dryMouth: z.boolean().optional(),
  itchySkin: z.boolean().optional(),
  muscleCramps: z.boolean().optional(),
  headaches: z.boolean().optional(),
  nausea: z.boolean().optional(),
  excessiveSweating: z.boolean().optional(),
  skinChanges: z.boolean().optional(), // Darkening of skin folds (acanthosis nigricans)
  irregularHeartbeat: z.boolean().optional(),
  swollenFeetAnkles: z.boolean().optional(),
  
  // Infant-specific symptoms
  irritability: z.boolean().optional(), // Baby unusually fussy
  poorFeeding: z.boolean().optional(),
  wetDiapers: z.enum(["normal", "increased", "decreased"]).optional(),
  
  // Pediatric-specific symptoms
  bedwetting: z.boolean().optional(), // For older children who were previously dry
  lethargy: z.boolean().optional(), // Unusual tiredness
  fruityBreath: z.boolean().optional(), // Sign of DKA
  vomiting: z.boolean().optional(),
  
  // Custom/unlisted symptoms
  customSymptoms: z.string().optional(), // Free-text for symptoms not listed
  
  // Location & Access (optional)
  locationAccess: locationAccessSchema.optional(),
});

export type Assessment = z.infer<typeof assessmentSchema>;

// Risk level types
export type RiskLevel = "low" | "moderate" | "high";
export type UrgencyLevel = "monitor" | "see_doctor_soon" | "urgent";

// Risk factor with explanation
export interface RiskFactor {
  id: string;
  nameKey: string; // translation key
  explanationKey: string; // translation key for why it matters
  severity: "low" | "medium" | "high";
}

// Lifestyle suggestion
export interface LifestyleSuggestion {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
}

// Warning sign
export interface WarningSign {
  id: string;
  signKey: string;
  actionKey: string;
}

// Care pathway recommendation
export interface CarePathway {
  whereToGoKey: string;
  whenToGoKey: string;
  additionalGuidanceKey?: string;
  isRural: boolean;
  hasHighAccessBarrier: boolean;
}

// Facility recommendation for results
export interface FacilityRecommendation {
  facilityId: string;
  name: string;
  type: string;
  distance?: number;
  phone?: string;
  email?: string;
  mapsUrl?: string;
}

// Complete risk assessment result
export interface RiskResult {
  diabetesRisk: RiskLevel;
  cardiovascularRisk: RiskLevel;
  overallRisk: RiskLevel;
  urgency: UrgencyLevel;
  contributingFactors: RiskFactor[];
  lifestyleSuggestions: LifestyleSuggestion[];
  warningSigns: WarningSign[];
  bmi: number;
  bmiCategory: string;
  carePathway?: CarePathway;
  recommendedFacilities?: FacilityRecommendation[];
  locationProvided: boolean;
}

// Language type
export type Language = "en" | "fr" | "ar" | "am";

// API response type
export interface AssessmentResponse {
  success: boolean;
  result: RiskResult;
}
