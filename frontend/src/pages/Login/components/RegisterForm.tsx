import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Alert, Button, Form } from "react-bootstrap";
import RegisterInput from "../../../types/Authentication/RegisterInput";
import { useState } from "react";
import { selectAuthError, selectAuthIsLoading } from "../../../services/Auth/AuthSelectors";
import {register as authRegister} from "../../../services/Auth/AuthSlice";

const RegisterFormSchema = z.object({
  name: z.string().min(3, "Name is required"),
  age: z.coerce.number().gte(18, "Minimum age is 18"),
  state: z.string().min(1, "State is required"),
  phone: z.string().min(10, "Phone number is required")
});
type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>;

function RegisterForm(): JSX.Element {
  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
  });
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthIsLoading);
  const error = useAppSelector(selectAuthError);
  const onSubmit = async (data: RegisterFormSchemaType) => {
    const userRegisterInput: RegisterInput = {
      name: data.name,
      age: data.age,
      state: data.state,
      phone : data.phone
    };
    if (!isLoading) {
      try {
        await dispatch(authRegister(userRegisterInput)).then(() => {
          reset();
          setIsRegisterSuccess(true);
        });
      } catch (err) {
        console.log("Error in register request");
      }
    }
  };

  return (
    <Form className="container mt-3 mb-3" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          {...register("name")}
          isInvalid={errors.name !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="age">
        <Form.Label>Age</Form.Label>
        <Form.Control
          type="number"
          {...register("age")}
          isInvalid={errors.age !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.age?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="phone">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="string"
          {...register("phone")}
          isInvalid={errors.phone !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.phone?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="state">
        <Form.Label>State</Form.Label>
        <Form.Control
          type="string"
          {...register("state")}
          isInvalid={errors.state !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.state?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Button className="w-100" type="submit">
        Register
      </Button>
      {error && (
        <Alert className="mt-3 mb-3" variant="danger">
          {error}
        </Alert>
      )}
      {isLoading && (
        <Alert className="mt-3 mb-3" variant="info">
          Loading...
        </Alert>
      )}
      {isRegisterSuccess && (
        <Alert className="mt-3 mb-3" variant="info">
          User registered successfully!
        </Alert>
      )}
    </Form>
  );
}

export default RegisterForm;
