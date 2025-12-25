import React from "react";
import { Search } from "lucide-react";
import Button from "../ui/Button";

const SearchBar = ({ placeholder = "Where do you want to go?" }) => {
    return (
        /* - Changed rounded-full to rounded-2xl on mobile, rounded-full on md+
           - Added horizontal padding (px-4) for mobile 
        */
        <div className="max-w-3xl mx-auto mt-6 md:mt-10 p-2 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-full border border-white/20 flex flex-col md:flex-row gap-2 shadow-xl">

            {/* Input Wrapper */}
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <input
                    type="text"
                    placeholder={placeholder}
                    /* Adjusted text size for mobile (text-base) vs desktop (text-lg) */
                    className="w-full h-12 md:h-14 pl-12 pr-4 bg-transparent border-none text-white placeholder:text-white/60 text-base md:text-lg outline-none"
                />
            </div>

            {/* Button */}
            <Button
                title={"Search"}
                /* - On mobile: full width (w-full)
                   - On desktop: auto width with padding (md:w-auto md:px-10)
                */
                className="h-12 md:h-14 w-full md:w-auto px-8 bg-primary border-[1px] border-white/10 hover:bg-primary/90 text-base md:text-lg font-medium transition-all active:scale-95"
                rounded="rounded-xl md:rounded-full"
            />

        </div>
    );
};

export default SearchBar;