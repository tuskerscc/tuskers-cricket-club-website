import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import tuskersLogo from "@assets/Tuskers CC Logo.png";

const formSchema = z.object({
  // Personal Details
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Prefer not to say"], {
    required_error: "Please select your gender",
  }),
  
  // Contact Information
  email: z.string().email("Please enter a valid email address"),
  mobilePhone: z.string().min(1, "Mobile phone number is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  townCity: z.string().min(1, "Town/City is required"),
  
  // Cricket Experience
  playingRoles: z.array(z.string()).min(1, "Please select at least one playing role"),
  battingStyle: z.enum(["Right-handed Bat", "Left-handed Bat"], {
    required_error: "Please select your batting style",
  }),
  bowlingArm: z.string().optional(),
  bowlingType: z.string().optional(),
  highestLevel: z.string().min(1, "Please select your highest level of cricket played"),
  otherLevelDetails: z.string().optional(),
  previousClubs: z.string().optional(),
  
  // Medical Information
  hasMedicalConditions: z.enum(["Yes", "No"], {
    required_error: "Please indicate if you have any medical conditions",
  }),
  medicalDetails: z.string().optional(),
  
  // Under 18 Information
  isUnder18: z.enum(["Yes", "No"], {
    required_error: "Please indicate if the player is under 18",
  }),
  parentGuardianName: z.string().optional(),
  parentGuardianEmail: z.string().optional(),
  parentGuardianPhone: z.string().optional(),
  parentalConsent: z.boolean().optional(),
  
  // Consents & Agreements
  codeOfConductAgreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the Code of Conduct",
  }),
  photographyConsent: z.enum(["Consent", "Do not consent"], {
    required_error: "Please select your photography preference",
  }),
  dataPrivacyConsent: z.boolean().refine(val => val === true, {
    message: "You must agree to the data privacy terms",
  }),
  
  // Optional
  howDidYouHear: z.string().optional(),
  otherHearDetails: z.string().optional(),
}).superRefine((data, ctx) => {
  // Conditional validation for bowling fields
  if (data.playingRoles.includes("Bowler") || data.playingRoles.includes("All-rounder")) {
    if (!data.bowlingArm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bowling arm is required for bowlers and all-rounders",
        path: ["bowlingArm"],
      });
    }
    if (!data.bowlingType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bowling type is required for bowlers and all-rounders",
        path: ["bowlingType"],
      });
    }
  }
  
  // Conditional validation for "Other" highest level
  if (data.highestLevel === "Other (Please specify below)" && !data.otherLevelDetails) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify the other level of cricket",
      path: ["otherLevelDetails"],
    });
  }
  
  // Conditional validation for medical conditions
  if (data.hasMedicalConditions === "Yes" && !data.medicalDetails) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide details about your medical conditions",
      path: ["medicalDetails"],
    });
  }
  
  // Conditional validation for under 18
  if (data.isUnder18 === "Yes") {
    if (!data.parentGuardianName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parent/Guardian name is required for players under 18",
        path: ["parentGuardianName"],
      });
    }
    if (!data.parentGuardianEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parent/Guardian email is required for players under 18",
        path: ["parentGuardianEmail"],
      });
    }
    if (!data.parentGuardianPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parent/Guardian phone number is required for players under 18",
        path: ["parentGuardianPhone"],
      });
    }
    if (!data.parentalConsent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parental consent is required for players under 18",
        path: ["parentalConsent"],
      });
    }
  }
  
  // Conditional validation for "Other" hear about us
  if (data.howDidYouHear === "Other (Please specify)" && !data.otherHearDetails) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify how you heard about us",
      path: ["otherHearDetails"],
    });
  }
});

