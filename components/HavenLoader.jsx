function HavenLoader({ label = "Uploading images..." }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/25 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-[#2D5A4C]/20 border-t-[#2D5A4C] animate-spin" />
          <div>
            <p className="text-sm font-bold text-[#1A2B2B]">{label}</p>
            <p className="text-xs text-gray-400 mt-1">
              Please don’t close the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HavenLoader;