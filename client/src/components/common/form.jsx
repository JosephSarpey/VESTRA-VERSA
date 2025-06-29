import { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => {
        // Get current array of values or initialize as empty array
        const currentValues = Array.isArray(prev[name]) ? [...prev[name]] : [];
        
        // Update the array based on checkbox state
        const updatedValues = checked
          ? [...currentValues, value] // Add value if checked
          : currentValues.filter(item => item !== value); // Remove value if unchecked
        
        // Return updated state
        return {
          ...prev,
          [name]: updatedValues
        };
      });
    } else {
      // Handle other input types normally
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formControls.map((control) => {
        const { name, label, type, placeholder, componentType, options } = control;

        return (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
              {label}
            </label>

            {componentType === "input" && type === "password" ? (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id={name}
                  name={name}
                  value={formData[name]}
                  placeholder={placeholder}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
                >
                  {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                </span>
              </div>
            ) : componentType === "input" ? (
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                placeholder={placeholder}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
            ) : componentType === "textarea" ? (
              <textarea
                id={name}
                name={name}
                value={formData[name]}
                placeholder={placeholder}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
            ) : componentType === "select" ? (
              <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              >
                <option value="">Select...</option>
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : componentType === "checkboxes" ? (
              <div className="flex flex-col gap-2">
                {options.map((option) => (
                  <label key={option.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={name}
                      value={option.id}
                      checked={formData[name]?.includes(option.id) || false}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="submit"
        className="w-full bg-black text-[#FFD700] py-2 rounded-lg font-semibold hover:bg-gray-900 transition-all flex justify-center items-center gap-2"
      >
        {buttonText}
      </button>
    </form>
  );
}

export default CommonForm;
