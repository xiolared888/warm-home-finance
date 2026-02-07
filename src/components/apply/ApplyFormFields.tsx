import type { UseFormReturn } from "react-hook-form";
import type { ApplyFormData } from "@/pages/Apply";
import PersonalInfoSection from "./PersonalInfoSection";
import EmploymentSection from "./EmploymentSection";
import LoanInfoSection from "./LoanInfoSection";
import BankInfoSection from "./BankInfoSection";

interface ApplyFormFieldsProps {
  form: UseFormReturn<ApplyFormData>;
}

const ApplyFormFields = ({ form }: ApplyFormFieldsProps) => {
  return (
    <>
      <PersonalInfoSection form={form} />
      <EmploymentSection form={form} />
      <LoanInfoSection form={form} />
      <BankInfoSection form={form} />
    </>
  );
};

export default ApplyFormFields;
