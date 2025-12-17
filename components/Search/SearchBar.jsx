import React from "react";
import { Search } from "lucide-react";
import Button from "../ui/Button";

const SearchBar = ({ placeholder = "Where do you want to go?",  }) => {
    return (
        <div className="max-w-3xl mx-auto mt-10 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex flex-col md:flex-row gap-2">

            {/* Input */}
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-white placeholder:text-white/70 text-lg outline-none"
                />
            </div>

            {/* Button */}
            <Button
            title={"Search Hotels"}
                className="h-12 px-8  bg-primary border-[1px]  hover:bg-primary/90 text-lg font-medium"
                rounded="rounded-full"
                // onClick={onSearch}
            />

        </div>
    );
};

export default SearchBar;
