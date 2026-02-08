import type { UseFormReturn } from "react-hook-form";
import type { ApplyFormData } from "@/pages/Apply";
import FormField from "./FormField";
import MaskedInput from "./MaskedInput";
import RadioGroup from "./RadioGroup";
import SectionHeading from "./SectionHeading";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/25 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-base";

const selectClass =
  "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/25 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-base appearance-none";

interface Props {
  form: UseFormReturn<ApplyFormData>;
}

const PersonalInfoSection = ({ form }: Props) => {
  const { register, formState: { errors }, watch, setValue } = form;

  return (
    <section>
      <SectionHeading title="Personal Information" />

      <div className="space-y-5">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="First Name" required error={errors.firstName}>
            <input {...register("firstName")} placeholder="First Name" className={inputClass} />
          </FormField>
          <FormField label="Last Name" required error={errors.lastName}>
            <input {...register("lastName")} placeholder="Last Name" className={inputClass} />
          </FormField>
        </div>

        <FormField label="Email Address" required error={errors.email}>
          <input {...register("email")} type="email" placeholder="your@email.com" className={inputClass} />
        </FormField>

        <FormField label="Date of Birth" required error={errors.dateOfBirth}>
          <input {...register("dateOfBirth")} type="date" className={`${inputClass} [color-scheme:dark]`} />
        </FormField>

        <FormField label="Social Security Number" required error={errors.socialSecurityNumber}>
          <MaskedInput
            name="socialSecurityNumber"
            mask="ssn"
            value={watch("socialSecurityNumber") || ""}
            onChange={(val) => setValue("socialSecurityNumber", val, { shouldValidate: false })}
            placeholder="XXX-XX-XXXX"
            className={inputClass}
          />
        </FormField>

        <FormField label="Address" required error={errors.address}>
          <input {...register("address")} placeholder="Street Address" className={inputClass} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField label="City" required error={errors.city}>
            <input {...register("city")} placeholder="City" className={inputClass} />
          </FormField>
          <FormField label="State" required error={errors.state}>
            <input {...register("state")} placeholder="State" className={inputClass} />
          </FormField>
          <FormField label="Zip" required error={errors.zip}>
            <MaskedInput
              name="zip"
              mask="zip"
              value={watch("zip") || ""}
              onChange={(val) => setValue("zip", val, { shouldValidate: false })}
              placeholder="00000"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Cell Phone" required error={errors.cellPhone}>
          <MaskedInput
            name="cellPhone"
            mask="phone"
            value={watch("cellPhone") || ""}
            onChange={(val) => setValue("cellPhone", val, { shouldValidate: false })}
            placeholder="(XXX) XXX-XXXX"
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Driver's License Number" required error={errors.driversLicenseNumber}>
            <input {...register("driversLicenseNumber")} placeholder="License Number" className={inputClass} />
          </FormField>
          <FormField label="Driver's License State" required error={errors.driversLicenseState}>
            <input {...register("driversLicenseState")} placeholder="State" className={inputClass} />
          </FormField>
        </div>

        <RadioGroup
          label="Best Time to Call"
          name="bestTimeToCall"
          options={["AM", "PM"]}
          value={watch("bestTimeToCall") || ""}
          onChange={(val) => setValue("bestTimeToCall", val)}
        />

        <FormField label="How long at current address?">
          <select {...register("howLongAtAddress")} className={selectClass}>
            <option value="">Select...</option>
            <option value="less-than-1">Less than 1 year</option>
            <option value="1-2">1–2 years</option>
            <option value="2-5">2–5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </FormField>
      </div>
    </section>
  );
};

export default PersonalInfoSection;
