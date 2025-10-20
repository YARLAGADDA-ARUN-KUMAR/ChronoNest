import { SignupForm } from "../../src/components/signup-form";

export default function SignUp() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-transparent">
      <div className="w-full max-w-4xl flex justify-center">
        <SignupForm />
      </div>
    </div>
  );
}
