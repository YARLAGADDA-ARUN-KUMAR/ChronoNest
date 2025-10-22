import UnauthenticatedNavbar from "../../src/components/UnauthenticatedNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "../../src/components/Footer";

export default function Home() {
  return (
    <>
      <UnauthenticatedNavbar />
      <main className="bg-chrononest flex flex-col items-center justify-start min-h-screen px-6 pt-28 pb-4 relative z-10">
        <section className="max-w-4xl mx-auto text-center md:text-left mb-2 px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-[1.15] drop-shadow-xl tracking-tight">
            Capture Time.
            <br className="hidden md:block" /> Create Legacies.
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed md:leading-loose mb-6">
            ChronoNest helps you preserve life’s most meaningful moments whether
            it’s a message, a video, or a wish meant for the future.
          </p>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed md:leading-loose mb-10">
            Schedule your memories, set heartbeat reminders, and let technology
            deliver your emotions when words truly matter. No apps, no barriers
            just timeless connection.
          </p>
        </section>
        <div className="flex justify-center md:justify-start mb-16">
          <Button
            asChild
            className="px-8 py-4 text-xl text-white font-semibold bg-green-500 hover:bg-green-400 shadow-2xl rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link to="/signup">Start Now</Link>
          </Button>
        </div>
        {/* === FEATURES SECTION === */}
        <section className="flex flex-col md:flex-row gap-8 justify-center w-full max-w-6xl px-4">
          {/* Card 1 */}
          <Card className="relative bg-transparent backdrop-blur-md border border-[rgb(113,245,255)] rounded-2xl text-white shadow-[0_0_12px_rgba(113,245,255,0.5)] transition-all duration-500 flex-1 hover:shadow-[0_0_25px_rgba(113,245,255,0.8)]">
            <CardHeader className="flex flex-col items-start gap-4">
              <div className="p-2 rounded-full bg-[rgba(113,245,255,0.08)] border border-[rgb(113,245,255)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-heart-pulse-fill text-cyan-300"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.475 9C2.702 10.84 4.779 12.871 8 15c3.221-2.129 5.298-4.16 6.525-6H12a.5.5 0 0 1-.464-.314l-1.457-3.642-1.598 5.593a.5.5 0 0 1-.945.049L5.889 6.568l-1.473 2.21A.5.5 0 0 1 4 9z" />
                  <path d="M.88 8C-2.427 1.68 4.41-2 7.823 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C11.59-2 18.426 1.68 15.12 8h-2.783l-1.874-4.686a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-white">
                Heartbeat Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Our “heartbeat” system ensures time capsules release only if you
                miss periodic check-ins a reliable way to pass your memories
                forward.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="relative bg-transparent backdrop-blur-md border border-[rgb(113,245,255)] rounded-2xl text-white shadow-[0_0_12px_rgba(113,245,255,0.5)] transition-all duration-500 flex-1 hover:shadow-[0_0_25px_rgba(113,245,255,0.8)]">
            <CardHeader className="flex flex-col items-start gap-4">
              <div className="p-2 rounded-full bg-[rgba(113,245,255,0.08)] border border-[rgb(113,245,255)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-clock-fill text-cyan-300"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-white">
                Scheduled Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Deliver messages, photos, or videos to loved ones on birthdays,
                anniversaries, or special future moments automatically.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="relative bg-transparent backdrop-blur-md border border-[rgb(113,245,255)] rounded-2xl text-white shadow-[0_0_12px_rgba(113,245,255,0.5)] transition-all duration-500 flex-1 hover:shadow-[0_0_25px_rgba(113,245,255,0.8)]">
            <CardHeader className="flex flex-col items-start gap-4">
              <div className="p-2 rounded-full bg-[rgba(113,245,255,0.08)] border border-[rgb(113,245,255)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-person-fill-slash text-cyan-300"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465m-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                </svg>
              </div>
              <CardTitle className="text-xl font-bold text-white">
                No Signup Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Recipients receive capsules directly through email or WhatsApp
                no extra logins or downloads needed. Simple and personal.
              </p>
            </CardContent>
          </Card>
        </section>

        <Footer />
      </main>
    </>
  );
}
