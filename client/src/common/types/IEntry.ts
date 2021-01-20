import { FieldErrors } from "react-hook-form";

export interface IEntry {
  _id?: string;
  uid: string;
  name: string;
  year: number;
  inputType: number;
  monthlyAmount: number[];
  maxAmount: number;
}
