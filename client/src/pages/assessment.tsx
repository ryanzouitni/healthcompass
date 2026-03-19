import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2, MapPin, Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/language-context";
import type { Assessment, RiskResult, LocationAccess } from "@shared/schema";
import { moroccoRegions } from "@shared/facilities";

const TOTAL_STEPS = 6;

type AgeGroup = "infant" | "child" | "adolescent" | "adult";

function getAgeGroup(ageValue: number, ageUnit: "years" | "months"): AgeGroup {
  const ageInMonths = ageUnit === "months" ? ageValue : ageValue * 12;
  if (ageInMonths <= 24) return "infant";
  if (ageInMonths <= 144) return "child";
  if (ageInMonths < 216) return "adolescent";
  return "adult";
}

interface FormData {
  ageUnit: "years" | "months";
  ageValue: number;
  gender: "male" | "female" | "other";
  weight: number;
  height: number;
  waistCircumference: number;
  familyHistoryDiabetes: boolean;
  familyHistoryHeartDisease: boolean;
  personalHistoryHighBloodPressure: boolean;
  personalHistoryHighCholesterol: boolean;
  previousGestationalDiabetes: boolean;
  physicalActivityLevel: "sedentary" | "light" | "moderate" | "active";
  smokingStatus: "never" | "former" | "current";
  dietQuality: "poor" | "fair" | "good" | "excellent";
  sleepHours: number;
  stressLevel: "low" | "moderate" | "high" | "very_high";
  frequentThirst: boolean;
  frequentUrination: boolean;
  unexplainedWeightChange: boolean;
  fatigue: boolean;
  blurredVision: boolean;
  slowHealingWounds: boolean;
  chestPain: boolean;
  shortnessOfBreath: boolean;
  numbnessTingling: boolean;
  dizziness: boolean;
  frequentHunger: boolean;
  dryMouth: boolean;
  itchySkin: boolean;
  muscleCramps: boolean;
  headaches: boolean;
  nausea: boolean;
  excessiveSweating: boolean;
  skinChanges: boolean;
  irregularHeartbeat: boolean;
  swollenFeetAnkles: boolean;
  feedingType: "breastfed" | "formula" | "mixed" | "solid" | "";
  growthConcerns: boolean;
  frequentInfections: boolean;
  irritability: boolean;
  poorFeeding: boolean;
  wetDiapers: "normal" | "increased" | "decreased" | "";
  bedwetting: boolean;
  lethargy: boolean;
  fruityBreath: boolean;
  vomiting: boolean;
  customSymptoms: string;
  locationMethod: "gps" | "manual" | "prefer_not" | "";
  latitude: number | null;
  longitude: number | null;
  city: string;
  province: string;
  region: string;
  settingType: "urban" | "rural" | "not_sure" | "";
  distanceToClinic: "less_5km" | "5_20km" | "20_50km" | "more_50km" | "";
  transportDifficulty: "easy" | "moderate" | "difficult" | "";
  costBarrier: "low" | "moderate" | "high" | "";
}

const initialFormData: FormData = {
  ageUnit: "years",
  ageValue: 35,
  gender: "male",
  weight: 70,
  height: 170,
  waistCircumference: 0,
  familyHistoryDiabetes: false,
  familyHistoryHeartDisease: false,
  personalHistoryHighBloodPressure: false,
  personalHistoryHighCholesterol: false,
  previousGestationalDiabetes: false,
  physicalActivityLevel: "moderate",
  smokingStatus: "never",
  dietQuality: "fair",
  sleepHours: 7,
  stressLevel: "moderate",
  frequentThirst: false,
  frequentUrination: false,
  unexplainedWeightChange: false,
  fatigue: false,
  blurredVision: false,
  slowHealingWounds: false,
  chestPain: false,
  shortnessOfBreath: false,
  numbnessTingling: false,
  dizziness: false,
  frequentHunger: false,
  dryMouth: false,
  itchySkin: false,
  muscleCramps: false,
  headaches: false,
  nausea: false,
  excessiveSweating: false,
  skinChanges: false,
  irregularHeartbeat: false,
  swollenFeetAnkles: false,
  feedingType: "",
  growthConcerns: false,
  frequentInfections: false,
  irritability: false,
  poorFeeding: false,
  wetDiapers: "",
  bedwetting: false,
  lethargy: false,
  fruityBreath: false,
  vomiting: false,
  customSymptoms: "",
  locationMethod: "",
  latitude: null,
  longitude: null,
  city: "",
  province: "",
  region: "",
  settingType: "",
  distanceToClinic: "",
  transportDifficulty: "",
  costBarrier: "",
};

