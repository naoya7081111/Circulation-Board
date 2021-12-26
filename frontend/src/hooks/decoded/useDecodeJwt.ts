import { useCallback } from "react";
import { useMessage } from "../useMessage";

type Props = {
    cookies: string;
}

export const useDecodeJwt = () => {

    const { showMessage } = useMessage();

    const decodeJwt = useCallback((props: Props) => {


        const { cookies } = props;

        const cookiesArray = cookies.split(';');
        const  access_cookies = cookiesArray.find(value => value.match(/access_token=/g));

        if(access_cookies === undefined){
            showMessage({ title: 'cookieのエラーです', status: 'error' });
            return null;
        } else {
            const base64Url = access_cookies.split('.')[1];   
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');    
            const decoded = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    
            const userId: number = decoded.user[0].id;
            const userName: string = decoded.user[0].username;
            const userEmail: string = decoded.user[0].email;
            const userImageName: string = decoded.user[0].imagename;
            const userSentence: string = decoded.user[0].sentence;
            const userArea: string = decoded.user[0].area;
            const userSite: string = decoded.user[0].site;

            return {
                userId: userId,
                userName: userName,
                userEmail: userEmail,
                userImageName: userImageName,
                userSentence: userSentence,
                userArea: userArea,
                userSite: userSite
            }    
        }

    }, [showMessage]);
    return { decodeJwt };
};
 // 参考：https://qiita.com/johnslith/items/d11f827f8b14913b4a28