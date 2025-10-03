import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Signup.scss";

// ✅ Validation Schema
const schema = yup.object().shape({
  fullname: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  location: yup.string().required("Location is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  consent: yup.boolean().oneOf([true], "You must accept terms & privacy"),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Signup Data:", data);
    alert("Signup successful!");
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" {...register("fullname")} />
          <p className="error">{errors.fullname?.message}</p>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="text" {...register("phone")} />
          <p className="error">{errors.phone?.message}</p>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" {...register("location")} />
          <p className="error">{errors.location?.message}</p>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
          <p className="error">{errors.password?.message}</p>
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" {...register("confirmPassword")} />
          <p className="error">{errors.confirmPassword?.message}</p>
        </div>

        <div className="form-group checkbox">
          <label>
            <input type="checkbox" {...register("consent")} /> I agree to the{" "}
            <a href="#">Consent & Privacy Policy</a>
          </label>
          <p className="error">{errors.consent?.message}</p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Submit</button>
          <button type="button" className="btn-clear" onClick={() => reset()}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
