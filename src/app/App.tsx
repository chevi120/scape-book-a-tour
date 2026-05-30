import { useState, useEffect } from "react";
import { useForm } from "react-hook-form@7.55.0";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Calendar } from "./components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Checkbox } from "./components/ui/checkbox";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import { PhoneInput, validatePhoneNumber } from "./components/phone-input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { PropertyDetails } from "./components/property-details";
import { ScapeCheckbox } from "./components/scape-checkbox";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
import { CalendarIcon, MapPin, User, GraduationCap, CheckCircle2, Building2, ArrowRight, ArrowLeft, Users, X, Plus, Trash2, Home, ExternalLink } from "lucide-react";
import scapeLogo from "figma:asset/1cbf6c9ab8d61a3ed23f3f2a5748702a82128818.png";

type FormData = {
  // Tour Details
  city: string;
  property: string;
  tourType: string;
  roomType: string;
  tourDate?: Date;
  timeSlot: string;
  moveInDate: string;
  
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // How did you hear
  hearAboutUs: string;
  
  // Additional
  agreeToTerms: boolean;
  marketingConsent: boolean;
};

const cities = [
  { value: "melbourne", label: "Melbourne" },
  { value: "sydney", label: "Sydney" },
  { value: "brisbane", label: "Brisbane" },
  { value: "adelaide", label: "Adelaide" },
];

const propertiesByCity: Record<string, string[]> = {
  melbourne: [
    "Scape Lincoln College",
    "Scape Peel",
    "Scape Queensberry",
    "Scape La Trobe",
    "Scape Swanston",
    "Scape Melbourne Central",
    "Scape Victoria Street",
    "Scape Franklin",
    "Scape Berkeley 2",
    "Scape Carlton",
    "Scape Aurora",
    "Scape Berkeley 1",
    "Scape Leicester",
  ],
  sydney: [
    "Scape Darling House",
    "Scape Darling Square",
    "Scape at University of Sydney",
    "Boundary X Scape",
    "Scape Redfern",
    "Scape Ascot",
    "Scape Quay",
    "Broadway X Scape",
    "Scape Sydney Central",
    "Scape Abercrombie",
    "Scape Darlington",
    "Scape Glebe",
    "Scape Cleveland",
    "Scape Kingsford",
    "Mountain X Scape",
    "Scape Kensington",
  ],
  brisbane: [
    "Scape Tribune",
    "Scape South Bank",
    "Scape St Lucia",
    "Scape Merivale",
    "Scape Toowong",
    "Scape Regent",
  ],
  adelaide: [
    "Scape Adelaide Central",
    "Scape Waymouth",
    "Scape at University of Adelaide",
  ],
};

