"use client";

export default function ClientSidePrint() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-primary text-on-primary px-6 py-2 rounded font-bold hover:brightness-90 transition flex items-center gap-2"
    >
      <span className="material-symbols-outlined">print</span> Print / Download PDF
    </button>
  );
}
