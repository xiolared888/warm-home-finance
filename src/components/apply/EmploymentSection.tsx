import type { UseFormReturn } from "react-hook-form";
import type { ApplyFormData } from "@/pages/Apply";
import FormField from "./FormField";
import RadioGroup from "./RadioGroup";
import SectionHeading from "./SectionHeading";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/25 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-base";

interface Props {
  form: UseFormReturn<ApplyFormData>;
}

const EmploymentSection = ({ form }: Props) => {
  const { register, formState: { errors }, watch, setValue } = form;

  return (
    <section>
      <SectionHeading title="Employment Information" />

      <div className="space-y-5">
        <FormField label="Employer Name" required error={errors.employerName}>
          <input {...register("employerName")} placeholder="Employer Name" className={inputClass} />
        </FormField>

        <RadioGroup
          label="Employment Status"
          name="employmentStatus"
          options={["Employed", "Unemployed"]}
          value={watch("employmentStatus") || ""}
          onChange={(val) => setValue("employmentStatus", val)}
        />

        <RadioGroup
          label="Do you have a co-applicant?"
          name="hasCoApplicant"
          options={["Yes", "No"]}
          value={watch("hasCoApplicant") || ""}
          onChange={(val) => setValue("hasCoApplicant", val)}
        />

        <RadioGroup
          label="If employed, how long employed?"
          name="howLongEmployed"
          options={["Full-time only", "2+ years", "Occasional"]}
          value={watch("howLongEmployed") || ""}
          onChange={(val) => setValue("howLongEmployed", val)}
        />

        <FormField label="Additional Employer Name" error={errors.employerName2}>
          <input {...register("employerName2")} placeholder="Employer Name" className={inputClass} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Work Phone Number" error={errors.workPhoneNumber}>
            <input {...register("workPhoneNumber")} type="tel" placeholder="(XXX) XXX-XXXX" className={inputClass} />
          </FormField>
          <FormField label="Work Phone Number (Alt)" error={errors.workPhoneNumber2}>
            <input {...register("workPhoneNumber2")} type="tel" placeholder="(XXX) XXX-XXXX" className={inputClass} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Employer Phone Number" error={errors.employerPhoneNumber}>
            <input {...register("employerPhoneNumber")} type="tel" placeholder="(XXX) XXX-XXXX" className={inputClass} />
          </FormField>
          <FormField label="Employer Phone Number (Alt)" error={errors.employerPhoneNumber2}>
            <input {...register("employerPhoneNumber2")} type="tel" placeholder="(XXX) XXX-XXXX" className={inputClass} />
          </FormField>
        </div>

        <FormField label="Employer Address" error={errors.employerAddress}>
          <input {...register("employerAddress")} placeholder="Employer Address" className={inputClass} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Employer City" error={errors.employerCity}>
            <input {...register("employerCity")} placeholder="City" className={inputClass} />
          </FormField>
          <FormField label="Employer Zip" error={errors.employerZip}>
            <input {...register("employerZip")} placeholder="Zip" className={inputClass} />
          </FormField>
        </div>

        <FormField label="Supervisor Name" error={errors.supervisorName}>
          <input {...register("supervisorName")} placeholder="Supervisor Name" className={inputClass} />
        </FormField>
      </div>
    </section>
  );
};

export default EmploymentSection;
