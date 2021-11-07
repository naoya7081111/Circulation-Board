import axios from "axios";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useCommunityLists } from "../context/useCommunityLists";
import { useLoginCommunity } from "../context/useLoginCommunity";
import { useLoginUser } from "../context/useLoginUser";
import { useMessage } from "../useMessage";

export const useLogout = () => {

    const history = useHistory();
    const { setLoginUser } = useLoginUser();
    const { showMessage } = useMessage();
    const { setLoginCommunity } = useLoginCommunity();
    const { setCommunityLists } = useCommunityLists();

    const logout = useCallback(() => {
        axios.get('/api/logout').then((res) => {
            setLoginUser(null);
            setLoginCommunity(null);
            setCommunityLists([]);
            history.push('/');
            showMessage({ title: res.data.message, status: "success" })
        }).catch((error) => {
            showMessage({ title: "ログアウトに失敗しました",  status: "error"});
        })        
    }, [setLoginUser, showMessage, setLoginCommunity, setCommunityLists, history]);

    return { logout };
};