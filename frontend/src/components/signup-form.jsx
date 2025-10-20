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
        >
          Back to Home
        </Button>

        <div className="flex justify-center items-center ">
          <ChronoNestLogo />
        </div>
        <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-6 ">
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Arun Kumar"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input id="confirm-password" type="password" required />
                <FieldDescription>Passwords must match.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="profile">
                  Upload Profile Picture (Optional)
                </FieldLabel>
                <Input id="profile" type="file" accept="image/*" />
              </Field>

              <Field>
                <FieldLabel htmlFor="whatsapp">
                  WhatsApp Number (Optional)
                </FieldLabel>
                <Input id="whatsapp" type="tel" placeholder="+91 98765 43210" />
              </Field>

              <Field>
                <FieldLabel htmlFor="contact">
                  Heartbeat Contact (Email or WhatsApp)
                </FieldLabel>
                <Input
                  id="contact"
                  type="text"
                  placeholder="example@gmail.com or +91..."
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="frequency">
                  Heartbeat Frequency (Days)
                </FieldLabel>
                <Input id="frequency" type="number" placeholder="15" min="1" />
              </Field>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="terms"
                required
                className="accent-cyan-400"
              />
              <label htmlFor="terms" className="text-sm">
                Accept{" "}
                <a href="/terms" className="text-cyan-400 hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <div className="flex flex-col items-center mt-6">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 w-full text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up
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
