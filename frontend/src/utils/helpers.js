export const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
  "Pune", "Ahmedabad", "Kolkata", "Jaipur", "Other",
];

export const validateForm = (form) => {
  const errors = {};
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Full name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";
  if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
    errors.phone = "Phone must be 10 digits";
  if (!form.company.trim())
    errors.company = "Company name is required";
  if (!form.city)
    errors.city = "Please select a city";
  return errors;
};
