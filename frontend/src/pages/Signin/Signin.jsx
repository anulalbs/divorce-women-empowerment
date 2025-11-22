import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "./Signin.scss";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice";
import axiosClient from "../../api/axiosClient";

// ✅ Validation Schema
const schema = yup.object().shape({
    identifier: yup
        .string()
        .required("Email or phone is required")
        .test("emailOrPhone", "Enter a valid email or 10-digit phone", (value) => {
            if (!value) return false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{10}$/;
            return emailRegex.test(value) || phoneRegex.test(value);
        }),
    password: yup.string().required("Password is required"),
});

export default function Signin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        const {data: { token, user: {
            _id, fullname, email, isActive, location, phone, role
        } }} = await axiosClient.post("/auth/signin", data);
        //TODO: handle errors
        dispatch(
            login({ _id, fullname, email, isActive, location, phone, role })
        );
        localStorage.setItem(`token`, token);
        localStorage.setItem(`user`, JSON.stringify({ _id, fullname, email, isActive, location, phone, role }));
        navigate("/");
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
                <div className="form-group">
                    <label>Email or Phone</label>
                    <input type="text" {...register("identifier")} />
                    <p className="error">{errors.identifier?.message}</p>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" {...register("password")} />
                    <p className="error">{errors.password?.message}</p>
                </div>

                <button type="submit" className="btn-submit">Sign In</button>
            </form>

            <p className="signup-link">
                Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
}
