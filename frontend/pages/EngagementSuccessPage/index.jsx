function EngagementSuccessPage() {
  return (
    <div className="bg-chrononest min-h-screen flex flex-col items-center justify-center text-white text-center p-6">
      <div className="relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)] rounded-2xl shadow-[0_0_24px_rgba(113,245,255,0.65)] p-10 max-w-lg transition-all duration-500 before:absolute before:inset-0 before:border before:border-[rgb(113,245,255)] before:opacity-50 before:blur-xl before:pointer-events-none">
        <h1 className="text-3xl font-bold text-cyan-200 mb-4">Thank You!</h1>
        <p className="text-slate-300 text-lg mb-6">
          Your click has been registered. We're glad to know you're still with
          us!
        </p>
        <a
          href="/dashboard"
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-[0_0_12px_rgba(113,245,255,0.6)]"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export default EngagementSuccessPage;
