
const DateTimeDisplay = ({ value, type }) => {
   return (
     <div className="flex gap-2">
       <p className="font-bold text-base text-red">{value}</p>
       <span className="font-medium">{type}</span>
     </div>
   );
 };
 
 export default DateTimeDisplay;
 
 