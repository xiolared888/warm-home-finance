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

const BankInfoSection = ({ form }: Props) => {
  const { register, formState: { errors }, watch, setValue } = form;

  return (
    <section>
      <SectionHeading title="Bank Information" />

      <div className="space-y-5">
        <FormField label="Bank Name" required error={errors.bankName}>
          <input {...register("bankName")} placeholder="Bank Name" className={inputClass} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Account #" required error={errors.accountNumber}>
            <input {...register("accountNumber")} placeholder="Account Number" className={inputClass} />
          </FormField>
          <FormField label="Routing #" required error={errors.routingNumber}>
            <input {...register("routingNumber")} placeholder="Routing Number" className={inputClass} />
          </FormField>
        </div>

        <RadioGroup
          label="How often do you get paid?"
          name="paymentFrequency"
          options={["Bi-weekly", "Twice monthly", "Monthly", "Other/Infrequent"]}
          value={watch("paymentFrequency") || ""}
          onChange={(val) => setValue("paymentFrequency", val)}
        />

        <FormField label="Are you employed by the U.S. Military or direct family member?">
          <textarea
            {...register("militaryAffiliation")}
            placeholder="Please provide any relevant details..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </FormField>
      </div>
    </section>
  );
};

export default BankInfoSection;
