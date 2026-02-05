import { useState } from "react";

const useTogglePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);
    return { showPassword, togglePassword };
};

export default useTogglePassword