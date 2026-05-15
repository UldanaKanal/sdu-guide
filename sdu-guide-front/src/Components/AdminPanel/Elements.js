export function Input({ type, placeholder, value, onChange }) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-lg mb-2"
        style={{height:"50px"}}
      />
    );
  }
  
  export function Button({ children, onClick }) {
    return (
      <button
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        onClick={onClick}
        style={{backgroundColor:"#f0776c", height:"50px"}}
      >
        {children}
      </button>
    );
  }