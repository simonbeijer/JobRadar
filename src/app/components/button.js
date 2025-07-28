"use client"
export default function CustomButton({text, callBack, type = "button", disabled = false }) {
    return (
        <button 
            onClick={callBack} 
            type={type} 
            disabled={disabled}  
            className="w-full px-4 py-3 bg-primary hover:bg-primary/90 disabled:bg-grey text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
        >
            {text}
        </button>
    );
};