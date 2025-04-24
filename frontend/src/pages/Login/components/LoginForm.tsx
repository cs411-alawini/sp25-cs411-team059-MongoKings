import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAuthError, selectAuthIsLoading } from "../../../services/Auth/AuthSelectors";
import LoginInput from "../../../types/Authentication/LoginInput";
import { login } from "../../../services/Auth/AuthSlice";
import { Alert, Button, Form } from "react-bootstrap";

const LoginFormSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(3, "Password is required"),
});
type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

function LoginForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
  });
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthIsLoading);
  const error = useAppSelector(selectAuthError);
  const onSubmit = (data: LoginFormSchemaType) => {
    const userLogin: LoginInput = {
      username: data.username,
      password: data.password,
    };
    if (!isLoading) {
      dispatch(login(userLogin));
    }
  };

  return (
    <Form className="container mt-3 mb-3" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          {...register("username")}
          isInvalid={errors.username !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          {...register("password")}
          isInvalid={errors.password !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Button className="w-100" type="submit">
        Log in
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
    </Form>
  );
}

export default LoginForm;
