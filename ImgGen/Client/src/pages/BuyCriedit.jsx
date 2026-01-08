import { useState } from "react";

const UPI_ID = "juttigabheemeswar-1@okicici";
const QR_IMAGE = "/upi-qr.png";

const plans = [
  { id: "Basic", price: 10, credits: 100 },
  { id: "Advanced", price: 50, credits: 500 },
  { id: "Business", price: 250, credits: 5000 },
];

function BuyCredit(){

  const [selectedPlan, setSelectedPlan] = useState(null);   
  const [file, setFile] = useState(null);

  const submitProof = () => {

    if(!selectedPlan){
      alert("Please select a plan first");
      return;
    }

    if(!file){
      alert("Please upload payment screenshot");
      return;
    }

    window.location.href =
      `http://localhost/Sendingmail/payment_mail.php?plan=${selectedPlan}`;
  };


  return (
    <div className="min-h-screen from-white to-orange-50 text-center py-10">

      <h1 className="text-3xl font-bold mb-6">Choose a Plan</h1>

      <div className="flex gap-6 justify-center my-6">

        {plans.map(p => (
          <div
            key={p.id}
            className={`p-6 rounded-xl shadow cursor-pointer border transition transform
            ${selectedPlan===p.id ? "border-black scale-105 bg-white"
            : "border-gray-300 bg-gray-50"}`}
            onClick={()=>setSelectedPlan(p.id)}
          >
            <p className="font-semibold">{p.id}</p>
            <p className="text-2xl mt-1">₹{p.price}</p>
            <p className="text-sm mt-1 opacity-70">{p.credits} credits</p>
          </div>
        ))}

      </div>

      {!selectedPlan && (
        <p className="text-sm text-red-600 mt-[-10px]">
          Please select a plan
        </p>
      )}

      <h2 className="text-lg font-semibold mt-6">Pay using UPI</h2>
      <p className="text-sm opacity-60">Scan this QR</p>

      <img src={QR_IMAGE} className="mx-auto w-40 my-4" />

      <p className="font-mono">
        <b>{UPI_ID}</b>
      </p>

      <p className="text-xs opacity-50 mt-1">
        Pay exact amount as per selected plan
      </p>

      <div className="mt-8">

        <label className="bg-black text-white px-5 py-2 rounded cursor-pointer">
          Upload Screenshot
          <input type="file" hidden onChange={e=>setFile(e.target.files[0])}/>
        </label>

        {file && (
          <p className="mt-2 text-sm opacity-70">
            Selected: {file.name}
          </p>
        )}
      </div>

      <button
        onClick={submitProof}
        className="bg-black text-white px-6 py-2 rounded mt-6"
      >
        Submit Payment Proof
      </button>

    </div>
  );
}

export default BuyCredit;
