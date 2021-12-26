import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useDecodeJwt } from "../hooks/decoded/useDecodeJwt";
import { User } from "../type/User";


export type LoginUserContextType = {
    loginUser: User | null;
    setLoginUser: Dispatch<SetStateAction<User | null>>
}

export const LoginUserContext = createContext<LoginUserContextType>({} as LoginUserContextType);

type Props = {
    children: ReactNode;
}
export const LoginUserProvider = (props: Props) => {
    const { children } = props;
    const { decodeJwt } = useDecodeJwt();

    const defalutUser = () => {
        const cookiesArray = document.cookie.split(';');
        const  user_cookies = cookiesArray.find(value => value.match(/access_token=/g));
        if(user_cookies !== undefined){
            const cookies = document.cookie;
            const decoded = decodeJwt({ cookies });
            if(decoded){
                const userInfo: User | null = decoded;
                return userInfo;
            } else {
                return null;
            }
        } else return null;
    };
    const [loginUser, setLoginUser] = useState<User | null>(defalutUser());
    return (
        <LoginUserContext.Provider value={{ loginUser, setLoginUser }}>
            {children}
        </LoginUserContext.Provider>
    )
}