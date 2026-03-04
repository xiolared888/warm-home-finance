import { useState } from "react";
import { Send, User, Mail, Phone, MapPin, DollarSign, Briefcase, Calendar, FileText } from "lucide-react";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const WEBHOOK_URL = "https://annettepartida.app.n8n.cloud/webhook-test/loan-application";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(50),
  loanAmount: z.number({ invalid_type_error: "Loan amount is required" }).positive("Loan amount must be positive"),
  employmentStatus: z.enum(["Employed", "Unemployed", "Self-Employed"], { required_error: "Please select employment status" }),
  monthlyIncome: z.number({ invalid_type_error: "Monthly income is required" }).nonnegative("Income must be 0 or more"),
  monthlyExpenses: z.number({ invalid_type_error: "Estimated monthly expenses is required" }).nonnegative("Expenses must be 0 or more"),
  dob: z.string().min(1, "Date of birth is required"),
  notes: z.string().min(1, "Additional notes are required").max(1000),
});

type ApplicationData = z.infer<typeof applicationSchema>;

const initialForm: ApplicationData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  loanAmount: 0,
  employmentStatus: "Employed",
  monthlyIncome: 0,
  monthlyExpenses: 0,
  dob: "",
  notes: "",
};

const Apply = () => {
  const [formData, setFormData] = useState<ApplicationData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
    if (errors[name as keyof ApplicationData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = applicationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ApplicationData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ApplicationData;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      toast({
        title: "Application Submitted",
        description: "Application submitted successfully. We will contact you soon.",
      });
      setFormData(initialForm);
    } catch {
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200";
  const errorClass = "text-sm text-destructive mt-1";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Banner */}
        <section className="bg-primary py-16 md:py-20">
          <div className="container-narrow text-center">
            <h1 className="text-3xl md:text-5xl font-serif text-primary-foreground mb-4">
              Apply for a Loan
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Complete the form below to start your application. Our team will review it and contact you soon.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 section-cream">
          <div className="container-narrow max-w-2xl">
            <form onSubmit={handleSubmit} className="card-trust space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-serif text-foreground mb-6">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} className={inputClass} />
                    </div>
                    {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleChange} className={inputClass} />
                    </div>
                    {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 mt-5">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} className={inputClass} />
                    </div>
                    {errors.email && <p className={errorClass}>{errors.email}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} className={inputClass} />
                    </div>
                    {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth (DOB) *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} />
                  </div>
                  {errors.dob && <p className={errorClass}>{errors.dob}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="text-xl font-serif text-foreground mb-6">Address</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleChange} className={inputClass} />
                    </div>
                    {errors.city && <p className={errorClass}>{errors.city}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" name="state" placeholder="State *" value={formData.state} onChange={handleChange} className={inputClass} />
                    </div>
                    {errors.state && <p className={errorClass}>{errors.state}</p>}
                  </div>
                </div>
              </div>

              {/* Loan Information */}
              <div>
                <h2 className="text-xl font-serif text-foreground mb-6">Loan Information</h2>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="number" name="loanAmount" placeholder="Loan Amount *" value={formData.loanAmount || ""} onChange={handleChange} className={inputClass} min="0" />
                </div>
                {errors.loanAmount && <p className={errorClass}>{errors.loanAmount}</p>}
              </div>

               {/* Financial Information */}
               <div>
                 <h2 className="text-xl font-serif text-foreground mb-6">Financial Information</h2>
                 <div className="grid sm:grid-cols-2 gap-5">
                   <div>
                     <div className="relative">
                       <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                       <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer"}>
                         <option value="Employed">Employed</option>
                         <option value="Unemployed">Unemployed</option>
                         <option value="Self-Employed">Self-Employed</option>
                       </select>
                     </div>
                     {errors.employmentStatus && <p className={errorClass}>{errors.employmentStatus}</p>}
                   </div>
                   <div>
                     <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                       <input type="number" name="monthlyIncome" placeholder="Monthly Income *" value={formData.monthlyIncome || ""} onChange={handleChange} className={inputClass} min="0" />
                     </div>
                     {errors.monthlyIncome && <p className={errorClass}>{errors.monthlyIncome}</p>}
                   </div>
                 </div>
                 <div className="mt-5">
                   <div className="relative">
                     <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                     <input type="number" name="monthlyExpenses" placeholder="Estimated Monthly Expenses *" value={formData.monthlyExpenses || ""} onChange={handleChange} className={inputClass} min="0" />
                   </div>
                   {errors.monthlyExpenses && <p className={errorClass}>{errors.monthlyExpenses}</p>}
                 </div>
               </div>

               {/* Notes */}
               <div>
                 <h2 className="text-xl font-serif text-foreground mb-6">Additional Notes (Required)*</h2>
                 <div className="relative">
                   <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                   <Textarea
                     name="notes"
                     placeholder="Please provide details about: loan purpose, repayment timeline, and any other relevant information..."
                     value={formData.notes}
                     onChange={handleChange}
                     className="pl-12 min-h-[120px] rounded-xl border-border"
                   />
                 </div>
                 {errors.notes && <p className={errorClass}>{errors.notes}</p>}
               </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Apply;