const universities = [
  "University of Melbourne",
  "RMIT University",
  "Monash University",
  "La Trobe University",
  "University of Sydney",
  "UNSW Sydney",
  "UTS - University of Technology Sydney",
  "QUT - Queensland University of Technology",
  "University of Queensland",
  "University of Adelaide",
  "Deakin University",
  "Macquarie University",
  "Other",
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

// Property-specific tour availability
type PropertyAvailability = {
  dateRange: {
    start: Date;
    end: Date;
  };
  timeSlots: string[];
};

const propertyAvailability: Record<string, PropertyAvailability> = {
  "Scape Melbourne Central": {
    dateRange: {
      start: new Date(2025, 11, 1), // December 1, 2025 (month is 0-indexed)
      end: new Date(2025, 11, 5),   // December 5, 2025
    },
    timeSlots: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
  },
  "Scape Carlton": {
    dateRange: {
      start: new Date(2024, 10, 24), // November 24, 2024
      end: new Date(2024, 10, 28),   // November 28, 2024
    },
    timeSlots: timeSlots, // All time slots available
  },
};

const roomTypesByProperty: Record<string, string[]> = {
  // Melbourne properties
  "Scape Lincoln College": ["Studio", "Premium Studio", "Ensuite"],
  "Scape Peel": ["Studio Plus", "Twin Share", "Ensuite"],
  "Scape Queensberry": ["Studio", "Premium Studio", "Twin Apartment"],
  "Scape La Trobe": ["Studio", "Twin Apartment", "Ensuite"],
  "Scape Swanston": [
    "Ultra Studio Apartment",
    "Ultra Twin Apartment",
    "Ultra Studio Suite",
    "Signature Studio Apartment",
    "Signature Plus Studio Apartment",
    "Signature Studio Suite",
    "Signature Plus Studio Suite"
  ],
  "Scape Melbourne Central": [
    "Shared Apartment",
    "Twin Apartment",
    "Signature Plus Studio Apartment"
  ],
  "Scape Victoria Street": ["Studio", "Premium Studio", "Twin Apartment"],
  "Scape Franklin": [
    "2 Bed Apartment",
    "6 Bed Apartment",
    "Ultra Studio Apartment",
    "Ultra Studio Suite",
    "Signature Studio Apartment",
    "Signature Studio Suite",
    "Signature Plus Studio Suite"
  ],
  "Scape Berkeley 2": ["Studio Plus", "Twin Share", "Ensuite"],
  "Scape Carlton": ["Studio Plus", "Twin Share", "Ensuite"],
  "Scape Aurora": ["Ultra Studio", "Studio", "Twin Apartment"],
  "Scape Berkeley 1": ["Studio", "Premium Studio", "Ensuite"],
  "Scape Leicester": ["Studio Plus", "Twin Share", "Twin Apartment"],

  // Sydney properties
  "Scape Darling House": [
    "Ultra King Single Ensuite",
    "Signature King Single Ensuite",
    "Twin Apartment"
  ],
  "Scape Darling Square": ["Ultra Studio", "Studio", "Twin Apartment"],
  "Scape at University of Sydney": ["Studio", "Premium Studio", "Ensuite"],
  "Boundary X Scape": ["Studio Plus", "Twin Share", "Twin Apartment"],
  "Scape Redfern": [
    "Ultra Studio Apartment",
    "5 Bed Apartment",
    "Signature Plus Studio Apartment",
    "Signature Plus Twin Apartment"
  ],
  "Scape Ascot": ["Studio", "Premium Studio", "Ensuite"],
  "Scape Quay": [
    "4 Bed Apartment",
    "6 Bed Apartment"
  ],
  "Broadway X Scape": ["Studio Plus", "Twin Share", "Twin Apartment"],
  "Scape Sydney Central": ["Ultra Studio", "Studio", "Twin Apartment"],
  "Scape Abercrombie": [
    "2 Bed Share Apartment",
    "Signature Studio Apartment",
    "Signature Plus Studio Apartment",
    "Ultra Studio Apartment"
  ],
  "Scape Darlington": ["Studio Plus", "Twin Share", "Twin Apartment"],
  "Scape Glebe": ["Studio", "Premium Studio", "Ensuite"],
  "Scape Cleveland": ["Premium Studio", "Studio", "Twin Apartment"],
  "Scape Kingsford": ["Ultra Studio", "Studio", "Twin Apartment"],
  "Mountain X Scape": ["Studio Plus", "Twin Share", "Twin Apartment"],
  "Scape Kensington": ["Studio", "Premium Studio", "Ensuite"],

  // Brisbane properties
  "Scape Tribune": ["Studio", "Premium Studio", "Twin Apartment"],
  "Scape South Bank": [
    "Ultra Studio Apartment",
    "Ultra Twin Apartment",
    "Signature Studio Apartment",
    "Signature Plus Studio Apartment",
    "5 Bed Apartment"
  ],
  "Scape St Lucia": ["Studio Plus", "Twin Share", "Ensuite"],
  "Scape Merivale": ["Studio", "Premium Studio", "Twin Apartment"],
  "Scape Toowong": [
    "Ultra Studio Apartment",
    "Signature Studio Double Bed Apartment",
    "Ultra Twin Apartment",
    "Shared Apartment",
    "2 Bed Apartment"
  ],
  "Scape Regent": ["Studio Plus", "Twin Share", "Twin Apartment"],

  // Adelaide properties
  "Scape Adelaide Central": [
    "Ultra Studio Apartment",
    "Ultra Twin Apartment",
    "Shared Apartment",
    "Twin Apartment",
    "Twin in 5 Bed Apartment"
  ],
  "Scape Waymouth": [
    "Ultra Studio Apartment",
    "Ultra Shared Apartment",
    "Ultra Twin Apartment",
    "Shared Apartment",
    "Signature Studio Apartment",
    "Signature Plus Studio Apartment",
    "Signature Plus Twin Apartment",
    "Twin Bunk Apartment"
  ],
  "Scape at University of Adelaide": ["Ultra Studio", "Studio", "Ensuite"],
};

type PropertySelection = {
  id: string;
  city: string;
  property: string;
  roomTypes: string[];
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tourDate, setTourDate] = useState<Date | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [viewingProperty, setViewingProperty] = useState<string | null>(null);
  const [viewingRoomType, setViewingRoomType] = useState<string | null>(null);
  
  // Virtual tour multi-selection state
  const [virtualSelections, setVirtualSelections] = useState<PropertySelection[]>([]);
  const [virtualCity, setVirtualCity] = useState("");
  const [virtualProperty, setVirtualProperty] = useState("");
  const [virtualRoomTypes, setVirtualRoomTypes] = useState<string[]>([]);
  const [virtualMoveInDate, setVirtualMoveInDate] = useState<Date | undefined>(undefined);
  
  // Phone validation state
  const [phoneCountryCode, setPhoneCountryCode] = useState("AU");
  const [phoneError, setPhoneError] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      tourType: "in-person",
      numberOfPeople: "1",
      agreeToTerms: false,
      marketingConsent: false,
      phone: "",
    },
  });

  const tourType = watch("tourType");
  const selectedCity = watch("city");
  const selectedProperty = watch("property");
  const timeSlot = watch("timeSlot");
  const roomType = watch("roomType");
  const hearAboutUs = watch("hearAboutUs");
  const agreeToTerms = watch("agreeToTerms");
  const marketingConsent = watch("marketingConsent");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const phone = watch("phone");
  
  const availableProperties = selectedCity ? propertiesByCity[selectedCity] || [] : [];

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  // Register phone field programmatically with country-based validation
  useEffect(() => {
    register("phone", { 
      required: "Phone number is required",
      validate: (value) => {
        if (!value) return "Phone number is required";
        
        // Extract just the phone number part (remove country code)
        const phoneNumber = value.split(" ").slice(1).join(" ");
        const validation = validatePhoneNumber(phoneNumber, phoneCountryCode);
        
        if (!validation.isValid) {
          setPhoneError(validation.error || "Invalid phone number");
          return validation.error || "Invalid phone number";
        }
        
        setPhoneError("");
        return true;
      }
    });
  }, [register, phoneCountryCode]);

  const addPropertySelection = () => {
    if (!virtualCity || !virtualProperty || virtualRoomTypes.length === 0) {
      toast.error("Please select city, property, and at least one room type");
      return;
    }

    if (virtualSelections.length >= 5) {
      toast.error("Maximum of 5 properties can be selected");
      return;
    }

    const newSelection: PropertySelection = {
      id: `${Date.now()}-${Math.random()}`,
      city: virtualCity,
      property: virtualProperty,
      roomTypes: [...virtualRoomTypes],
    };

    setVirtualSelections([...virtualSelections, newSelection]);
    setVirtualProperty("");
    setVirtualRoomTypes([]);
    toast.success("Property and rooms added to your tour");
  };
  
  const removePropertySelection = (id: string) => {
    setVirtualSelections(virtualSelections.filter(s => s.id !== id));
    toast.success("Property removed from tour");
  };
  
  const removeRoomFromSelection = (selectionId: string, roomType: string) => {
    setVirtualSelections(virtualSelections.map(selection => {
      if (selection.id === selectionId) {
        const updatedRooms = selection.roomTypes.filter(r => r !== roomType);
        if (updatedRooms.length === 0) {
          return null;
        }
        return { ...selection, roomTypes: updatedRooms };
      }
      return selection;
    }).filter(Boolean) as PropertySelection[]);
    toast.success("Room removed");
  };
  
  const clearAllSelections = () => {
    setVirtualSelections([]);
    setVirtualCity("");
    setVirtualProperty("");
    setVirtualRoomTypes([]);
    toast.success("All selections cleared");
  };
  
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ["firstName", "lastName", "email", "phone"];
        break;
      case 2:
        if (tourType === "in-person") {
          // Check if date is selected for in-person tours
          if (!tourDate) {
            toast.error("Please select a tour date");
            return false;
          }
          // TimeSlot is only required for cities other than Sydney, Brisbane, Adelaide
          const requiresTimeSlot = selectedCity && !["sydney", "brisbane", "adelaide"].includes(selectedCity);
          fieldsToValidate = requiresTimeSlot 
            ? ["city", "property", "tourType", "roomType", "timeSlot", "hearAboutUs", "agreeToTerms"]
            : ["city", "property", "tourType", "roomType", "hearAboutUs", "agreeToTerms"];
        } else {
          // Virtual tour validation
          if (virtualSelections.length === 0) {
            toast.error("Please add at least one property with room types to your tour");
            return false;
          }
          if (!virtualMoveInDate) {
            toast.error("Please select your preferred move-in date");
            return false;
          }
          fieldsToValidate = ["tourType", "moveInDate", "hearAboutUs", "agreeToTerms"];
        }
        break;
    }
    
    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Property URL mapping
  const propertyUrls: Record<string, string> = {
    "Scape Melbourne Central": "https://www.scape.com.au/melbourne/scape-melbourne-central/",
    "Scape Swanston": "https://www.scape.com.au/melbourne/scape-swanston/",
    "Scape Carlton": "https://www.scape.com.au/melbourne/scape-carlton/",
    "Scape Queensberry": "https://www.scape.com.au/melbourne/scape-queensberry/",
    "Scape Sydney Central": "https://www.scape.com.au/sydney/scape-sydney-central/",
    "Scape Redfern": "https://www.scape.com.au/sydney/scape-redfern/",
    "Scape Cleveland": "https://www.scape.com.au/sydney/scape-cleveland/",
    "Scape Brisbane Adelaide": "https://www.scape.com.au/brisbane/scape-brisbane-adelaide/",
    "Scape South Bank": "https://www.scape.com.au/brisbane/scape-south-bank/",
    "Scape Adelaide Central": "https://www.scape.com.au/adelaide/scape-adelaide-central/",
  };

  // Generate property URL from property name
  const getPropertyUrl = (propertyName: string | undefined): string => {
    if (!propertyName) return '#';
    return propertyUrls[propertyName] || '#';
  };

  // Show confirmation dialog before final submission
  const onSubmit = (data: FormData) => {
    // For in-person tours, submit directly without confirmation dialog
    if (tourType === "in-person") {
      const submissionData = {
        ...data,
        tourDate,
      };
      console.log("Form submitted:", submissionData);
      toast.success("Tour booking submitted successfully!");
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        reset();
        setTourDate(undefined);
        setCurrentStep(1);
      }, 4000);
    } else {
      // For virtual tours, validate that at least one property has been selected
      if (virtualSelections.length === 0) {
        toast.error("No has seleccionado ningún room. Debes seleccionar al menos un room para poder continuar con el Book a Tour");
        return;
      }
      // Show confirmation dialog
      setPendingFormData(data);
      setShowConfirmDialog(true);
    }
  };

  // Final submission after user confirms in dialog (virtual tours only)
  const confirmSubmit = () => {
    if (!pendingFormData) return;
    
    const submissionData = {
      ...pendingFormData,
      tourDate,
      virtualSelections: tourType === "virtual" ? virtualSelections : undefined,
    };
    console.log("Form submitted:", submissionData);
    toast.success("Tour booking submitted successfully!");
    setShowConfirmDialog(false);
    setPendingFormData(null);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      reset();
      setTourDate(undefined);
      setCurrentStep(1);
      setVirtualSelections([]);
      setVirtualCity("");
      setVirtualProperty("");
      setVirtualRoomTypes([]);
      setVirtualMoveInDate(undefined);
    }, 4000);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#FFF5F6] via-white to-[#F0FEFF] p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-gray-100">
          <div className="w-32 h-32 bg-[#ff007f] rounded-full flex items-center justify-center mx-auto shadow-lg p-6">
            <img src={scapeLogo} alt="Scape Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-2">
            <h2 className="text-primary">Tour Booked Successfully!</h2>
            <p className="text-muted-foreground">
              Thanks for booking a tour with Scape. We've sent a confirmation email with all the details.
            </p>
          </div>
          <div className="bg-gradient-to-r from-[#FFF5F6] to-[#F0FEFF] rounded-xl p-4 text-sm border border-gray-100">
            <p className="text-muted-foreground">
              You'll receive your tour confirmation and any additional information at the email address provided.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[40%_60%] grid-cols-1">
      {/* Left Column: Banner */}
      <div className="relative min-h-[400px] lg:min-h-screen overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYXBhcnRtZW50JTIwYnVpbGRpbmclMjBleHRlcmlvcnxlbnwxfHx8fDE3Nzk1MDQzMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern student apartment building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-start xl:px-[115px] px-[24px] xl:py-[80px] py-[44px]">
          <h2 className="highlight">
            <span className="!text-[42px] lg:!text-[66px] !py-[8px] !px-[8px] !leading-[110%] font-pressura font-bold">
              see scape <br />up close and personal
            </span>
          </h2>
          <div className="banner-wrap mb-[24px] mt-[6px]">
            <p className="banner-desc max-w-[818px] !py-[8px] !px-[8px] font-bariol">
              Book a student housing tour to see the Scape difference up close with modern apartments and premier amenities that set us apart from the rest.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="bg-white overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-md">
          <div className="w-[85%] mx-auto px-4 py-4">
            <div className="mb-4 relative h-[50px] flex items-center justify-center">
              <div className="title">
                <div className="text-center -rotate-2">
                  <div className="font-pressura decoration-clone inline text-[#FFF162] text-[42px] not-italic font-bold leading-[normal] uppercase bg-[#191D3C] px-[8px] py-[4px]">
                    book a tour
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex justify-between mt-3 gap-2">
              <div className="flex items-center gap-1.5 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${currentStep >= 1 ? 'bg-[#242a56] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <span className="text-[10px] font-semibold gt-pressura-title" style={{ fontFamily: "'GT Pressura Pro Regular', 'GT Pressura Pro', sans-serif", fontWeight: 400, textTransform: 'uppercase' }}>1</span>
                </div>
                <span className={`font-pressura text-[14px] ${currentStep >= 1 ? "text-[#242a56]" : "text-muted-foreground"}`} style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Details</span>
              </div>
              <div className="flex items-center gap-1.5 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${currentStep >= 2 ? 'bg-[#055755] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <span className="text-[10px] font-semibold gt-pressura-title" style={{ fontFamily: "'GT Pressura Pro Regular', 'GT Pressura Pro', sans-serif", fontWeight: 400, textTransform: 'uppercase' }}>2</span>
                </div>
                <span className={`font-pressura text-[14px] ${currentStep >= 2 ? "text-[#055755]" : "text-muted-foreground"}`} style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Tour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-[85%] mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-gf-form-id="107">
          
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#242a56] border-x border-b p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="section-title uppercase text-[20px] not-italic font-bold leading-[90%] font-pressura mb-[16px] text-[#FF007F]">
                  Your Details
                </h2>
                <p className="section-desc text-[18px] not-italic font-normal leading-[120%] font-bariol text-[#191D3C] mt-1">
                  Please provide your contact information
                </p>
              </div>

              <div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="relative w-full">
                      <input
                        required
                        type="text"
                        id="firstName"
                        name="input_7"
                        data-gf-field-id="7"
                        className={`w-full px-[16px] pt-[18px] pb-[8px] text-[18px] border font-bariol rounded-[8px] outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none bg-[#F4F4F4] ${
                          errors.firstName
                            ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
                            : 'text-black border-[#F4F4F4]'
                        }`}
                        {...register("firstName", {
                          required: "required",
                        })}
                      />
                      <label
                        htmlFor="firstName"
                        className={`absolute pointer-events-none transition-all flex items-center left-[16px] ${
                          firstName || errors.firstName
                            ? 'top-[6px] text-[12px]'
                            : 'top-[14px] text-[18px]'
                        } ${
                          errors.firstName
                            ? 'text-[#ED1C24]'
                            : firstName
                              ? 'text-[#79BE76]'
                              : 'text-[#242A56]'
                        }`}
                      >
                        <span className={`mr-[4px] ${firstName || errors.firstName ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                          errors.firstName
                            ? 'text-[#ED1C24]'
                            : firstName
                              ? 'text-[#79BE76]'
                              : 'text-[#F11280]'
                        }`}>*</span>
                        First name
                      </label>
                      {errors.firstName && (
                        <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="relative w-full">
                      <input
                        required
                        type="text"
                        id="lastName"
                        name="input_12"
                        data-gf-field-id="12"
                        className={`w-full px-[16px] pt-[18px] pb-[8px] text-[18px] border font-bariol rounded-[8px] outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none bg-[#F4F4F4] ${
                          errors.lastName
                            ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
                            : 'text-black border-[#F4F4F4]'
                        }`}
                        {...register("lastName", {
                          required: "required",
                        })}
                      />
                      <label
                        htmlFor="lastName"
                        className={`absolute pointer-events-none transition-all flex items-center left-[16px] ${
                          lastName || errors.lastName
                            ? 'top-[6px] text-[12px]'
                            : 'top-[14px] text-[18px]'
                        } ${
                          errors.lastName
                            ? 'text-[#ED1C24]'
                            : lastName
                              ? 'text-[#79BE76]'
                              : 'text-[#242A56]'
                        }`}
                      >
                        <span className={`mr-[4px] ${lastName || errors.lastName ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                          errors.lastName
                            ? 'text-[#ED1C24]'
                            : lastName
                              ? 'text-[#79BE76]'
                              : 'text-[#F11280]'
                        }`}>*</span>
                        Last name
                      </label>
                      {errors.lastName && (
                        <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative w-full">
                    <input
                      required
                      type="email"
                      id="email"
                      name="input_8"
                      data-gf-field-id="8"
                      className={`w-full px-[16px] pt-[18px] pb-[8px] text-[18px] border font-bariol rounded-[8px] outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none bg-[#F4F4F4] ${
                        errors.email
                          ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
                          : 'text-black border-[#F4F4F4]'
                      }`}
                      {...register("email", {
                        required: "required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                    <label
                      htmlFor="email"
                      className={`absolute pointer-events-none transition-all flex items-center left-[16px] ${
                        email || errors.email
                          ? 'top-[6px] text-[12px]'
                          : 'top-[14px] text-[18px]'
                      } ${
                        errors.email
                          ? 'text-[#ED1C24]'
                          : email
                            ? 'text-[#79BE76]'
                            : 'text-[#242A56]'
                      }`}
                    >
                      <span className={`mr-[4px] ${email || errors.email ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                        errors.email
                          ? 'text-[#ED1C24]'
                          : email
                            ? 'text-[#79BE76]'
                            : 'text-[#F11280]'
                      }`}>*</span>
                      Email address
                    </label>
                    {errors.email && (
                      <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <PhoneInput
                      id="phone"
                      name="input_37"
                      data-gf-field-id="37"
                      defaultCountry="AU"
                      value={watch("phone") || ""}
                      onChange={(value, countryCode) => {
                        setPhoneCountryCode(countryCode);
                        setValue("phone", value, { shouldValidate: true, shouldDirty: true });
                      }}
                      error={errors.phone?.message || phoneError}
                      hasValue={!!phone}
                    />
                    <label
                      htmlFor="phone"
                      className={`absolute pointer-events-none transition-all flex items-center z-10 ${
                        phone || errors.phone || phoneError
                          ? 'top-[6px] text-[12px]'
                          : 'top-[14px] text-[18px]'
                      } ${
                        (errors.phone || phoneError)
                          ? 'text-[#ED1C24]'
                          : phone
                            ? 'text-[#79BE76]'
                            : 'text-[#242A56]'
                      }`}
                      style={{ left: '156px' }}
                    >
                      <span className={`mr-[4px] ${phone || errors.phone || phoneError ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                        (errors.phone || phoneError)
                          ? 'text-[#ED1C24]'
                          : phone
                            ? 'text-[#79BE76]'
                            : 'text-[#F11280]'
                      }`}>*</span>
                      Phone number
                    </label>
                    {(errors.phone || phoneError) && (
                      <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                        {errors.phone?.message || phoneError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tour Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-[#055755] border-x border-b p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="section-title uppercase text-[20px] not-italic font-bold leading-[90%] font-pressura mb-[16px] text-[#FF007F]">
                  Tour Details
                </h2>
                <p className="section-desc text-[18px] not-italic font-normal leading-[120%] font-bariol text-[#191D3C] mt-1">
                  Select your preferred property and tour options
                </p>
              </div>

              <div className="space-y-3">
                <Label>What type of tour would you like? <span className="text-[#ff007f]">*</span></Label>
                <RadioGroup
                  value={tourType}
                  onValueChange={(value) => setValue("tourType", value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className="relative">
                    <RadioGroupItem value="in-person" id="in-person" className="peer sr-only" />
                    <Label
                      htmlFor="in-person"
                      className="flex flex-col items-center text-center p-4 border-2 border-[#ff007f] rounded-lg cursor-pointer hover:bg-[#ff007f] hover:border-[#ff007f] peer-data-[state=checked]:border-[#fff162] peer-data-[state=checked]:bg-[#fff162] transition-all group"
                    >
                      <span className={`not-italic leading-[120%] font-pressura font-bold uppercase ${tourType === "in-person" ? "text-[22px]" : "text-[18px]"} text-[#ff007f] group-hover:text-white`}>In-Person Tour</span>
                      <span className={`mt-1 text-[16px] text-[#ff007f] group-hover:text-white`}>
                        Visit us and see the property yourself
                      </span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="virtual" id="virtual" className="peer sr-only" />
                    <Label
                      htmlFor="virtual"
                      className="flex flex-col items-center text-center p-4 border-2 border-[#ff007f] rounded-lg cursor-pointer hover:bg-[#ff007f] hover:border-[#ff007f] peer-data-[state=checked]:border-[#fff162] peer-data-[state=checked]:bg-[#fff162] transition-all group"
                    >
                      <span className={`not-italic leading-[120%] font-pressura font-bold uppercase ${tourType === "virtual" ? "text-[22px]" : "text-[18px]"} text-[#ff007f] group-hover:text-white`}>Virtual Tour</span>
                      <span className={`mt-1 text-[16px] text-[#ff007f] group-hover:text-white`}>
                        Join us online via video call
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {tourType === "in-person" && (
                <div className="relative w-full">
                  <select
                    required
                    id="city"
                    value={selectedCity || ""}
                    onChange={(e) => {
                      setValue("city", e.target.value, { shouldValidate: true });
                      setValue("property", ""); // Reset property when city changes
                    }}
                    className={`w-full px-[16px] pt-[18px] pb-[8px] pr-[33px] text-[18px] border rounded-[8px] outline-none transition-all appearance-none font-bariol bg-[#F4F4F4] ${
                      errors.city
                        ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
                        : selectedCity
                          ? 'border-[#79BE76] text-black'
                          : 'border-[#F4F4F4] text-black'
                    }`}
                  >
                    <option className="hidden" value="" disabled hidden></option>
                    {cities.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F" />
                  </svg>
                  <label
                    htmlFor="city"
                    className={`absolute pointer-events-none transition-all flex items-center z-10 left-[16px] ${
                      selectedCity || errors.city
                        ? 'top-[6px] text-[12px]'
                        : 'top-[14px] text-[18px]'
                    } ${
                      errors.city
                        ? 'text-[#ED1C24]'
                        : selectedCity
                          ? 'text-[#79BE76]'
                          : 'text-[#242A56]'
                    }`}
                  >
                    <span className={`mr-[4px] ${selectedCity || errors.city ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                      errors.city
                        ? 'text-[#ED1C24]'
                        : selectedCity
                          ? 'text-[#79BE76]'
                          : 'text-[#F11280]'
                    }`}>*</span>
                    Select city
                  </label>
                  {errors.city && (
                    <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              )}

              {tourType === "in-person" && (
                <div className="relative w-full">
                  <select
                    required
                    id="property"
                    value={selectedProperty || ""}
                    onChange={(e) => {
                      setValue("property", e.target.value, { shouldValidate: true });
                      // Reset tour date and time slot when property changes
                      setTourDate(undefined);
                      setValue("tourDate", undefined);
                      setValue("timeSlot", "");
                    }}
                    disabled={!selectedCity}
                    className={`w-full px-[16px] pt-[18px] pb-[8px] pr-[33px] text-[18px] border rounded-[8px] outline-none transition-all appearance-none font-bariol bg-[#F4F4F4] ${
                      errors.property
                        ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
                        : selectedProperty
                          ? 'border-[#79BE76] text-black'
                          : 'border-[#F4F4F4] text-black'
                    } ${!selectedCity ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option className="hidden" value="" disabled hidden></option>
                    {availableProperties.map((property) => (
                      <option key={property} value={property}>
                        {property}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F" />
                  </svg>
                  <label
                    htmlFor="property"
                    className={`absolute pointer-events-none transition-all flex items-center z-10 left-[16px] ${
                      selectedProperty || errors.property
                        ? 'top-[6px] text-[12px]'
                        : 'top-[14px] text-[18px]'
                    } ${
                      errors.property
                        ? 'text-[#ED1C24]'
                        : selectedProperty
                          ? 'text-[#79BE76]'
                          : 'text-[#242A56]'
                    }`}
                  >
                    <span className={`mr-[4px] ${selectedProperty || errors.property ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                      errors.property
                        ? 'text-[#ED1C24]'
                        : selectedProperty
                          ? 'text-[#79BE76]'
                          : 'text-[#F11280]'
                    }`}>*</span>
                    {!selectedCity ? "Select a city first" : "Select property"}
                  </label>
                  {errors.property && (
                    <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                      {errors.property.message}
                    </p>
                  )}
                </div>
              )}

              {tourType === "in-person" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <svg className="absolute left-[16px] top-[21px] pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0.343018C3.77614 0.343018 4 0.566875 4 0.843018V1.34302H12V0.843018C12 0.566875 12.2239 0.343018 12.5 0.343018C12.7761 0.343018 13 0.566875 13 0.843018V1.34302H14C15.1046 1.34302 16 2.23845 16 3.34302V14.343C16 15.4476 15.1046 16.343 14 16.343H2C0.895431 16.343 0 15.4476 0 14.343V3.34302C0 2.23845 0.895431 1.34302 2 1.34302H3V0.843018C3 0.566875 3.22386 0.343018 3.5 0.343018ZM2 2.34302C1.44772 2.34302 1 2.79073 1 3.34302V14.343C1 14.8953 1.44772 15.343 2 15.343H14C14.5523 15.343 15 14.8953 15 14.343V3.34302C15 2.79073 14.5523 2.34302 14 2.34302H2Z" fill="#FF007F"/>
                            <path d="M2.5 4.34302C2.5 4.06688 2.72386 3.84302 3 3.84302H13C13.2761 3.84302 13.5 4.06688 13.5 4.34302V5.34302C13.5 5.61916 13.2761 5.84302 13 5.84302H3C2.72386 5.84302 2.5 5.61916 2.5 5.34302V4.34302Z" fill="#FF007F"/>
                            <path d="M11 7.84302C11 7.56688 11.2239 7.34302 11.5 7.34302H12.5C12.7761 7.34302 13 7.56688 13 7.84302V8.84302C13 9.11916 12.7761 9.34302 12.5 9.34302H11.5C11.2239 9.34302 11 9.11916 11 8.84302V7.84302Z" fill="#FF007F"/>
                            <path d="M8 7.84302C8 7.56688 8.22386 7.34302 8.5 7.34302H9.5C9.77614 7.34302 10 7.56688 10 7.84302V8.84302C10 9.11916 9.77614 9.34302 9.5 9.34302H8.5C8.22386 9.34302 8 9.11916 8 8.84302V7.84302Z" fill="#FF007F"/>
                            <path d="M3 10.843C3 10.5669 3.22386 10.343 3.5 10.343H4.5C4.77614 10.343 5 10.5669 5 10.843V11.843C5 12.1192 4.77614 12.343 4.5 12.343H3.5C3.22386 12.343 3 12.1192 3 11.843V10.843Z" fill="#FF007F"/>
                            <path d="M6 10.843C6 10.5669 6.22386 10.343 6.5 10.343H7.5C7.77614 10.343 8 10.5669 8 10.843V11.843C8 12.1192 7.77614 12.343 7.5 12.343H6.5C6.22386 12.343 6 12.1192 6 11.843V10.843Z" fill="#FF007F"/>
                          </svg>
                          <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F"/>
                          </svg>
                          <Button
                            type="button"
                            variant="outline"
                            className={`w-full justify-start text-left !h-auto !pl-[44px] !pr-[33px] !pt-[18px] !pb-[8px] !text-[18px] !rounded-[8px] !outline-none !transition-all !bg-[#F4F4F4] !font-bariol !normal-case ${
                              tourDate
                                ? '!border !border-[#79BE76] !text-[#79BE76]'
                                : '!border !border-[#F4F4F4] !text-transparent'
                            }`}
                          >
                            {tourDate ? formatDate(tourDate) : 'placeholder'}
                          </Button>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={tourDate}
                          onSelect={(date) => {
                            setTourDate(date);
                            setValue("tourDate", date);
                          }}
                          disabled={(date) => {
                            const selectedProperty = watch("property");

                            // Check if property has specific availability
                            if (selectedProperty && propertyAvailability[selectedProperty]) {
                              const availability = propertyAvailability[selectedProperty];
                              const checkDate = new Date(date);
                              checkDate.setHours(0, 0, 0, 0);
                              const startDate = new Date(availability.dateRange.start);
                              startDate.setHours(0, 0, 0, 0);
                              const endDate = new Date(availability.dateRange.end);
                              endDate.setHours(0, 0, 0, 0);

                              // Only enable dates within the property's specific range
                              return checkDate < startDate || checkDate > endDate;
                            }

                            // Default behavior for properties without specific availability
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            // Disable past dates
                            if (date < today) return true;

                            // Disable weekends for Scape Redfern in-person tours
                            if (selectedProperty === "Scape Redfern") {
                              const dayOfWeek = date.getDay();
                              // 0 = Sunday, 6 = Saturday
                              return dayOfWeek === 0 || dayOfWeek === 6;
                            }

                            return false;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <label
                      className={`absolute pointer-events-none transition-all flex items-center bg-transparent pr-[33px] ${
                        tourDate
                          ? 'top-[6px] text-[12px] left-[44px]'
                          : 'top-[14px] text-[18px] left-[44px]'
                      } ${
                        tourDate ? 'text-[#79BE76]' : 'text-[#242A56]'
                      }`}
                    >
                      <span className={`mr-[4px] ${tourDate ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                        tourDate ? 'text-[#79BE76]' : 'text-[#F11280]'
                      }`}>*</span>
                      Preferred tour date
                    </label>
                  </div>

{/* Only show Preferred Time for cities other than Sydney, Brisbane, Adelaide */}
                  {selectedCity && !["sydney", "brisbane", "adelaide"].includes(selectedCity) && (
                    <div className="relative w-full">
                      <select
                        required
                        id="timeSlot"
                        value={timeSlot || ""}
                        onChange={(e) => setValue("timeSlot", e.target.value, { shouldValidate: true })}
                        className={`w-full px-[16px] pt-[18px] pb-[8px] pr-[33px] text-[18px] border rounded-[8px] outline-none transition-all appearance-none font-bariol bg-[#F4F4F4] ${
                          errors.timeSlot
                            ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
                            : timeSlot
                              ? 'border-[#79BE76] text-black'
                              : 'border-[#F4F4F4] text-black'
                        }`}
                      >
                        <option className="hidden" value="" disabled hidden></option>
                        {(() => {
                          const selectedProperty = watch("property");
                          const availableSlots = selectedProperty && propertyAvailability[selectedProperty]
                            ? propertyAvailability[selectedProperty].timeSlots
                            : timeSlots;

                          return availableSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ));
                        })()}
                      </select>
                      <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F" />
                      </svg>
                      <label
                        htmlFor="timeSlot"
                        className={`absolute pointer-events-none transition-all flex items-center z-10 left-[16px] right-[50px] ${
                          timeSlot || errors.timeSlot
                            ? 'top-[6px] text-[12px]'
                            : 'top-[14px] text-[18px]'
                        } ${
                          errors.timeSlot
                            ? 'text-[#ED1C24]'
                            : timeSlot
                              ? 'text-[#79BE76]'
                              : 'text-[#242A56]'
                        }`}
                      >
                        <span className={`mr-[4px] flex-shrink-0 ${timeSlot || errors.timeSlot ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                          errors.timeSlot
                            ? 'text-[#ED1C24]'
                            : timeSlot
                              ? 'text-[#79BE76]'
                              : 'text-[#F11280]'
                        }`}>*</span>
                        <span className="truncate">What time would you like to view the property?</span>
                      </label>
                      {errors.timeSlot && (
                        <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                          {errors.timeSlot.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {tourType === "in-person" && (
                <div className="relative w-full">
                  <select
                    required
                    id="roomType"
                    value={roomType || ""}
                    onChange={(e) => setValue("roomType", e.target.value, { shouldValidate: true })}
                    className={`w-full px-[16px] pt-[18px] pb-[8px] pr-[33px] text-[18px] border rounded-[8px] outline-none transition-all appearance-none font-bariol bg-[#F4F4F4] ${
                      errors.roomType
                        ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
                        : roomType
                          ? 'border-[#79BE76] text-black'
                          : 'border-[#F4F4F4] text-black'
                    }`}
                  >
                    <option className="hidden" value="" disabled hidden></option>
                    <option value="studio">Studio</option>
                    <option value="ensuite">Ensuite (Shared Kitchen)</option>
                    <option value="shared">Shared Room</option>
                    <option value="twin">Twin Share</option>
                    <option value="all">Show me all options</option>
                  </select>
                  <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F" />
                  </svg>
                  <label
                    htmlFor="roomType"
                    className={`absolute pointer-events-none transition-all flex items-center z-10 left-[16px] ${
                      roomType || errors.roomType
                        ? 'top-[6px] text-[12px]'
                        : 'top-[14px] text-[18px]'
                    } ${
                      errors.roomType
                        ? 'text-[#ED1C24]'
                        : roomType
                          ? 'text-[#79BE76]'
                          : 'text-[#242A56]'
                    }`}
                  >
                    <span className={`mr-[4px] ${roomType || errors.roomType ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                      errors.roomType
                        ? 'text-[#ED1C24]'
                        : roomType
                          ? 'text-[#79BE76]'
                          : 'text-[#F11280]'
                    }`}>*</span>
                    Room type interest
                  </label>
                  {errors.roomType && (
                    <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                      {errors.roomType.message}
                    </p>
                  )}
                </div>
              )}

              {/* Virtual Tour Multi-Selection */}
              {tourType === "virtual" && (
                <div className="space-y-6 rounded-lg p-6 bg-[#242a56]">
                  <div>
                    <h3 className="mb-2 font-pressura font-bold uppercase text-[#ff007f] text-[20px]">Select Properties & Rooms for Virtual Tour</h3>
                    <p className="section-desc text-[18px] not-italic font-normal leading-[120%] font-bariol text-white">
                      You can add multiple properties and room types to your virtual tour. Select a maximum of 5 properties.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative w-full">
                      <select
                        id="virtual-city"
                        value={virtualCity}
                        onChange={(e) => {
                          setVirtualCity(e.target.value);
                          setVirtualProperty("");
                          setVirtualRoomTypes([]);
                        }}
                        className={`w-full px-[16px] pt-[18px] pb-[8px] pr-[33px] text-[18px] border rounded-[8px] outline-none transition-all appearance-none font-bariol bg-[#F4F4F4] ${
                          virtualCity ? 'border-[#79BE76] text-black' : 'border-[#F4F4F4] text-black'
                        }`}
                      >
                        <option className="hidden" value="" disabled hidden></option>
                        {cities.map((city) => (
                          <option key={city.value} value={city.value}>
                            {city.label}
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F" />
                      </svg>
                      <label
                        htmlFor="virtual-city"
                        className={`absolute pointer-events-none transition-all flex items-center z-10 left-[16px] ${
                          virtualCity
                            ? 'top-[6px] text-[12px]'
                            : 'top-[14px] text-[18px]'
                        } ${
                          virtualCity ? 'text-[#79BE76]' : 'text-[#242A56]'
                        }`}
                      >
                        <span className={`mr-[4px] ${virtualCity ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${virtualCity ? 'text-[#79BE76]' : 'text-[#F11280]'}`}>*</span>
                        Which city are you interested in?
                      </label>
                    </div>

                    <div className="relative w-full">
                      <select
                        id="virtual-property"
                        value={virtualProperty}
                        onChange={(e) => {
                          setVirtualProperty(e.target.value);
                          setVirtualRoomTypes([]);
                        }}
                        disabled={!virtualCity}
                        className={`w-full px-[16px] pt-[18px] pb-[8px] pr-[33px] text-[18px] border rounded-[8px] outline-none transition-all appearance-none font-bariol bg-[#F4F4F4] ${
                          virtualProperty ? 'border-[#79BE76] text-black' : 'border-[#F4F4F4] text-black'
                        } ${!virtualCity ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option className="hidden" value="" disabled hidden></option>
                        {virtualCity && propertiesByCity[virtualCity]?.map((property) => (
                          <option key={property} value={property}>
                            {property}
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F" />
                      </svg>
                      <label
                        htmlFor="virtual-property"
                        className={`absolute pointer-events-none transition-all flex items-center z-10 left-[16px] ${
                          virtualProperty
                            ? 'top-[6px] text-[12px]'
                            : 'top-[14px] text-[18px]'
                        } ${
                          virtualProperty ? 'text-[#79BE76]' : 'text-[#242A56]'
                        }`}
                      >
                        <span className={`mr-[4px] ${virtualProperty ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${virtualProperty ? 'text-[#79BE76]' : 'text-[#F11280]'}`}>*</span>
                        {!virtualCity ? "Select a city first" : "Select property"}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">
                        Room Types <span className="text-[#ff007f]">*</span> (Select one or more)
                      </Label>
                      <div className="border rounded-lg p-4 bg-white space-y-2 max-h-48 overflow-y-auto">
                        {virtualProperty && roomTypesByProperty[virtualProperty] ? (
                          roomTypesByProperty[virtualProperty].map((roomType) => (
                            <div key={roomType} className="flex items-center space-x-2">
                              <Checkbox
                                id={`room-${roomType}`}
                                checked={virtualRoomTypes.includes(roomType)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setVirtualRoomTypes([...virtualRoomTypes, roomType]);
                                  } else {
                                    setVirtualRoomTypes(virtualRoomTypes.filter(r => r !== roomType));
                                  }
                                }}
                              />
                              <Label htmlFor={`room-${roomType}`} className="cursor-pointer font-bariol text-[18px]">
                                {roomType}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="section-desc text-[18px] not-italic font-normal leading-[120%] font-bariol text-white">Select a property to see available room types</p>
                        )}
                      </div>
                      {virtualRoomTypes.length > 0 && (
                        <p className="text-sm text-white">
                          {virtualRoomTypes.length} room type{virtualRoomTypes.length > 1 ? 's' : ''} selected
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={addPropertySelection}
                      className="w-full font-pressura font-bold text-white bg-[#ff007f] leading-[15px] rounded-[100px] transition-all duration-200 hover:text-[#ff007f] hover:bg-[#fff162] active:text-[#ff007f] active:bg-[#fff162] focus:shadow-[0px_0px_10px_2px_#FFBA26] focus:text-[#ff007f] focus:bg-[#fff162] sm:px-[32px] sm:py-[17px] px-[24px] py-[12px] sm:text-[16px] text-[14px] max-h-[50px] uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!virtualCity || !virtualProperty || virtualRoomTypes.length === 0 || virtualSelections.length >= 5}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Property & Rooms to Tour
                    </Button>
                  </div>

                  {/* Selected Properties Summary */}
                  {virtualSelections.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Your Selected Properties ({virtualSelections.length})</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearAllSelections}
                          className="text-[#ff007f] bg-white hover:text-[#ff007f] hover:bg-[#fff162] font-pressura font-bold uppercase"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Clear All
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {virtualSelections.map((selection) => (
                          <div key={selection.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 shadow-sm">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-[#ff007f]" />
                                  <span>{selection.property}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {cities.find(c => c.value === selection.city)?.label}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePropertySelection(selection.id)}
                                className="text-[#ff007f] hover:text-[#ff007f] hover:bg-[#FFF5F6] -mt-2 -mr-2"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {selection.roomTypes.map((roomType) => (
                                <Badge
                                  key={roomType}
                                  variant="secondary"
                                  className="gap-1 pr-1 bg-[#055755] text-white hover:bg-[#055755]"
                                >
                                  {roomType}
                                  <button
                                    type="button"
                                    onClick={() => removeRoomFromSelection(selection.id, roomType)}
                                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tourType === "virtual" && (
                <div className="relative w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <svg className="absolute left-[16px] top-[21px] pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0.343018C3.77614 0.343018 4 0.566875 4 0.843018V1.34302H12V0.843018C12 0.566875 12.2239 0.343018 12.5 0.343018C12.7761 0.343018 13 0.566875 13 0.843018V1.34302H14C15.1046 1.34302 16 2.23845 16 3.34302V14.343C16 15.4476 15.1046 16.343 14 16.343H2C0.895431 16.343 0 15.4476 0 14.343V3.34302C0 2.23845 0.895431 1.34302 2 1.34302H3V0.843018C3 0.566875 3.22386 0.343018 3.5 0.343018ZM2 2.34302C1.44772 2.34302 1 2.79073 1 3.34302V14.343C1 14.8953 1.44772 15.343 2 15.343H14C14.5523 15.343 15 14.8953 15 14.343V3.34302C15 2.79073 14.5523 2.34302 14 2.34302H2Z" fill="#FF007F"/>
                          <path d="M2.5 4.34302C2.5 4.06688 2.72386 3.84302 3 3.84302H13C13.2761 3.84302 13.5 4.06688 13.5 4.34302V5.34302C13.5 5.61916 13.2761 5.84302 13 5.84302H3C2.72386 5.84302 2.5 5.61916 2.5 5.34302V4.34302Z" fill="#FF007F"/>
                          <path d="M11 7.84302C11 7.56688 11.2239 7.34302 11.5 7.34302H12.5C12.7761 7.34302 13 7.56688 13 7.84302V8.84302C13 9.11916 12.7761 9.34302 12.5 9.34302H11.5C11.2239 9.34302 11 9.11916 11 8.84302V7.84302Z" fill="#FF007F"/>
                          <path d="M8 7.84302C8 7.56688 8.22386 7.34302 8.5 7.34302H9.5C9.77614 7.34302 10 7.56688 10 7.84302V8.84302C10 9.11916 9.77614 9.34302 9.5 9.34302H8.5C8.22386 9.34302 8 9.11916 8 8.84302V7.84302Z" fill="#FF007F"/>
                          <path d="M3 10.843C3 10.5669 3.22386 10.343 3.5 10.343H4.5C4.77614 10.343 5 10.5669 5 10.843V11.843C5 12.1192 4.77614 12.343 4.5 12.343H3.5C3.22386 12.343 3 12.1192 3 11.843V10.843Z" fill="#FF007F"/>
                          <path d="M6 10.843C6 10.5669 6.22386 10.343 6.5 10.343H7.5C7.77614 10.343 8 10.5669 8 10.843V11.843C8 12.1192 7.77614 12.343 7.5 12.343H6.5C6.22386 12.343 6 12.1192 6 11.843V10.843Z" fill="#FF007F"/>
                        </svg>
                        <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F"/>
                        </svg>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start text-left !h-auto !pl-[44px] !pr-[33px] !pt-[18px] !pb-[8px] !text-[18px] !rounded-[8px] !outline-none !transition-all !bg-[#F4F4F4] !font-bariol !normal-case ${
                            virtualMoveInDate
                              ? '!border !border-[#79BE76] !text-black'
                              : '!border !border-[#F4F4F4] !text-transparent'
                          }`}
                        >
                          {virtualMoveInDate ? formatDate(virtualMoveInDate) : 'placeholder'}
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={virtualMoveInDate}
                        onSelect={(date) => {
                          setVirtualMoveInDate(date);
                          if (date) {
                            setValue("moveInDate", date.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <label
                    className={`absolute pointer-events-none transition-all flex items-center bg-transparent pr-[33px] z-10 ${
                      virtualMoveInDate
                        ? 'top-[6px] text-[12px] left-[44px]'
                        : 'top-[14px] text-[18px] left-[44px]'
                    } ${
                      virtualMoveInDate ? 'text-[#79BE76]' : 'text-[#242A56]'
                    }`}
                  >
                    <span className={`mr-[4px] ${virtualMoveInDate ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                      virtualMoveInDate ? 'text-[#79BE76]' : 'text-[#F11280]'
                    }`}>*</span>
                    Please give an indication of when you would like to move in
                  </label>
                </div>
              )}

              <div className="relative w-full">
                <select
                  required
                  id="hearAboutUs"
                  value={hearAboutUs || ""}
                  onChange={(e) => setValue("hearAboutUs", e.target.value, { shouldValidate: true })}
                  className={`w-full px-[16px] pt-[18px] pb-[8px] pr-[33px] text-[18px] border rounded-[8px] outline-none transition-all appearance-none font-bariol bg-[#F4F4F4] ${
                    errors.hearAboutUs
                      ? 'border-2 border-[#ED1C24] text-[#ED1C24]'
                      : hearAboutUs
                        ? 'border-[#79BE76] text-black'
                        : 'border-[#F4F4F4] text-black'
                  }`}
                >
                  <option className="hidden" value="" disabled hidden></option>
                  <option value="ai-chatbot">AI Chatbot</option>
                  <option value="accommodation-agent">Accommodation Agent</option>
                  <option value="event-open-day">Event/Open Day/O-Week</option>
                  <option value="google-online-search">Google/Online Search</option>
                  <option value="social-media">Social Media</option>
                  <option value="wechat">WeChat</option>
                  <option value="accommodation-listing">Accommodation Listing</option>
                  <option value="outdoor-media">Outdoor Media</option>
                  <option value="online-banner-ad">Online Banner Ad</option>
                  <option value="youtube-online-video">YouTube/Online Video Ad</option>
                  <option value="returning-student">Returning Student</option>
                  <option value="university-educational">University/Educational Institution</option>
                  <option value="word-of-mouth">Word of Mouth</option>
                  <option value="walked-past-property">Walked Past Property</option>
                  <option value="study-org">Study Org (eg. Study Melbourne)</option>
                  <option value="partnership-sponsorship">Partnership/Sponsorship</option>
                </select>
                <svg className="absolute right-[16px] top-[21px] pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#FF007F" />
                </svg>
                <label
                  htmlFor="hearAboutUs"
                  className={`absolute pointer-events-none transition-all flex items-center z-10 left-[16px] ${
                    hearAboutUs || errors.hearAboutUs
                      ? 'top-[6px] text-[12px]'
                      : 'top-[14px] text-[18px]'
                  } ${
                    errors.hearAboutUs
                      ? 'text-[#ED1C24]'
                      : hearAboutUs
                        ? 'text-[#79BE76]'
                        : 'text-[#242A56]'
                  }`}
                >
                  <span className={`mr-[4px] ${hearAboutUs || errors.hearAboutUs ? 'text-[12px]' : 'text-[18px]'} h-[19px] ${
                    errors.hearAboutUs
                      ? 'text-[#ED1C24]'
                      : hearAboutUs
                        ? 'text-[#79BE76]'
                        : 'text-[#F11280]'
                  }`}>*</span>
                  How did you hear about Scape?
                </label>
                {errors.hearAboutUs && (
                  <p className="text-red-500 text-[14px] not-italic font-bold leading-[normal] mt-[6px] text-[#ED1C24]">
                    {errors.hearAboutUs.message}
                  </p>
                )}
              </div>

              {/* Consent Section */}
              <div className="space-y-4 pt-6 border-t">
                <ScapeCheckbox
                  id="marketing"
                  checked={marketingConsent}
                  onCheckedChange={(checked) =>
                    setValue("marketingConsent", checked)
                  }
                  className="md:mb-[32px] md:mt-[24px] mb-[40px] mt-[40px]"
                >
                  <span className="privacy-text w-[calc(100%-36px)] text-[#242a56] text-[18px] not-italic font-normal leading-[120%]">
                    Sign me up to receive marketing communication including promotions, updates, event details, newsletters and more!
                  </span>
                </ScapeCheckbox>

                <ScapeCheckbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setValue("agreeToTerms", checked)
                  }
                  className="md:mb-[56px] mb-[40px]"
                >
                  <span className="privacy-text w-[calc(100%-36px)] text-[#242a56] text-[18px] not-italic font-normal leading-[120%]">
                    *I have read, understood, and agree to the{" "}
                    <a
                      href="https://www.scape.com.au/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Scape Terms and Conditions
                    </a>
                    ,{" "}
                    <a
                      href="https://www.scape.com.au/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                    {" "}and{" "}
                    <a
                      href="https://www.scape.com.au/privacy-collection-notice"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Collection Notice
                    </a>
                    , and consent to the collection and use of my personal information (which may include sensitive personal information) in accordance with those documents.
                  </span>
                </ScapeCheckbox>
                <input
                  type="hidden"
                  {...register("agreeToTerms", {
                    required: "You must agree to the terms and conditions",
                    validate: (value) => value === true || "You must agree to the terms and conditions",
                  })}
                />
                {errors.agreeToTerms && (
                  <p className="text-[#ff007f] text-sm ml-9">{errors.agreeToTerms.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                aria-label="BACK"
                className="font-pressura font-bold text-[#FF007F] bg-white border-2 border-[#FF007F] rounded-[100px] transition-all duration-200 leading-[15px] flex items-center justify-center
                  hover:bg-[#FFF162] hover:text-[#FF007F] hover:border-[#FF007F]
                  active:bg-[#FFF162] active:text-[#FF007F]
                  focus:[box-shadow:0px_0px_10px_2px_#FFBA26]
                  px-[40px] py-[14px] text-[16px] uppercase"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                aria-label="CONTINUE"
                className="font-pressura font-bold text-white bg-[#FF007F] rounded-[100px] transition-all duration-200 leading-[15px] flex items-center justify-center
                  hover:bg-[#FFF162] hover:text-[#FF007F]
                  active:bg-[#FFF162] active:text-[#FF007F]
                  focus:shadow-focus-yellow focus:text-[#fff] focus:bg-[#FF007F] focus:[box-shadow:0px_0px_10px_2px_#FFBA26]
                  px-[40px] py-[14px] text-[16px] uppercase"
              >
                CONTINUE
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                aria-label="SUBMIT"
                className="font-pressura font-bold text-white bg-[#FF007F] rounded-[100px] transition-all duration-200 leading-[15px] flex items-center justify-center
                  hover:bg-[#FFF162] hover:text-[#FF007F]
                  active:bg-[#FFF162] active:text-[#FF007F]
                  focus:shadow-focus-yellow focus:text-[#fff] focus:bg-[#FF007F] focus:[box-shadow:0px_0px_10px_2px_#FFBA26]
                  px-[40px] py-[14px] text-[16px] uppercase"
              >
                BOOK TOUR
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By submitting this form, you agree to receive communications from Scape about your booking and our services.
          </p>
        </form>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={(open) => {
          setShowConfirmDialog(open);
          if (!open) {
            setViewingProperty(null);
            setViewingRoomType(null);
          }
        }}>
          <DialogContent className={viewingProperty ? "max-w-[95vw] sm:max-w-[700px] lg:max-w-[800px] h-[90vh] max-h-[900px] p-0 overflow-hidden" : "sm:max-w-[500px]"}>
            {viewingProperty && viewingRoomType ? (
              <PropertyDetails
                propertyName={viewingProperty}
                roomType={viewingRoomType}
                onBack={() => {
                  setViewingProperty(null);
                  setViewingRoomType(null);
                }}
              />
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-[#ff007f] font-pressura font-bold uppercase">
                    <Building2 className="w-6 h-6" />
                    {tourType === "virtual" ? "CONFIRM YOUR VIRTUAL TOUR" : "CONFIRM YOUR PROPERTY TOUR"}
                  </DialogTitle>
                  <DialogDescription className="section-desc text-[18px] not-italic font-normal leading-[120%] font-bariol text-[#242a56] pt-2">
                    {tourType === "virtual"
                      ? "Review your selected properties below."
                      : "Review your selected property below."}
                  </DialogDescription>
                </DialogHeader>

            <div className="space-y-4 py-4">
              {tourType === "virtual" ? (
                <div className="space-y-3">
                  {virtualSelections.map((selection) => (
                    <div
                      key={selection.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-[#242a56]" />
                            <span className="font-medium">{selection.property}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {cities.find(c => c.value === selection.city)?.label}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selection.roomTypes.map((roomType) => (
                              <span
                                key={roomType}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] capitalize bg-[#055755] text-white font-bariol"
                              >
                                {roomType}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                watch("property") && (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-[#242a56]" />
                          <span className="font-medium">{watch("property")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {cities.find(c => c.value === watch("city"))?.label}
                        </p>
                        {watch("roomType") && (
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] capitalize bg-[#055755] text-white mt-1 font-bariol"
                          >
                            {watch("roomType")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 justify-center sm:justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="w-full sm:w-auto font-pressura font-bold uppercase"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={confirmSubmit}
                  variant="primary"
                  className="w-full sm:w-auto font-pressura font-bold uppercase"
                >
                  Submit Booking
                </Button>
              </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}
