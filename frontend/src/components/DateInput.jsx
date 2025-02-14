import { useState } from "react";
import { DateTime } from "luxon";

const DateInput = ({ value, onChange }) => {
  const today = DateTime.now().toFormat("yyyy-MM-dd"); // Default today’s date
  const [selectedDate, setSelectedDate] = useState(value || today);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    onChange(event.target.value); // Pass the date back to the parent component
  };

  return (
    <input
      type="date"
      value={selectedDate}
      onChange={handleDateChange}
      className="border p-2 rounded"
    />
  );
};

export default DateInput;
