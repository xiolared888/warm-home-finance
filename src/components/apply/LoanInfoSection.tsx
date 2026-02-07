import type { UseFormReturn } from "react-hook-form";
import type { ApplyFormData } from "@/pages/Apply";
import FormField from "./FormField";
import RadioGroup from "./RadioGroup";
import SectionHeading from "./SectionHeading";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/25 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-base";

const selectClass =
  "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/25 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-base appearance-none";

interface Props {
  form: UseFormReturn<ApplyFormData>;
}

const LoanInfoSection = ({ form }: Props) => {
  const { register, formState: { errors }, watch, setValue } = form;

  return (
    <section>
      <SectionHeading title="Loan Information" />

      <div className="space-y-5">
        <FormField label="Loan Amount">
          <select {...register("loanAmount")} className={selectClass}>
            <option value="">Select amount...</option>
            <option value="200-500">$200 – $500</option>
            <option value="500-1000">$500 – $1,000</option>
            <option value="1000-2500">$1,000 – $2,500</option>
            <option value="2500-5000">$2,500 – $5,000</option>
          </select>
        </FormField>

        <FormField label="Loan Purpose" required error={errors.loanPurpose}>
          <input {...register("loanPurpose")} placeholder="e.g. Bills, home repair, medical..." className={inputClass} />
        </FormField>

        <RadioGroup
          label="Direct Deposit?"
          name="hasDirectDeposit"
          options={["Yes", "No"]}
          value={watch("hasDirectDeposit") || ""}
          onChange={(val) => setValue("hasDirectDeposit", val)}
        />

        <RadioGroup
          label="Do you currently have any payday loans?"
          name="hasPaydayLoans"
          options={["Yes", "No"]}
          value={watch("hasPaydayLoans") || ""}
          onChange={(val) => setValue("hasPaydayLoans", val)}
        />

        {watch("hasPaydayLoans") === "Yes" && (
          <RadioGroup
            label="If yes, how many do you have?"
            name="numberOfPaydayLoans"
            options={["1", "2", "3-4", "5 or More"]}
            value={watch("numberOfPaydayLoans") || ""}
            onChange={(val) => setValue("numberOfPaydayLoans", val)}
          />
        )}

        <RadioGroup
          label="Income Source"
          name="incomeSource"
          options={["Employed", "Retired", "Social Security", "Self-employed", "Disability", "Unemployment", "Alimony/Child Support"]}
          value={watch("incomeSource") || ""}
          onChange={(val) => setValue("incomeSource", val)}
        />
      </div>
    </section>
  );
};

export default LoanInfoSection;
