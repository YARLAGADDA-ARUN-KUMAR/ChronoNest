import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ChronoNestLogo = () => (
  <div className="flex items-center gap-2 my-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-white"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    <span className="text-4xl font-bold text-white">ChronoNest</span>
  </div>
);

export function SignupForm({ className, ...props }) {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: null,
    whatsapp: "",
    contact: "",
    frequency: 30,
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key, val) => setFields((f) => ({ ...f, [key]: val }));
  const handleFile = (e) => handleChange("profile", e.target.files[0]);

  const validate = () => {
    if (
      !fields.name ||
      !fields.email ||
      !fields.password ||
      !fields.confirmPassword ||
      !fields.contact
    )
      return "All mandatory fields are required.";
    if (fields.password.length < 8)
      return "Password must be at least 8 characters.";
    if (fields.password !== fields.confirmPassword)
      return "Passwords do not match.";
    if (!fields.terms) return "You must accept Terms & Conditions.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const valError = validate();
    if (valError) return setError(valError);

    setError("");
    setLoading(true);

    let data;
    if (fields.profile) {
      data = new FormData();
      for (const key in fields) {
        // FormData doesn't handle boolean well, convert to string
        if (fields[key] != null) data.append(key, fields[key] + "");
      }
    } else {
      data = { ...fields };
      delete data.profile;
    }

    const result = await signup(data);
    setLoading(false);

    if (result.success) navigate("/dashboard");
    else setError(result.message || "Signup failed. Try again.");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Card
      className={cn(
        "relative w-[800px] mx-auto bg-transparent backdrop-blur-none border border-[rgb(113,245,255)] rounded-2xl text-white shadow-[0_0_10px_rgba(113,245,255,0.5)] transition-all duration-500",
        "before:absolute before:inset-0 before:rounded-2xl before:border before:border-[rgb(113,245,255)] before:opacity-50 before:blur-md before:pointer-events-none",
        className
      )}
      {...props}
    >
      <CardHeader className="text-center pt-8 pr-8 pl-8">
        <Button
          variant="outline"
          className="absolute top-6 left-6 text-xs bg-transparent border-slate-600 hover:bg-slate-700/50 hover:text-white h-8 px-3 "
          onClick={handleHomeClick}
        >
          Back to Home
        </Button>
        <div className="flex justify-center items-center ">
          <ChronoNestLogo />
        </div>
        <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Arun Kumar"
                  required
                  value={fields.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  value={fields.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={fields.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={fields.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                />
                <FieldDescription>Passwords must match.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="profile">
                  Upload Profile Picture (Optional)
                </FieldLabel>
                <Input
                  id="profile"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="whatsapp">
                  WhatsApp Number (Optional)
                </FieldLabel>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={fields.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="contact">
                  Heartbeat Contact (Email or WhatsApp)
                </FieldLabel>
                <Input
                  id="contact"
                  type="text"
                  placeholder="example@gmail.com or +91..."
                  required
                  value={fields.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="frequency">
                  Heartbeat Frequency (Days)
                </FieldLabel>
                <Input
                  id="frequency"
                  type="number"
                  placeholder="15"
                  min="1"
                  value={fields.frequency}
                  onChange={(e) => handleChange("frequency", e.target.value)}
                />
              </Field>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="terms"
                checked={fields.terms}
                onChange={(e) => handleChange("terms", e.target.checked)}
                className="accent-cyan-400"
              />
              <label htmlFor="terms" className="text-sm">
                Accept{" "}
                <a href="/terms" className="text-cyan-400 hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>
            {error && (
              <div className="text-red-400 text-center text-sm mt-2">
                {error}
              </div>
            )}
            <div className="flex flex-col items-center mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 w-full text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
              <p className="text-sm mt-3">
                Already have an account?{" "}
                <a href="/login" className="text-cyan-400 hover:underline">
                  Login
                </a>
              </p>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