export default function AssessmentPage() {
  const { t, isRTL } = useLanguage();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geoStatus, setGeoStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");
  const [highAccuracy, setHighAccuracy] = useState(false);
  const [geoAccuracy, setGeoAccuracy] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (data: Assessment) => {
      console.log("Submitting assessment:", JSON.stringify(data, null, 2));

      const response = await fetch("/api/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const rawText = await response.text();
      console.log("Raw assess response:", rawText);

      let parsed: any = null;
      try {
        parsed = rawText ? JSON.parse(rawText) : null;
      } catch {
        parsed = null;
      }

      if (!response.ok) {
        const message =
          parsed?.error ||
          parsed?.message ||
          rawText ||
          `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      console.log("Assessment result:", parsed);
      return parsed as { success: boolean; result: RiskResult };
    },
    onSuccess: (data) => {
      setSubmitError("");
      sessionStorage.setItem("assessmentResult", JSON.stringify(data.result));
      setLocation("/results");
    },
    onError: (error: any) => {
      console.error("Assessment error:", error);
      setSubmitError(error?.message || "An error occurred. Please try again.");
    },
  });

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (submitError) setSubmitError("");
  };

  const ageGroup = getAgeGroup(formData.ageValue, formData.ageUnit);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (formData.ageUnit === "months") {
        if (formData.ageValue < 0 || formData.ageValue > 23) {
          newErrors.ageValue = t("validation.ageMonthsRange");
        }
      } else {
        if (formData.ageValue < 0 || formData.ageValue > 120) {
          newErrors.ageValue = t("validation.ageYearsRange");
        }
      }
    }

    if (step === 2) {
      const minWeight = ageGroup === "infant" ? 0.5 : ageGroup === "child" ? 5 : 30;
      const minHeight = ageGroup === "infant" ? 20 : ageGroup === "child" ? 50 : 100;

      if (!formData.weight || formData.weight < minWeight || formData.weight > 300) {
        newErrors.weight = t("validation.weightRange");
      }
      if (!formData.height || formData.height < minHeight || formData.height > 250) {
        newErrors.height = t("validation.heightRange");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < TOTAL_STEPS) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    let locationAccess: LocationAccess | undefined = undefined;

    if (formData.locationMethod && formData.locationMethod !== "prefer_not") {
      locationAccess = {
        locationMethod: formData.locationMethod as "gps" | "manual",
        latitude: formData.latitude ?? undefined,
        longitude: formData.longitude ?? undefined,
        city: formData.city || undefined,
        province: formData.province || undefined,
        region: formData.region || undefined,
        settingType: formData.settingType
          ? (formData.settingType as "urban" | "rural" | "not_sure")
          : undefined,
        distanceToClinic: formData.distanceToClinic
          ? (formData.distanceToClinic as "less_5km" | "5_20km" | "20_50km" | "more_50km")
          : undefined,
        transportDifficulty: formData.transportDifficulty
          ? (formData.transportDifficulty as "easy" | "moderate" | "difficult")
          : undefined,
        costBarrier: formData.costBarrier
          ? (formData.costBarrier as "low" | "moderate" | "high")
          : undefined,
      };
    }

    const currentAgeGroup = getAgeGroup(formData.ageValue, formData.ageUnit);

    const assessmentData: Assessment = {
      ageUnit: formData.ageUnit,
      ageValue: formData.ageValue,
      gender: formData.gender,
      weight: formData.weight,
      height: formData.height,
      waistCircumference: formData.waistCircumference > 0 ? formData.waistCircumference : undefined,
      familyHistoryDiabetes: formData.familyHistoryDiabetes,
      familyHistoryHeartDisease: formData.familyHistoryHeartDisease,
      personalHistoryHighBloodPressure: formData.personalHistoryHighBloodPressure,
      personalHistoryHighCholesterol: formData.personalHistoryHighCholesterol,
      previousGestationalDiabetes:
        formData.gender === "female" && currentAgeGroup === "adult"
          ? formData.previousGestationalDiabetes
          : undefined,
      physicalActivityLevel: currentAgeGroup !== "infant" ? formData.physicalActivityLevel : undefined,
      smokingStatus:
        currentAgeGroup === "adult" || currentAgeGroup === "adolescent"
          ? formData.smokingStatus
          : undefined,
      dietQuality: currentAgeGroup !== "infant" ? formData.dietQuality : undefined,
      sleepHours: formData.sleepHours,
      stressLevel:
        currentAgeGroup === "adult" || currentAgeGroup === "adolescent"
          ? formData.stressLevel
          : undefined,
      feedingType: currentAgeGroup === "infant" && formData.feedingType ? formData.feedingType : undefined,
      growthConcerns:
        currentAgeGroup === "infant" || currentAgeGroup === "child"
          ? formData.growthConcerns
          : undefined,
      frequentInfections: currentAgeGroup !== "adult" ? formData.frequentInfections : undefined,
      irritability: currentAgeGroup === "infant" ? formData.irritability : undefined,
      poorFeeding: currentAgeGroup === "infant" ? formData.poorFeeding : undefined,
      wetDiapers: currentAgeGroup === "infant" && formData.wetDiapers ? formData.wetDiapers : undefined,
      frequentThirst: formData.frequentThirst,
      frequentUrination: formData.frequentUrination,
      unexplainedWeightChange: formData.unexplainedWeightChange,
      fatigue: formData.fatigue,
      blurredVision:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.blurredVision
          : undefined,
      slowHealingWounds:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.slowHealingWounds
          : undefined,
      chestPain:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.chestPain
          : undefined,
      shortnessOfBreath:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.shortnessOfBreath
          : undefined,
      numbnessTingling:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.numbnessTingling
          : undefined,
      dizziness:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.dizziness
          : undefined,
      frequentHunger: formData.frequentHunger,
      dryMouth: formData.dryMouth,
      itchySkin:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.itchySkin
          : undefined,
      muscleCramps:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.muscleCramps
          : undefined,
      headaches:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.headaches
          : undefined,
      nausea: formData.nausea,
      excessiveSweating:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.excessiveSweating
          : undefined,
      skinChanges:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.skinChanges
          : undefined,
      irregularHeartbeat:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.irregularHeartbeat
          : undefined,
      swollenFeetAnkles:
        currentAgeGroup === "adolescent" || currentAgeGroup === "adult"
          ? formData.swollenFeetAnkles
          : undefined,
      bedwetting: currentAgeGroup === "child" ? formData.bedwetting : undefined,
      lethargy:
        currentAgeGroup === "infant" || currentAgeGroup === "child"
          ? formData.lethargy
          : undefined,
      fruityBreath:
        currentAgeGroup === "infant" || currentAgeGroup === "child"
          ? formData.fruityBreath
          : undefined,
      vomiting:
        currentAgeGroup === "infant" || currentAgeGroup === "child"
          ? formData.vomiting
          : undefined,
      customSymptoms: formData.customSymptoms.trim() || undefined,
      locationAccess,
    };

    mutation.mutate(assessmentData);
  };

  const requestGeolocation = (useHighAccuracy: boolean = false) => {
    setGeoStatus("detecting");
    setGeoAccuracy(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateField("latitude", position.coords.latitude);
          updateField("longitude", position.coords.longitude);
          setGeoAccuracy(position.coords.accuracy);
          setGeoStatus("success");
        },
        () => {
          setGeoStatus("error");
        },
        {
          timeout: useHighAccuracy ? 30000 : 10000,
          enableHighAccuracy: useHighAccuracy,
          maximumAge: useHighAccuracy ? 0 : 60000,
        }
      );
    } else {
      setGeoStatus("error");
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="container max-w-2xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">{t("assessment.title")}</span>
          <span className="text-muted-foreground">
            {t("assessment.progress", { current: step, total: TOTAL_STEPS })}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t(`step${step}.title`)}</CardTitle>
          <CardDescription>{t(`step${step}.desc`)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <Label>{t("field.age")}</Label>

                <RadioGroup
                  value={formData.ageUnit}
                  onValueChange={(value) => {
                    updateField("ageUnit", value as "years" | "months");
                    if (value === "months") {
                      updateField("ageValue", 0);
                    } else {
                      updateField("ageValue", 1);
                    }
                  }}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="years" id="ageYears" data-testid="radio-age-years" />
                    <Label htmlFor="ageYears" className="font-normal">
                      {t("field.age.years")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="months" id="ageMonths" data-testid="radio-age-months" />
                    <Label htmlFor="ageMonths" className="font-normal">
                      {t("field.age.months")}
                    </Label>
                  </div>
                </RadioGroup>

                {formData.ageUnit === "months" ? (
                  <Select
                    value={formData.ageValue.toString()}
                    onValueChange={(value) => updateField("ageValue", parseInt(value))}
                  >
                    <SelectTrigger data-testid="select-age-months">
                      <SelectValue placeholder={t("field.age.selectMonths")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i} {t("field.age.monthsLabel")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="ageValue"
                    type="number"
                    min={0}
                    max={120}
                    value={formData.ageValue}
                    onChange={(e) => updateField("ageValue", parseInt(e.target.value) || 0)}
                    placeholder={t("field.age.placeholder")}
                    data-testid="input-age"
                  />
                )}
                {errors.ageValue && <p className="text-sm text-destructive">{errors.ageValue}</p>}

                <p className="text-sm text-muted-foreground">{t(`field.ageGroup.${ageGroup}`)}</p>
              </div>

              <div className="space-y-3">
                <Label>{t("field.gender")}</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => updateField("gender", value as FormData["gender"])}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="male" id="male" data-testid="radio-gender-male" />
                    <Label htmlFor="male" className="font-normal">
                      {t("field.gender.male")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="female" id="female" data-testid="radio-gender-female" />
                    <Label htmlFor="female" className="font-normal">
                      {t("field.gender.female")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="other" id="other" data-testid="radio-gender-other" />
                    <Label htmlFor="other" className="font-normal">
                      {t("field.gender.other")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="weight">{t("field.weight")}</Label>
                <Input
                  id="weight"
                  type="number"
                  min={30}
                  max={300}
                  value={formData.weight}
                  onChange={(e) => updateField("weight", parseInt(e.target.value) || 0)}
                  placeholder={t("field.weight.placeholder")}
                  data-testid="input-weight"
                />
                {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">{t("field.height")}</Label>
                <Input
                  id="height"
                  type="number"
                  min={100}
                  max={250}
                  value={formData.height}
                  onChange={(e) => updateField("height", parseInt(e.target.value) || 0)}
                  placeholder={t("field.height.placeholder")}
                  data-testid="input-height"
                />
                {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist">{t("field.waist")}</Label>
                <Input
                  id="waist"
                  type="number"
                  min={0}
                  max={200}
                  value={formData.waistCircumference || ""}
                  onChange={(e) => updateField("waistCircumference", parseInt(e.target.value) || 0)}
                  placeholder={t("field.waist.placeholder")}
                  data-testid="input-waist"
                />
                <p className="text-xs text-muted-foreground">{t("field.waist.help")}</p>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="familyDiabetes"
                  checked={formData.familyHistoryDiabetes}
                  onCheckedChange={(checked) => updateField("familyHistoryDiabetes", !!checked)}
                  data-testid="checkbox-family-diabetes"
                />
                <Label htmlFor="familyDiabetes" className="font-normal leading-tight">
                  {t("field.familyDiabetes")}
                </Label>
              </div>

              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="familyHeart"
                  checked={formData.familyHistoryHeartDisease}
                  onCheckedChange={(checked) => updateField("familyHistoryHeartDisease", !!checked)}
                  data-testid="checkbox-family-heart"
                />
                <Label htmlFor="familyHeart" className="font-normal leading-tight">
                  {t("field.familyHeart")}
                </Label>
              </div>

              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="highBP"
                  checked={formData.personalHistoryHighBloodPressure}
                  onCheckedChange={(checked) => updateField("personalHistoryHighBloodPressure", !!checked)}
                  data-testid="checkbox-high-bp"
                />
                <Label htmlFor="highBP" className="font-normal leading-tight">
                  {t("field.highBP")}
                </Label>
              </div>

              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="highCholesterol"
                  checked={formData.personalHistoryHighCholesterol}
                  onCheckedChange={(checked) => updateField("personalHistoryHighCholesterol", !!checked)}
                  data-testid="checkbox-high-cholesterol"
                />
                <Label htmlFor="highCholesterol" className="font-normal leading-tight">
                  {t("field.highCholesterol")}
                </Label>
              </div>

              {formData.gender === "female" && (
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Checkbox
                    id="gestational"
                    checked={formData.previousGestationalDiabetes}
                    onCheckedChange={(checked) => updateField("previousGestationalDiabetes", !!checked)}
                    data-testid="checkbox-gestational"
                  />
                  <Label htmlFor="gestational" className="font-normal leading-tight">
                    {t("field.gestational")}
                  </Label>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <>
              <div className="space-y-3">
                <Label>{t("field.activity")}</Label>
                <RadioGroup
                  value={formData.physicalActivityLevel}
                  onValueChange={(value) =>
                    updateField("physicalActivityLevel", value as FormData["physicalActivityLevel"])
                  }
                  className="space-y-2"
                >
                  {(["sedentary", "light", "moderate", "active"] as const).map((level) => (
                    <div key={level} className="flex items-center space-x-3 rtl:space-x-reverse">
                      <RadioGroupItem
                        value={level}
                        id={`activity-${level}`}
                        data-testid={`radio-activity-${level}`}
                      />
                      <Label htmlFor={`activity-${level}`} className="font-normal">
                        {t(`field.activity.${level}`)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>{t("field.smoking")}</Label>
                <RadioGroup
                  value={formData.smokingStatus}
                  onValueChange={(value) => updateField("smokingStatus", value as FormData["smokingStatus"])}
                  className="space-y-2"
                >
                  {(["never", "former", "current"] as const).map((status) => (
                    <div key={status} className="flex items-center space-x-3 rtl:space-x-reverse">
                      <RadioGroupItem
                        value={status}
                        id={`smoking-${status}`}
                        data-testid={`radio-smoking-${status}`}
                      />
                      <Label htmlFor={`smoking-${status}`} className="font-normal">
                        {t(`field.smoking.${status}`)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>{t("field.diet")}</Label>
                <RadioGroup
                  value={formData.dietQuality}
                  onValueChange={(value) => updateField("dietQuality", value as FormData["dietQuality"])}
                  className="space-y-2"
                >
                  {(["poor", "fair", "good", "excellent"] as const).map((quality) => (
                    <div key={quality} className="flex items-center space-x-3 rtl:space-x-reverse">
                      <RadioGroupItem
                        value={quality}
                        id={`diet-${quality}`}
                        data-testid={`radio-diet-${quality}`}
                      />
                      <Label htmlFor={`diet-${quality}`} className="font-normal">
                        {t(`field.diet.${quality}`)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>{t("field.sleep")}: {formData.sleepHours} hours</Label>
                <Slider
                  value={[formData.sleepHours]}
                  onValueChange={(value) => updateField("sleepHours", value[0])}
                  min={3}
                  max={14}
                  step={1}
                  data-testid="slider-sleep"
                />
              </div>

              <div className="space-y-3">
                <Label>{t("field.stress")}</Label>
                <RadioGroup
                  value={formData.stressLevel}
                  onValueChange={(value) => updateField("stressLevel", value as FormData["stressLevel"])}
                  className="flex flex-wrap gap-4"
                >
                  {(["low", "moderate", "high", "very_high"] as const).map((level) => (
                    <div key={level} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem
                        value={level}
                        id={`stress-${level}`}
                        data-testid={`radio-stress-${level}`}
                      />
                      <Label htmlFor={`stress-${level}`} className="font-normal">
                        {t(`field.stress.${level === "very_high" ? "veryHigh" : level}`)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}

          {step === 5 && (
            <div className="space-y-6">
              {ageGroup === "infant" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{t("field.infantSymptoms.desc")}</p>

                  {[
                    { field: "irritability" as const, label: "field.irritability" },
                    { field: "poorFeeding" as const, label: "field.poorFeeding" },
                    { field: "lethargy" as const, label: "field.lethargy" },
                    { field: "vomiting" as const, label: "field.vomiting" },
                    { field: "fruityBreath" as const, label: "field.fruityBreath" },
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Checkbox
                        id={field}
                        checked={formData[field]}
                        onCheckedChange={(checked) => updateField(field, !!checked)}
                        data-testid={`checkbox-${field}`}
                      />
                      <Label htmlFor={field} className="font-normal leading-tight">
                        {t(label)}
                      </Label>
                    </div>
                  ))}

                  <div className="space-y-3">
                    <Label>{t("field.wetDiapers")}</Label>
                    <RadioGroup
                      value={formData.wetDiapers}
                      onValueChange={(value) => updateField("wetDiapers", value as FormData["wetDiapers"])}
                      className="space-y-2"
                    >
                      {(["normal", "increased", "decreased"] as const).map((option) => (
                        <div key={option} className="flex items-center space-x-3 rtl:space-x-reverse">
                          <RadioGroupItem
                            value={option}
                            id={`wetDiapers-${option}`}
                            data-testid={`radio-wet-diapers-${option}`}
                          />
                          <Label htmlFor={`wetDiapers-${option}`} className="font-normal">
                            {t(`field.wetDiapers.${option}`)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {(ageGroup === "infant" || ageGroup === "child") && (
                <div className="space-y-4">
                  {ageGroup === "child" && (
                    <p className="text-sm text-muted-foreground">{t("field.childSymptoms.desc")}</p>
                  )}

                  {[
                    { field: "growthConcerns" as const, label: "field.growthConcerns" },
                    { field: "frequentInfections" as const, label: "field.frequentInfections" },
                    ...(ageGroup === "child"
                      ? [
                          { field: "bedwetting" as const, label: "field.bedwetting" },
                          { field: "lethargy" as const, label: "field.lethargy" },
                          { field: "vomiting" as const, label: "field.vomiting" },
                          { field: "fruityBreath" as const, label: "field.fruityBreath" },
                        ]
                      : []),
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Checkbox
                        id={field}
                        checked={formData[field]}
                        onCheckedChange={(checked) => updateField(field, !!checked)}
                        data-testid={`checkbox-${field}`}
                      />
                      <Label htmlFor={field} className="font-normal leading-tight">
                        {t(label)}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("field.commonSymptoms.title")}
                </p>
                {[
                  { field: "frequentThirst" as const, label: "field.thirst" },
                  { field: "frequentUrination" as const, label: "field.urination" },
                  { field: "unexplainedWeightChange" as const, label: "field.weightChange" },
                  { field: "fatigue" as const, label: "field.fatigue" },
                  { field: "frequentHunger" as const, label: "field.frequentHunger" },
                  { field: "dryMouth" as const, label: "field.dryMouth" },
                  { field: "nausea" as const, label: "field.nausea" },
                ].map(({ field, label }) => (
                  <div key={field} className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Checkbox
                      id={field}
                      checked={formData[field]}
                      onCheckedChange={(checked) => updateField(field, !!checked)}
                      data-testid={`checkbox-${field}`}
                    />
                    <Label htmlFor={field} className="font-normal leading-tight">
                      {t(label)}
                    </Label>
                  </div>
                ))}
              </div>

              {(ageGroup === "adolescent" || ageGroup === "adult") && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("field.additionalSymptoms.title")}
                  </p>
                  {[
                    { field: "blurredVision" as const, label: "field.vision" },
                    { field: "slowHealingWounds" as const, label: "field.wounds" },
                    { field: "numbnessTingling" as const, label: "field.numbnessTingling" },
                    { field: "dizziness" as const, label: "field.dizziness" },
                    { field: "itchySkin" as const, label: "field.itchySkin" },
                    { field: "muscleCramps" as const, label: "field.muscleCramps" },
                    { field: "headaches" as const, label: "field.headaches" },
                    { field: "excessiveSweating" as const, label: "field.excessiveSweating" },
                    { field: "skinChanges" as const, label: "field.skinChanges" },
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Checkbox
                        id={field}
                        checked={formData[field]}
                        onCheckedChange={(checked) => updateField(field, !!checked)}
                        data-testid={`checkbox-${field}`}
                      />
                      <Label htmlFor={field} className="font-normal leading-tight">
                        {t(label)}
                      </Label>
                    </div>
                  ))}

                  <p className="text-sm font-medium text-muted-foreground pt-2">
                    {t("field.heartSymptoms.title")}
                  </p>
                  {[
                    { field: "chestPain" as const, label: "field.chestPain" },
                    { field: "shortnessOfBreath" as const, label: "field.breathing" },
                    { field: "irregularHeartbeat" as const, label: "field.irregularHeartbeat" },
                    { field: "swollenFeetAnkles" as const, label: "field.swollenFeetAnkles" },
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Checkbox
                        id={field}
                        checked={formData[field]}
                        onCheckedChange={(checked) => updateField(field, !!checked)}
                        data-testid={`checkbox-${field}`}
                      />
                      <Label htmlFor={field} className="font-normal leading-tight">
                        {t(label)}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 pt-4 border-t">
                <Label htmlFor="customSymptoms" className="font-medium">
                  {t("field.customSymptoms.title")}
                </Label>
                <p className="text-sm text-muted-foreground">{t("field.customSymptoms.desc")}</p>
                <Textarea
                  id="customSymptoms"
                  value={formData.customSymptoms}
                  onChange={(e) => updateField("customSymptoms", e.target.value)}
                  placeholder={t("field.customSymptoms.placeholder")}
                  className="min-h-[80px] resize-none"
                  data-testid="textarea-custom-symptoms"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>{t("location.privacy")}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label>{t("location.method")}</Label>
                <RadioGroup
                  value={formData.locationMethod}
                  onValueChange={(value) => {
                    updateField("locationMethod", value as FormData["locationMethod"]);
                    if (value === "gps") {
                      requestGeolocation(highAccuracy);
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 rtl:space-x-reverse rounded-lg border p-3 hover-elevate cursor-pointer">
                    <RadioGroupItem
                      value="gps"
                      id="location-gps"
                      data-testid="radio-location-gps"
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="location-gps" className="font-medium cursor-pointer flex items-center gap-2">
                        <Navigation className="h-4 w-4" />
                        {t("location.gps")}
                      </Label>
                      <p className="text-sm text-muted-foreground">{t("location.gps.desc")}</p>
                      {formData.locationMethod === "gps" && (
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                            <div className="flex-1">
                              <Label htmlFor="high-accuracy" className="text-sm font-normal cursor-pointer">
                                {t("location.highAccuracy")}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {t("location.highAccuracy.desc")}
                              </p>
                            </div>
                            <Switch
                              id="high-accuracy"
                              checked={highAccuracy}
                              onCheckedChange={(checked) => {
                                setHighAccuracy(checked);
                                if (geoStatus !== "detecting") {
                                  requestGeolocation(checked);
                                }
                              }}
                              data-testid="switch-high-accuracy"
                            />
                          </div>
                          {geoStatus === "detecting" && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {t("location.detecting")}
                            </div>
                          )}
                          {geoStatus === "success" && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <MapPin className="h-4 w-4" />
                                {t("location.detected")}
                              </div>
                              {geoAccuracy !== null && (
                                <p className="text-xs text-muted-foreground">
                                  {t("location.accuracy", { meters: Math.round(geoAccuracy) })}
                                </p>
                              )}
                            </div>
                          )}
                          {geoStatus === "error" && (
                            <div className="text-sm text-destructive">{t("location.error")}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse rounded-lg border p-3 hover-elevate cursor-pointer">
                    <RadioGroupItem
                      value="manual"
                      id="location-manual"
                      data-testid="radio-location-manual"
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="location-manual" className="font-medium cursor-pointer flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t("location.manual")}
                      </Label>
                      <p className="text-sm text-muted-foreground">{t("location.manual.desc")}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse rounded-lg border p-3 hover-elevate cursor-pointer">
                    <RadioGroupItem
                      value="prefer_not"
                      id="location-prefer-not"
                      data-testid="radio-location-prefer-not"
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="location-prefer-not" className="font-medium cursor-pointer">
                        {t("location.preferNot")}
                      </Label>
                      <p className="text-sm text-muted-foreground">{t("location.preferNot.desc")}</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {formData.locationMethod === "manual" && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("location.city")}</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder={t("location.city.placeholder")}
                        data-testid="input-city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">{t("location.province")}</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => updateField("province", e.target.value)}
                        placeholder={t("location.province.placeholder")}
                        data-testid="input-province"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">{t("location.region")}</Label>
                    <Select value={formData.region} onValueChange={(value) => updateField("region", value)}>
                      <SelectTrigger data-testid="select-region">
                        <SelectValue placeholder={t("location.region.placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {moroccoRegions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.locationMethod && formData.locationMethod !== "prefer_not" && (
                <div className="space-y-3">
                  <Label>{t("setting.title")}</Label>
                  <RadioGroup
                    value={formData.settingType}
                    onValueChange={(value) => updateField("settingType", value as FormData["settingType"])}
                    className="flex flex-wrap gap-4"
                  >
                    {(["urban", "rural", "not_sure"] as const).map((setting) => (
                      <div key={setting} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem
                          value={setting}
                          id={`setting-${setting}`}
                          data-testid={`radio-setting-${setting}`}
                        />
                        <Label htmlFor={`setting-${setting}`} className="font-normal">
                          {t(`setting.${setting === "not_sure" ? "notSure" : setting}`)}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {formData.locationMethod && formData.locationMethod !== "prefer_not" && (
                <div className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-medium">{t("access.title")}</h4>

                  <div className="space-y-3">
                    <Label>{t("access.distance")}</Label>
                    <RadioGroup
                      value={formData.distanceToClinic}
                      onValueChange={(value) =>
                        updateField("distanceToClinic", value as FormData["distanceToClinic"])
                      }
                      className="grid gap-2 sm:grid-cols-2"
                    >
                      {([
                        { value: "less_5km", key: "less5" },
                        { value: "5_20km", key: "5to20" },
                        { value: "20_50km", key: "20to50" },
                        { value: "more_50km", key: "more50" },
                      ] as const).map(({ value, key }) => (
                        <div key={value} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem
                            value={value}
                            id={`distance-${value}`}
                            data-testid={`radio-distance-${value}`}
                          />
                          <Label htmlFor={`distance-${value}`} className="font-normal">
                            {t(`access.distance.${key}`)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>{t("access.transport")}</Label>
                    <RadioGroup
                      value={formData.transportDifficulty}
                      onValueChange={(value) =>
                        updateField("transportDifficulty", value as FormData["transportDifficulty"])
                      }
                      className="flex flex-wrap gap-4"
                    >
                      {(["easy", "moderate", "difficult"] as const).map((level) => (
                        <div key={level} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem
                            value={level}
                            id={`transport-${level}`}
                            data-testid={`radio-transport-${level}`}
                          />
                          <Label htmlFor={`transport-${level}`} className="font-normal">
                            {t(`access.transport.${level}`)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>{t("access.cost")}</Label>
                    <RadioGroup
                      value={formData.costBarrier}
                      onValueChange={(value) => updateField("costBarrier", value as FormData["costBarrier"])}
                      className="space-y-2"
                    >
                      {(["low", "moderate", "high"] as const).map((level) => (
                        <div key={level} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem
                            value={level}
                            id={`cost-${level}`}
                            data-testid={`radio-cost-${level}`}
                          />
                          <Label htmlFor={`cost-${level}`} className="font-normal">
                            {t(`access.cost.${level}`)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          {t("assessment.back")}
        </Button>

        <Button
          onClick={handleNext}
          disabled={mutation.isPending}
          className="gap-2"
          data-testid="button-next"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : step === TOTAL_STEPS ? (
            t("assessment.submit")
          ) : (
            <>
              {t("assessment.next")}
              <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </>
          )}
        </Button>
      </div>

      {(mutation.isError || submitError) && (
        <div className="mt-4 rounded-lg bg-destructive/10 p-4 text-center text-destructive">
          {submitError || "An error occurred. Please try again."}
        </div>
      )}
    </div>
  );
}
