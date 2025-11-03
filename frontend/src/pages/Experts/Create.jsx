import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema
const schema = yup.object().shape({
  fullname: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  location: yup.string().required("Location is required"),
});

export default function CreateExpert() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const payload = { ...data, role: "expert", password: "password" };
    console.log("🚀 ~ onSubmit ~ payload:", payload)
    await axiosClient.post("/auth/signup", payload);
    // TODO: handle errors
    navigate("/experts");
  };

  return (
    <div style={{ maxWidth: "600px"}} className="">
      <h2 className="text-start">Create Expert</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        {/* Hidden fixed password field so form values include password if needed */}
        <input type="hidden" value="password" {...register("password")} />
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