export default function PlayerRegistration() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playingRoles: [],
      codeOfConductAgreement: false,
      dataPrivacyConsent: false,
      parentalConsent: false,
    },
  });

  const registrationMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => 
      apiRequest('POST', '/api/player-registration', data),
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Registration Submitted",
        description: "Thank you for your interest in Tuskers CC! We'll be in touch soon.",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    registrationMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#1e40af] py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <img 
                  src={tuskersLogo} 
                  alt="Tuskers CC Logo" 
                  className="w-24 h-24 mx-auto object-contain mb-4"
                />
              </div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-4">Registration Submitted!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your interest in joining Tuskers CC for the 2025/26 season. 
                We have received your registration and will review it shortly.
              </p>
              <p className="text-gray-600 mb-8">
                A member of our team will contact you within the next few days via the email 
                address you provided. Please check your spam folder if you don't hear from us.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const watchedPlayingRoles = form.watch("playingRoles");
  const watchedHighestLevel = form.watch("highestLevel");
  const watchedMedicalConditions = form.watch("hasMedicalConditions");
  const watchedIsUnder18 = form.watch("isUnder18");
  const watchedHowDidYouHear = form.watch("howDidYouHear");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#1e40af] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src={tuskersLogo} 
            alt="Tuskers CC Logo" 
            className="w-24 h-24 mx-auto object-contain mb-4"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Tuskers CC - Player Registration Form
          </h1>
          <h2 className="text-xl text-yellow-300 mb-6">Season 2025/26</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-white">
              We're excited to have you join or re-join Tuskers CC! Please fill out the form below. 
              All information provided will be handled in accordance with our Privacy Policy.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Section 1: Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Roshan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Perera" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id="male" />
                            <label htmlFor="male">Male</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id="female" />
                            <label htmlFor="female">Female</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Prefer not to say" id="prefer-not-to-say" />
                            <label htmlFor="prefer-not-to-say">Prefer not to say</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 2: Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Section 2: Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., yourname@example.com" {...field} />
                      </FormControl>
                      <p className="text-sm text-gray-600">This will be our primary method of communication.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobilePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 07X XXX XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1 *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="townCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Town/City *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 3: Cricket Experience & Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Section 3: Cricket Experience & Preferences</CardTitle>
                <p className="text-sm text-gray-600">This helps us with team selection and planning</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="playingRoles"
                  render={() => (
                    <FormItem>
                      <FormLabel>Primary Playing Role(s) * (Select all that apply)</FormLabel>
                      <div className="space-y-2">
                        {["Batsman", "Bowler", "Wicket-Keeper batsman", "All-rounder"].map((role) => (
                          <FormField
                            key={role}
                            control={form.control}
                            name="playingRoles"
                            render={({ field }) => {
                              return (
                                <FormItem key={role} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(role)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, role])
                                          : field.onChange(
                                              field.value?.filter((value) => value !== role)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{role}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="battingStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batting Style *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Right-handed Bat" id="right-bat" />
                            <label htmlFor="right-bat">Right-handed Bat</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Left-handed Bat" id="left-bat" />
                            <label htmlFor="left-bat">Left-handed Bat</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(watchedPlayingRoles?.includes("Bowler") || watchedPlayingRoles?.includes("All-rounder")) && (
                  <>
                    <FormField
                      control={form.control}
                      name="bowlingArm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bowling Arm *</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bowling arm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Right-arm">Right-arm</SelectItem>
                                <SelectItem value="Left-arm">Left-arm</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bowlingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bowling Type *</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bowling type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pace">Pace</SelectItem>
                                <SelectItem value="Off Spin">Off Spin</SelectItem>
                                <SelectItem value="Leg Spin">Leg Spin</SelectItem>
                                <SelectItem value="Left-arm Orthodox">Left-arm Orthodox</SelectItem>
                                <SelectItem value="Left-arm Wrist Spin (Chinaman)">Left-arm Wrist Spin (Chinaman)</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="highestLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Level of Cricket Played Previously *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select highest level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner (New to formal cricket)">Beginner (New to formal cricket)</SelectItem>
                            <SelectItem value="School Level">School Level</SelectItem>
                            <SelectItem value="Club Level (Recreational/Friendly)">Club Level (Recreational/Friendly)</SelectItem>
                            <SelectItem value="Club Level (Competitive League)">Club Level (Competitive League)</SelectItem>
                            <SelectItem value="District/Provincial Level">District/Provincial Level</SelectItem>
                            <SelectItem value="Other (Please specify below)">Other (Please specify below)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedHighestLevel === "Other (Please specify below)" && (
                  <FormField
                    control={form.control}
                    name="otherLevelDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>If "Other," please specify: *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="previousClubs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Cricket Club(s) (if any)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., [Previous Club Name], [Town/City]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 4: Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Section 4: Medical Information</CardTitle>
                <p className="text-sm text-gray-600">
                  All medical information is treated confidentially and used only to ensure your safety during club activities. 
                  It will only be shared with designated first-aiders or medical personnel in an emergency.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="hasMedicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Do you have any medical conditions, disabilities, or severe allergies 
                        (e.g., asthma, epilepsy, diabetes, reactions to insect stings/food) 
                        that the club should be aware of for your safety? *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="medical-yes" />
                            <label htmlFor="medical-yes">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="medical-no" />
                            <label htmlFor="medical-no">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedMedicalConditions === "Yes" && (
                  <FormField
                    control={form.control}
                    name="medicalDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>If Yes, please provide details below: *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the condition/allergy and any emergency action required." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Section 5: For Players Under 18 Years Old */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Section 5: For Players Under 18 Years Old</CardTitle>
                <p className="text-sm text-gray-600">
                  This section MUST be completed by a Parent or Legal Guardian if the applicant is under 18 years of age
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isUnder18"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is the player under 18 years of age? *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="under18-yes" />
                            <label htmlFor="under18-yes">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="under18-no" />
                            <label htmlFor="under18-no">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedIsUnder18 === "Yes" && (
                  <>
                    <FormField
                      control={form.control}
                      name="parentGuardianName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentGuardianEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentGuardianPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Mobile Phone Number *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentalConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I, as the parent/guardian of the applicant, consent to their participation in all Tuskers CC activities. 
                              I also give consent for qualified medical personnel to administer any necessary emergency medical treatment to my child. *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Section 6: Consents & Agreements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Section 6: Consents & Agreements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="codeOfConductAgreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <strong>Tuskers CC Code of Conduct *</strong>
                        </FormLabel>
                        <div className="text-sm text-gray-600 mt-2">
                          <p>Please read the following Code of Conduct summary. By checking the box, you agree to abide by these principles:</p>
                          <p className="mt-2 italic">
                            "As a member of Tuskers CC, I agree to: Uphold the spirit of cricket, demonstrating sportsmanship, 
                            fair play, and respect towards all members, opponents, officials, and spectators. Refrain from any form of abuse, 
                            discrimination, harassment, or language that is offensive or inappropriate. Adhere to all club rules, policies, 
                            and the decisions of club officials during matches and training sessions."
                          </p>
                        </div>
                        <div className="mt-3">
                          <strong>I have read, understood, and agree to abide by the Tuskers CC Code of Conduct as stated above. *</strong>
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photographyConsent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <strong>Photography/Videography Consent *</strong>
                      </FormLabel>
                      <div className="text-sm text-gray-600 mb-3">
                        Tuskers CC may occasionally take photographs or videos of players during matches, training, and club events 
                        for use on the club website, social media, and other promotional materials. Please select your preference:
                      </div>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Consent" id="photo-consent" />
                            <label htmlFor="photo-consent">I consent to the use of my (or my child's) image as described above.</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Do not consent" id="photo-no-consent" />
                            <label htmlFor="photo-no-consent">I DO NOT consent to the use of my (or my child's) image as described above.</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataPrivacyConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <strong>Data Privacy & Use of Information *</strong>
                        </FormLabel>
                        <div className="text-sm text-gray-600 mt-2">
                          <p>Please read the following information about how we use your data. By checking the box, you consent to these uses:</p>
                          <p className="mt-2 italic">
                            "By registering with Tuskers CC, I understand and agree that: The personal information I provide 
                            (including my name, contact details, date of birth, cricket experience, and any medical information supplied for safety reasons) 
                            will be collected, stored, and used by Tuskers CC. This information is required for the purposes of club administration 
                            (e.g., membership records, team selection, communication about club activities, and emergency contact purposes)."
                          </p>
                        </div>
                        <div className="mt-3">
                          <strong>I have read, understood, and agree to the collection and use of my personal data by Tuskers CC as described above. *</strong>
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 7: How Did You Hear About Tuskers CC? */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Section 7: How Did You Hear About Tuskers CC? (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="howDidYouHear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How Did You Hear About Tuskers CC?</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Social Media (Facebook, Instagram, etc.)">Social Media (Facebook, Instagram, etc.)</SelectItem>
                            <SelectItem value="Friend/Family">Friend/Family</SelectItem>
                            <SelectItem value="Club Website">Club Website</SelectItem>
                            <SelectItem value="Local Advertisement">Local Advertisement</SelectItem>
                            <SelectItem value="Other (Please specify)">Other (Please specify)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedHowDidYouHear === "Other (Please specify)" && (
                  <FormField
                    control={form.control}
                    name="otherHearDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>If "Other," please specify:</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit" 
                size="lg"
                disabled={registrationMutation.isPending}
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-8 py-3 text-lg"
              >
                {registrationMutation.isPending ? "Submitting..." : "Join Tuskers CC"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}