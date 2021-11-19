import axios from "axios";
import { useCallback } from "react";
import { useNewsLists } from "../context/useNewsLists";

export const useNewsFileNameGet = () => {

    const { setNewsLists } = useNewsLists();

    const newsFileNameGet = useCallback(() => {
        axios.get('/api/news/file/view').then(() => {

        }).catch(() => {

        })
    }, []);
    return { newsFileNameGet };
}