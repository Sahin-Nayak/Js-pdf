import generateInvoice from "./utils/generateInvoice";

export default function App() {
  return (
    <div style={{ padding: 40 }}>
      <button onClick={generateInvoice}>
        Download Invoice
      </button>
    </div>
  );
}
