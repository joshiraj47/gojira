import {useState} from "react";

export const useLocalStorage = (key, defaultValue) => {
    const [storedValue, setStoredValue] = useState(setDefaultValue);

    function setDefaultValue() {
        try {
            const value = window.localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            } else {
                setItemInLocalStorage(key, defaultValue);
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    }

    function setNewValue(newValue) {
        console.log("new: ", newValue, "key: ", key);
        try {
            setItemInLocalStorage(key, newValue);
        } catch (err) {
            console.log(err);
        }
        setStoredValue(newValue);
    }

    function setItemInLocalStorage(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    return [storedValue, setNewValue];
}
