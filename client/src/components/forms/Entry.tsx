import React, { FC, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  TextField,
} from "@material-ui/core";
import Api from "../../util/Api";
import { useEntry } from "../../context/EntryContext";
import { IEntry } from "../../common/types";
import ReactHookFormSelect from "./ReactHookFormSelect";
import { useAuth } from "../../context/AuthContext";
import SimpleSnackbar from "../SnackBar";
import { AxiosResponse } from "axios";
import { EMonth } from "../../common/enums";

const inputType = [
  { value: 0, text: "Income" },
  { value: 1, text: "Expense" },
];

interface IFormData {
  _id?: string;
  uid: string;
  name: string;
  year: number;
  inputType: number;
  monthlyAmount: IFormDataFieldArray[];
  maxAmount: number;
  isFixed: boolean;
  amount: number;
}

interface IFormDataFieldArray {
  name: number;
}

interface Props {
  entry?: IEntry;
  isEditing?: boolean;
}

const EntryForm: FC<Props> = ({ entry, isEditing }) => {
  const {
    register,
    watch,
    control,
    getValues,
    errors,
    setValue,
    handleSubmit,
  } = useForm<IEntry>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "monthlyAmount",
  });

  const { user } = useAuth();
  const { setEntry } = useEntry();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  const watchIsFixed = watch("isFixed", true);

  console.log(entry);
  if (isEditing) {
    setValue("name", entry!.name);
    setValue("year", entry!.year);
    setValue("inputType", entry!.inputType);
    setValue("maxAmount", entry!.maxAmount.toFixed(2));
    const isFixed = entry!.monthlyAmount.every(amount => amount === entry!.monthlyAmount[0]);
    if (isFixed) {
      setValue("amount", entry!.monthlyAmount[0]);
    }
    else {
      setValue("isFixed", true);
      entry!.monthlyAmount.forEach((amount, i) => {
        setValue(`monthlyAmount[${i}].name`, amount);
      });
    }
  }

  const onSubmit = async (formData: IFormData) => {
    let transformedMonthlyAmount = new Array<number>(12);
    if (formData.isFixed) {
      transformedMonthlyAmount.fill(formData.amount);
    } else {
      // each monthly value is stored in an object with the name key due to react-form-hooks api
      transformedMonthlyAmount = formData.monthlyAmount.map((month: IFormDataFieldArray) => month.name);
    }
    let inputEntry: IEntry = {
      uid: user.uid as string,
      name: formData.name,
      year: formData.year,
      inputType: formData.inputType,
      monthlyAmount: transformedMonthlyAmount,
      maxAmount: formData.maxAmount,
    };
    try {
      const res: AxiosResponse<IEntry> = await Api.post("/entry", inputEntry);
      let entry = res.data;
      setFormSubmitted(true);
      // reset after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
      setEntry(entry);
    } catch (error) {
      setFormError(true);
      // reset after 5 seconds
      setTimeout(() => {
        setFormError(false);
      }, 5000);
    }
  };

  useEffect(() => {
    if (watchIsFixed) {
      remove(Array.from(Array(12).keys()));
    } else {
      for (let i = 0; i < 12; i++) append({ monthlyAmount: 0 });
    }
  }, [watchIsFixed, append, remove]);

  return (
    <Paper
      style={{
        width: "50%",
        margin: "0 auto",
        padding: "1em",
      }}
    >
      <SimpleSnackbar isOpen={formSubmitted} message={"Form Submitted"} />
      <SimpleSnackbar isOpen={formError} message={"Error"} />
      <form autoComplete="off">
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <TextField
              id="standard-basic"
              label="Name"
              name="name"
              inputRef={register({ required: true })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="standard-basic"
              label="Year"
              name="year"
              inputRef={register({ required: true })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReactHookFormSelect
              name="inputType"
              label="Choose type of input"
              defaultValue={inputType[0].value}
              control={control}
            >
              {inputType.map((input) => (
                <MenuItem key={input.value} value={input.value}>
                  {input.text}
                </MenuItem>
              ))}
            </ReactHookFormSelect>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Max Amount"
              name="maxAmount"
              inputRef={register({
                pattern: {
                  value: /^[0-9]+\.[0-9][0-9]/i,
                  message: "E.g. 1.00",
                },
              })}
              defaultValue={"100.00"}
              error={!!errors.maxAmount?.message}
              helperText={errors.maxAmount?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox defaultChecked={true} value={watchIsFixed} />}
              inputRef={register}
              name="isFixed"
              label="Fixed Amount"
            />
          </Grid>
          {watchIsFixed ? (
            <Grid item xs={12} md={6}>
              <TextField
                id="standard-adornment-amount"
                label="Amount"
                name="amount"
                inputRef={register({
                  pattern: {
                    value: /^[0-9]+\.[0-9][0-9]/i,
                    message: "Example format: 1.00",
                  },
                })}
                defaultValue={register}
                helperText={"Example format: 1.00"}
                fullWidth
              />
            </Grid>
          ) : (
              fields.map((field, index) => (
                <Grid item xs={6} key={field.id}>
                  <Controller
                    as={
                      <TextField
                        id="standard-adornment-amount"
                        name="monthlyAmount"
                        label={`${EMonth[index]} Amount`}
                        inputRef={register({
                          pattern: {
                            value: /^[0-9]+\.[0-9][0-9]/i,
                            message: "Example format: 1.00",
                          },
                        })}
                        // defaultValue={getValues("maxAmount")}
                        // @ts-ignore
                        // error={!!errors.monthlyAmount[index].names.message}
                        // @ts-ignore
                        helperText={"Example format: 1.00"}
                        fullWidth
                      />
                    }
                    name={`monthlyAmount[${index}].name`}
                    control={control}
                    defaultValue={getValues("maxAmount")}
                  />
                </Grid>
              ))
            )}
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              Add Entry
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EntryForm;
