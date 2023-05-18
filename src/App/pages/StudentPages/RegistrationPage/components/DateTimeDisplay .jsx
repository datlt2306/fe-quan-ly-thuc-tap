
const DateTimeDisplay = ({ value, type, isDanger }) => {
   return (
     <div className="flex gap-2">
       <p className="font-medium text-base text-red">{value}</p>
       <span>{type}</span>
     </div>
   );
 };
 
 export default DateTimeDisplay;
 
 